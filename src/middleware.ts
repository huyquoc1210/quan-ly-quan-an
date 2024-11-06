import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

// interface JWTPayload {
//   exp: number;
//   iat: number;
// }

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  //Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken)
    return NextResponse.redirect(new URL("/login", request.url));

  // Đăng nhập rồi thì sẽ cho vào login nữa
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken)
    return NextResponse.redirect(new URL("/", request.url));

  // Đăng nhập rồi nhưng accessToken hết hạn
  if (privatePaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    if (!accessToken) {
      const url = new URL("/logout", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      return NextResponse.redirect(url);
    }

    // Kiểm tra thời gian còn lại của access token
    //   try {
    //     const decoded = jwt.decode(accessToken) as JWTPayload;
    //     const now = Math.floor(Date.now() / 1000);

    //     // Nếu token đã hết hạn hoặc sắp hết hạn (ví dụ còn 5 giây)
    //     const THRESHOLD_SECONDS = 5;
    //     if (decoded.exp <= now || decoded.exp - now <= THRESHOLD_SECONDS) {
    //       const url = new URL("/logout", request.url);
    //       url.searchParams.set("refreshToken", refreshToken);
    //       if (accessToken) url.searchParams.set("accessToken", accessToken);
    //       return NextResponse.redirect(url);
    //     }
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   } catch (error) {
    //     // Nếu có lỗi khi decode token, cho về trang logout
    //     const url = new URL("/logout", request.url);
    //     url.searchParams.set("refreshToken", refreshToken);
    //     return NextResponse.redirect(url);
    //   }
  }

  // Kiểm tra thời gian còn lại của access token

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
};
