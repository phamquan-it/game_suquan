// utils/supabase/admin.ts
//
// Client Supabase dùng service_role key — CHỈ dùng ở server action / route
// handler, KHÔNG bao giờ import vào component client.
//
// Lý do tồn tại: bảng `game_versions` đã bật RLS và chỉ có policy SELECT cho
// anon/authenticated, nên mọi INSERT/UPDATE từ client đều bị chặn. Service
// role bypass RLS nên ghi được mà không phải nới policy.
//
// CẢNH BÁO: service_role bypass TOÀN BỘ RLS trên mọi bảng. Mọi server action
// dùng client này phải tự kiểm tra quyền admin trước khi ghi.

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong biến môi trường"
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
