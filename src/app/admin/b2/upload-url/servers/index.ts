"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { getB2 } from "@/lib/b2";
import { authorize, getUploadUrl } from "@/lib/b2-upload";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

/**
 * Chặn mọi server action trong file này cho tới khi xác thực được admin.
 *
 * Vì sao bắt buộc: các action dưới dùng service_role key để ghi game_versions
 * và xóa file trên B2. service_role bypass TOÀN BỘ RLS, nên nếu không kiểm tra
 * ở đây thì bất kỳ ai gọi được action đều ghi/xóa được (xem cảnh báo trong
 * src/utils/supabase/admin.ts và phần GHI CHÚ VỀ RLS ở
 * supabase/migration_game_versions_package_format.sql).
 *
 * is_admin() là hàm SECURITY DEFINER có sẵn trong DB, so user_roles với
 * auth.uid() của chính session đang gọi → không giả mạo được từ client.
 *
 * Bọc trong cache() để nhiều lời gọi trong cùng một request chỉ query DB một lần.
 */
export const verifyAdmin = cache(async (): Promise<string> => {
  const supabase = createClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Bạn cần đăng nhập để thực hiện thao tác này");
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");

  if (rpcError) {
    throw new Error(`Không kiểm tra được quyền admin: ${rpcError.message}`);
  }

  if (!isAdmin) {
    throw new Error("Chỉ admin mới được phát hành bản build");
  }

  return user.id;
});

/**
 * Lấy uploadUrl + authorizationToken cho MỘT lần upload.
 *
 * Dùng trực tiếp B2 native API (src/lib/b2-upload.ts) theo đúng flow của
 * B2Upload.ts: authorize → getUploadUrl. Client nhận URL/token rồi tự POST
 * file lên B2 bằng XHR để giữ được thanh tiến trình.
 */
export async function getB2UploadUrl() {
  await verifyAdmin();

  const auth = await authorize();
  const result = await getUploadUrl(auth);

  return {
    uploadUrl: result.uploadUrl,
    authorizationToken: result.authorizationToken,
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
  await verifyAdmin();

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
  await verifyAdmin();

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
  await verifyAdmin();

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
