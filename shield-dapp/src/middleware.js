import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(req) {
    
    if(req.nextUrl.pathname === "/"){
        return NextResponse.redirect(new URL('/home', req.url));
    }else if(req.nextUrl.pathname === "/user/me"){
        const token = await getToken({ req });
        if(token){
            return NextResponse.redirect(new URL(`/user/${token.sub.uid}`, req.url));
        }else{
            return new NextResponse(
                JSON.stringify({ success: false, message: 'authentication failed' }),
                { status: 401, headers: { 'content-type': 'application/json' } },
              );
        }
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
  };