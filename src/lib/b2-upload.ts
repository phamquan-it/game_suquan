// lib/b2-upload.ts
//
// B2 native API (b2api/v3) — CHỈ dùng ở server action / route handler.
//
// Lý do tồn tại: logic gốc nằm ở
// src/app/admin/b2/upload-url/utils/B2Upload.ts nhưng trang
// src/app/admin/b2/upload-url/page.tsx là "use client" nên KHÔNG import được:
//   * B2Upload dùng crypto.createHash + fs/promises.readFile (Node APIs)
//   * đọc process.env.B2_APPLICATION_KEY (không có tiền tố NEXT_PUBLIC_)
//   * nhận filePath trên đĩa server, không phải File của browser
//
// Ở đây giữ lại đúng flow của B2Upload (authorize → getUploadUrl) để server
// action lấy uploadUrl + authorizationToken, còn client tự POST file lên B2
// bằng XMLHttpRequest để giữ được thanh tiến trình (Server Action không
// stream được tiến độ upload).
//
// KHÔNG dùng SDK `backblaze-b2` (src/lib/b2.ts) cho đường này nữa.

export const B2_BUCKET_ID = "7c05de4a5db3e2bc97d00418";

export interface B2AuthorizeResult {
  accountId: string;
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
}

export interface B2UploadUrlResult {
  authorizationToken: string;
  bucketId: string;
  uploadUrl: string;
}

export interface B2UploadFileResult {
  accountId: string;
  bucketId: string;
  fileId: string;
  fileName: string;
  contentType: string;
  contentLength: number;
  contentSha1: string;
  uploadTimestamp: number;
  fileInfo: Record<string, string>;
  [key: string]: unknown;
}

/** Kiểm tra response B2, ném lỗi kèm message thật thay vì lỗi JSON parse khô khan. */
async function parseResponse(response: Response): Promise<any> {
  const text = await response.text();

  let data: any;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `B2 trả về response không hợp lệ (${response.status}): ${text}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `B2 API error ${response.status}: ${
        data.message ?? JSON.stringify(data)
      }`
    );
  }

  return data;
}

/**
 * Bước 1: b2_authorize_account.
 *
 * Đọc credentials trong thân hàm (không phải ở cấp module) để việc import
 * module này không nổ khi biến môi trường chưa có — Next.js đánh giá module
 * lúc build.
 */
export async function authorize(): Promise<B2AuthorizeResult> {
  const keyId = process.env.B2_KEY_ID;
  const applicationKey = process.env.B2_APPLICATION_KEY;

  if (!keyId) {
    throw new Error("Thiếu biến môi trường B2_KEY_ID");
  }

  if (!applicationKey) {
    throw new Error("Thiếu biến môi trường B2_APPLICATION_KEY");
  }

  const credentials = Buffer.from(`${keyId}:${applicationKey}`).toString(
    "base64"
  );

  const response = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      // Token B2 có hạn; không để Next.js cache response này.
      cache: "no-store",
    }
  );

  const data = await parseResponse(response);

  return {
    accountId: data.accountId,
    authorizationToken: data.authorizationToken,
    apiUrl: data.apiInfo.storageApi.apiUrl,
    downloadUrl: data.apiInfo.storageApi.downloadUrl,
  };
}

/**
 * Bước 2: b2_get_upload_url.
 *
 * Trả về uploadUrl + authorizationToken riêng cho MỘT lần upload. Token này
 * dùng được một lần rồi hết hạn, nên client phải gọi lại mỗi lần upload.
 */
export async function getUploadUrl(
  auth: B2AuthorizeResult
): Promise<B2UploadUrlResult> {
  const response = await fetch(
    `${auth.apiUrl}/b2api/v3/b2_get_upload_url`,
    {
      method: "POST",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucketId: B2_BUCKET_ID,
      }),
      cache: "no-store",
    }
  );

  const data = await parseResponse(response);

  return {
    authorizationToken: data.authorizationToken,
    bucketId: B2_BUCKET_ID,
    uploadUrl: data.uploadUrl,
  };
}
