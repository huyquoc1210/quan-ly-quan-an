import { HttpError } from "@/lib/http";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface ExpProps {
  exp: number;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    accessToken: string;
    refreshToken: string;
  };
  // console.log(body);
  const { accessToken, refreshToken } = body;
  const cookieStore = await cookies();

  try {
    const decodeAccessToken = jwt.decode(accessToken) as ExpProps;
    const decodeRefreshToken = jwt.decode(refreshToken) as ExpProps;
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 1000,
    });

    return Response.json(body);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Có lỗi xảy ra",
        },
        { status: 500 }
      );
    }
  }
}
