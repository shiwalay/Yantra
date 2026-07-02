import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-browser cookies, e.g. Safari handling of SameSite strict.
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error('Supabase auth error in middleware:', error);
  }

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // App routes that require an authenticated user (real session, not localStorage).
  const APP_ROUTES = ['/dashboard', '/strategy', '/research', '/scripts', '/seo', '/analytics', '/thumbnails', '/frameworks', '/coach', '/billing', '/onboarding'];
  const isAppRoute = APP_ROUTES.some((r) => path === r || path.startsWith(r + '/'));

  // Admin area — requires the superadmin role.
  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!user) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (!profile || profile.role !== 'superadmin') {
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Supabase profile fetch error:', error);
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Protected app routes — send guests to the login page.
  if (isAppRoute && !user) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Logged-in users shouldn't sit on the auth page.
  if (path === '/login' && user) {
    url.pathname = '/strategy';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
