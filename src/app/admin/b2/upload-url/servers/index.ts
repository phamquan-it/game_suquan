"use server";

import { getB2 } from "@/lib/b2";
import { createAdminClient } from "@/utils/supabase/admin";

export async function getB2UploadUrl() {
  // kiểm tra admin ở đây

  const b2 = await getB2();

  const result = await b2.getUploadUrl({
    bucketId: "7c05de4a5db3e2bc97d00418",
  });

  return {
    uploadUrl: result.data.uploadUrl,
    authorizationToken: result.data.authorizationToken,
  };
}

export type B2FileInfo = {
  fileName: string;
  fileId: string;
  contentLength: number;
  contentType: string;
  uploadTimestamp: number;
};

/**
 * Liệt kê các file release đã có trong bucket.
 * Trả về map theo fileName để tra cứu nhanh file nào đã tồn tại.
 */
export async function listB2ReleaseFiles(): Promise<B2FileInfo[]> {
  // kiểm tra admin ở đây

  const b2 = await getB2();

  const { data } = await b2.listFileNames({
    bucketId: "7c05de4a5db3e2bc97d00418",
    startFileName: "",
    prefix: "",
    maxFileCount: 1000,
    delimiter: "",
  });

  return (data.files ?? []).map(
    (file: {
      fileName: string;
      fileId: string;
      contentLength: number;
      contentType: string;
      uploadTimestamp: number;
    }) => ({
      fileName: file.fileName,
      fileId: file.fileId,
      contentLength: file.contentLength,
      contentType: file.contentType,
      uploadTimestamp: file.uploadTimestamp,
    })
  );
}

/**
 * Xóa vĩnh viễn một file trên B2.
 * B2 yêu cầu cả fileName và fileId để định danh chính xác phiên bản file.
 */
export async function deleteB2File({
  fileName,
  fileId,
}: {
  fileName: string;
  fileId: string;
}): Promise<{ fileName: string; fileId: string }> {
  // kiểm tra admin ở đây

  const b2 = await getB2();

  await b2.deleteFileVersion({
    fileName,
    fileId,
  });

  return { fileName, fileId };
}

// ============================================================
// Ghi DB: game_versions
// ============================================================

export type GameVersionRow = {
  id: string;
  os: string;
  version: string;
  package_format: string;
  build_number: number;
  is_mandatory: boolean;
  download_url: string | null;
  release_notes: string | null;
  is_active: boolean;
  created_at: string;
};

/**
 * Số build kế tiếp cho một os = max(build_number) + 1.
 *
 * Lưu ý: đây là read-then-write, KHÔNG nguyên tử. Hai người upload cùng lúc
 * cho cùng một os có thể nhận cùng số build. Unique constraint hiện tại là
 * (os, version, package_format) nên trùng build_number KHÔNG bị chặn — chỉ
 * gây nhầm lẫn thứ tự trong get_latest_version(). Muốn chặt hơn thì cần
 * unique (os, build_number) hoặc dùng sequence per-os.
 */
async function getNextBuildNumber(os: string): Promise<number> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("game_versions")
    .select("build_number")
    .eq("os", os)
    .order("build_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Không đọc được build_number: ${error.message}`);
  }

  return (data?.build_number ?? 0) + 1;
}

/**
 * Ghi một bản phát hành vào game_versions sau khi upload B2 thành công.
 *
 * - build_number tự tăng theo từng os (max + 1).
 * - package_format: định dạng gói cho Linux, chuỗi rỗng với các OS khác.
 * - download_url: lưu KEY B2 dạng thô (vd "game_su_quan_1.2.0.deb"), KHÔNG
 *   phải URL đầy đủ — B2 yêu cầu authorization token có hạn nên client phải
 *   đi qua /api/get-download-link. Xem migration_game_versions_package_format.sql.
 * - upsert theo (os, version, package_format): upload lại cùng version + cùng
 *   định dạng sẽ ghi đè dòng cũ thay vì tạo trùng.
 */
export async function saveGameVersion({
  os,
  version,
  packageFormat,
  b2Key,
  releaseNotes,
  isMandatory,
}: {
  os: string;
  version: string;
  packageFormat: string;
  b2Key: string;
  releaseNotes?: string;
  isMandatory?: boolean;
}): Promise<GameVersionRow> {
  // kiểm tra admin ở đây

  const supabase = createAdminClient();
  const buildNumber = await getNextBuildNumber(os);

  const { data, error } = await supabase
    .from("game_versions")
    .upsert(
      {
        os,
        version,
        package_format: packageFormat,
        build_number: buildNumber,
        download_url: b2Key,
        release_notes: releaseNotes?.trim() || null,
        is_mandatory: isMandatory ?? false,
        is_active: true,
      },
      { onConflict: "os,version,package_format" }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Không ghi được game_versions: ${error.message}`);
  }

  return data as GameVersionRow;
}
