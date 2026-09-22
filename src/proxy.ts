import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  // Trước đây file này import `supabase` từ ./utils/supabase/client — hàm đó
  // gọi createBrowserClient ở cấp module, nên SERVER chạy một browser client:
  // nó không đọc được cookie của request và getUser() không xác thực được
  // session thật. Phải dùng createServerClient gắn với cookie của request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // --- kiểm tra session thật, không chỉ xem cookie có tồn tại hay không ---
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- redirect /admin to /404 nếu chưa đăng nhập ---
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/admin') && !user) {
    return NextResponse.rewrite(new URL('/404', request.url))
  }

  return response
}

export const config = {
  // Chỉ chạy proxy cho các route cần auth, bỏ qua static assets (_next, ảnh, favicon...).
  // Phải liệt kê '/admin' riêng: '/admin/:path*' không khớp chính route '/admin'.
  matcher: ['/admin', '/admin/:path*'],
}
