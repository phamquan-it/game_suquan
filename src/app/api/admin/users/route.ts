// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Tạo Supabase client server-side với service_role key
 */
const createClient = () => {
    return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey);
};

/**
 * GET /api/admin/users
 * Trả về tất cả user trong hệ thống
 */
export async function GET() {
    const supabase = createClient();

    try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ users: data.users });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Unknown error" },
            { status: 500 }
        );
    }
}

