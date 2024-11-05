import accountApiRequest from "@/apiRequest/account";
import { cookies } from "next/headers";

const DashboardPage = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value as string;
  let name = "";
  try {
    const result = await accountApiRequest.sMe(accessToken);
    name = result.payload.data.name;
  } catch (error: any) {
    if (error.digest.includes("NEXT_REDIRECT")) {
      throw error;
    }
  }

  return <div>DashBoardPage {name}</div>;
};

export default DashboardPage;
