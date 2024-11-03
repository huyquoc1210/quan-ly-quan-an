import authApiRequest from "@/apiRequest/auth";
import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  const cookiesStore = cookies();
  const accessToken = (await cookiesStore).get("accessToken")?.value;
  const refreshToken = (await cookiesStore).get("refreshToken")?.value;
  (await cookiesStore).delete("accessToken");
  (await cookiesStore).delete("refreshToken");

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
