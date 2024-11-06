import authApiRequest from "@/apiRequest/auth";
import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;
  const refreshToken = cookiesStore.get("refreshToken")?.value;
  cookiesStore.delete("accessToken");
  cookiesStore.delete("refreshToken");

  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Không nhân được accessToken hoặc refreshToken",
      },
      {
        status: 200,
      }
    );
  }

  try {
    const result = await authApiRequest.sLogout({ accessToken, refreshToken });

    return Response.json(result.payload);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json(
      {
        message: "Lỗi khi gọi Api đến server backend",
      },
      { status: 200 }
    );
  }
}
