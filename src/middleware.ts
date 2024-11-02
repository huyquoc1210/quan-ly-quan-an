import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(request.cookies.get("accessToken"));
  const isAuth = Boolean(request.cookies.get("accessToken"));
  //Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth)
    return NextResponse.redirect(new URL("/login", request.url));
  // Đăng nhập rồi thì sẽ cho vào login nữa
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth)
    return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
};
