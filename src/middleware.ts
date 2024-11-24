import { Role } from "@/constants/type";
import { TokenPayload } from "@/types/jwt.types";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};

const managePaths = ["/manage"];
const guestPaths = ["/manage"];
const onlyOwnerPaths = ["/manage/accounts"];
const privatePaths = [...managePaths, ...guestPaths];
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
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  if (refreshToken) {
    // Đăng nhập rồi thì sẽ cho vào login nữa
    if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken)
      return NextResponse.redirect(new URL("/", request.url));

    // Đăng nhập rồi nhưng accessToken hết hạn
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Vào không đúng role sẽ redirect về trang chủ
    const role = decodeToken(refreshToken).role;
    // Guest nhưng cố tình vào route của owner
    const isGuestGoToManagePaths =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));
    // Không phải Guest nhưng vào route của guest
    const isNotGuestGoToGuestPaths =
      role === Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path));

    // Không phải Owner nhưng cố tình truy cập vào các router dành cho owner
    const isNotOwnerGotoOwnerPath =
      role !== Role.Owner &&
      onlyOwnerPaths.some((path) => pathname.startsWith(path));

    if (
      isGuestGoToManagePaths ||
      isNotGuestGoToGuestPaths ||
      isNotOwnerGotoOwnerPath
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/guest/:path*", "/login"],
};
