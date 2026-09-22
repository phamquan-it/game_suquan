-- ============================================================================
-- game_versions: thêm package_format
-- ----------------------------------------------------------------------------
-- Trang admin /admin/b2/upload-url cho phép phát hành Linux theo nhiều định
-- dạng gói (.deb, .rpm, .tar.gz, .tar.zst, .pkg.tar.zst, .AppImage) cho CÙNG
-- một version. Ràng buộc cũ UNIQUE (os, version) chỉ cho 1 dòng mỗi cặp
-- (os, version) → 6 định dạng Linux sẽ ghi đè nhau.
--
-- Cách sửa:
--   * thêm cột package_format text NOT NULL DEFAULT ''
--   * đổi unique constraint thành (os, version, package_format)
--   * các OS không phải Linux dùng package_format = '' (một dòng duy nhất)
--
-- get_latest_version() và cột build_number GIỮ NGUYÊN — RPC vẫn sắp xếp theo
-- build_number desc. build_number do form tự tăng (max + 1 theo từng os).
--
-- Cột download_url hiện KHÔNG có dữ liệu (toàn NULL trong backup). Trang
-- upload sẽ ghi key B2 dạng thô "game_su_quan_1.2.0.deb"; client ghép URL
-- tải qua /api/get-download-link (B2 yêu cầu authorization token có hạn).
-- Nếu sau này muốn lưu URL đầy đủ có token thì phải chấp nhận token hết hạn.
--
-- Chạy trong Supabase SQL editor / migration.
-- ============================================================================

-- 1. Thêm cột --------------------------------------------------------------
alter table public.game_versions
  add column if not exists package_format text not null default '';

comment on column public.game_versions.package_format is
  'Định dạng gói khi os = ''linux'' (deb, rpm, tar.gz, tar.zst, pkg.tar.zst, AppImage). Các OS khác để chuỗi rỗng.';

-- 2. Đổi unique constraint -------------------------------------------------
-- Tên constraint cũ: game_versions_os_version_key
-- Dùng IF EXISTS để chạy lại migration không bị lỗi.
alter table public.game_versions
  drop constraint if exists game_versions_os_version_key;

alter table public.game_versions
  add constraint game_versions_os_version_format_key
  unique (os, version, package_format);

-- 3. Index ------------------------------------------------------------------
-- Index cũ (os, created_at DESC) vẫn dùng được nhưng không tối ưu cho truy
-- vấn thực tế: luôn lọc theo os + version (đã có unique constraint lo), hoặc
-- lấy bản mới nhất theo os (RPC get_latest_version sắp theo build_number).
-- Thêm index phụ trợ cho truy vấn "bản mới nhất của một os" trên trang admin.
create index if not exists idx_game_versions_os_build
  on public.game_versions using btree (os, build_number desc);

-- ============================================================================
-- GHI CHÚ VỀ RLS (không thay đổi trong migration này)
-- ----------------------------------------------------------------------------
-- Bảng đã bật RLS và chỉ có 2 policy SELECT (anon, authenticated).
-- KHÔNG có policy INSERT/UPDATE/DELETE → mọi ghi từ anon/authenticated đều bị
-- chặn. Trang upload vì vậy ghi bằng service_role key ở server action
-- (xem src/app/admin/b2/upload-url/servers/index.ts), KHÔNG cần thêm policy.
--
-- Hệ quả: quyền ghi phụ thuộc hoàn toàn vào việc server action có kiểm tra
-- admin hay không. Hiện tại chưa có kiểm tra (xem "kiểm tra admin ở đây").
-- ============================================================================
