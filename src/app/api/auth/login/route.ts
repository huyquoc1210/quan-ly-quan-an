import authApiRequest from "@/apiRequest/auth";
import { HttpError } from "@/lib/http";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface ExpProps {
  exp: number;
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  // console.log(body);
  const cookieStore = await cookies();
  try {
    const { payload } = await authApiRequest.sLogin(body);
    const { accessToken, refreshToken } = payload.data;
    const decodeAccessToken = jwt.decode(accessToken) as ExpProps;
    const decodeRefreshToken = jwt.decode(refreshToken) as ExpProps;
    cookieStore.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 100,
    });
    cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 100,
    });

    return Response.json(payload);
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
