import accountApiRequest from "@/apiRequest/account";
import authApiRequest from "@/apiRequest/auth";
import { HttpError } from "@/lib/http";
import { ChangePasswordV2BodyType } from "@/schemaValidations/account.schema";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface ExpProps {
  exp: number;
}

export async function PUT(request: Request) {
  const body = (await request.json()) as ChangePasswordV2BodyType;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json(
      { message: "Không tìm thấy accessToken" },
      {
        status: 401,
      }
    );
  }

  try {
    const { payload } = await accountApiRequest.sChangePasswordV2(
      accessToken,
      body
    );
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
    if (error.response?.data) {
      return Response.json(
        {
          message: "Lỗi xảy ra khi xác thực dữ liệu...",
          errors: [
            {
              field: "oldPassword",
              message: "Mật khẩu cũ không đúng",
            },
          ],
          statusCode: 422,
        },
        {
          status: 422,
        }
      );
    }
    return Response.json(
      {
        message: error.message ?? "Có lỗi xảy ra",
      },
      { status: error.status ?? 500 }
    );
  }
}
