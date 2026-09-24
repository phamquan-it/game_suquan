// lib/b2-storage.ts
//
// Config + helper đọc bucket B2, dùng chung cho route handler và server action.
//
// Trước đây bucketId/bucketName/downloadHost bị hardcode rải rác ở
// src/app/api/get-download-link/route.ts, src/lib/b2-upload.ts và
// src/app/admin/b2/upload-url/page.tsx. Gom về một chỗ để đổi bucket chỉ phải
// sửa một nơi, và để /download với trang admin không lệch nhau.
//
// CHỈ dùng ở server (route handler / server action) — đọc process.env không có
// tiền tố NEXT_PUBLIC_ nên không lộ ra client.

export const B2_BUCKET_ID = "7c05de4a5db3e2bc97d00418";

export const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME ?? "12suquan";

export const B2_DOWNLOAD_HOST =
  process.env.B2_DOWNLOAD_HOST ?? "https://f005.backblazeb2.com";

/**
 * File placeholder B2 tự tạo để giữ một thư mục "rỗng" (vd "linux/.bzEmpty").
 * Luôn 0 byte và không phải file thật — phải lọc khỏi mọi danh sách hiển thị,
 * nếu không /download sẽ hiện các mục rác 0 B.
 *
 * Lọc theo TÊN, không phải theo size: một file thật cũng có thể 0 byte.
 */
export function isPlaceholderKey(key: string): boolean {
  return key.split("/").pop() === ".bzEmpty";
}

/** Ghép URL tải công khai cho một key B2. */
export function buildPublicUrl(key: string): string {
  // encodeURIComponent mã hóa luôn "/" thành "%2F" → key trong thư mục con sẽ
  // 404. Encode từng segment rồi nối lại để giữ nguyên dấu "/".
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${B2_DOWNLOAD_HOST}/file/${B2_BUCKET_NAME}/${encodedKey}`;
}

export type B2ObjectInfo = {
  fileName: string;
  contentLength: number;
  contentType: string;
  uploadTimestamp: number;
};

/**
 * Liệt kê TOÀN BỘ file trong bucket, đã lọc placeholder.
 *
 * Phải phân trang: b2_list_file_names trả tối đa maxFileCount mỗi lần kèm
 * nextFileName cho trang kế. Bản cũ trong
 * src/app/admin/b2/upload-url/servers/index.ts gọi đúng MỘT lần với
 * maxFileCount 1000 rồi bỏ qua nextFileName — file thứ 1001 trở đi biến mất
 * im lặng khỏi danh sách.
 *
 * maxFileCount bị B2 chặn ở 1000; xin hơn sẽ bị lỗi 400.
 */
export async function listAllB2Files(): Promise<B2ObjectInfo[]> {
  const { getB2 } = await import("@/lib/b2");
  const b2 = await getB2();

  const collected: B2ObjectInfo[] = [];
  let startFileName = "";

  // Chặn vòng lặp vô hạn nếu B2 trả nextFileName không tiến (bucket lỗi).
  const MAX_PAGES = 50;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const { data } = await b2.listFileNames({
      bucketId: B2_BUCKET_ID,
      startFileName,
      prefix: "",
      maxFileCount: 1000,
      delimiter: "",
    });

    const files = data.files ?? [];

    for (const file of files) {
      if (isPlaceholderKey(file.fileName)) continue;

      collected.push({
        fileName: file.fileName,
        contentLength: file.contentLength,
        contentType: file.contentType,
        uploadTimestamp: file.uploadTimestamp,
      });
    }

    // B2 trả nextFileName = null khi đã hết.
    if (!data.nextFileName || files.length === 0) break;

    // Không tiến được thì dừng, tránh lặp vô hạn.
    if (data.nextFileName === startFileName) break;

    startFileName = data.nextFileName;
  }

  return collected;
}
