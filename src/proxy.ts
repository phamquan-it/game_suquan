import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from './utils/supabase/client'

export async function proxy(request: NextRequest) {
  // --- cookies example ---
  const allCookies = request.cookies.getAll()
 // console.log('All cookies:', allCookies)

  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')

  // --- check Supabase session ---
  const supabaseAccessToken = request.cookies.get('sb-vzzecxvflqiiygumlwmo-auth-token')?.value
  let loggedIn = false

  if (supabaseAccessToken) {
    loggedIn = true
 //   console.log('Supabase access token:', supabaseAccessToken)
    try {
      // verify session
      const { data: userData, error } = await supabase.auth.getUser(supabaseAccessToken)
    //  console.log('User data:', userData)
      if (!error && userData.user) {
        console.log('User logged in:', userData.user.email)
      }
    } catch (err) {
      console.log('Error verifying user:', err)
    }
  }

  // --- redirect /admin to /404 **only if not logged** ---
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/admin') && !loggedIn) {
    return NextResponse.rewrite(new URL('/404', request.url))
  }

  // --- allow access if loggedIn ---
  return response
}
