import authApiRequest from "@/apiRequest/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface ExpProps {
  exp: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    return Response.json(
      {
        message: "Không nhân được refreshToken",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({ refreshToken });

    const decodeAccessToken = jwt.decode(payload.data.accessToken) as ExpProps;
    const decodeRefreshToken = jwt.decode(
      payload.data.refreshToken
    ) as ExpProps;
    cookieStore.set("accessToken", payload.data.accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", payload.data.refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 1000,
    });

    return Response.json(payload);
  } catch (error: any) {
    return Response.json(
      {
        message: error.message ?? "Có lỗi xảy ra",
      },
      { status: 401 }
    );
  }
}
