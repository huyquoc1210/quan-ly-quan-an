"use client";

import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const LogoutPage = () => {
  // Không dùng logoutMutation vì nó là 1 object khi đưa vào useEffect khi dependency sẽ thay đổi vì sinh ra tham chiếu mới
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef(null);
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");

  useEffect(() => {
    if (
      ref.current ||
      !refreshTokenFromUrl ||
      !accessTokenFromUrl ||
      (refreshTokenFromUrl &&
        refreshTokenFromUrl !== getRefreshTokenToLocalStorage()) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl !== getAccessTokenFromLocalStorage())
    ) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutateAsync().then((res) => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      router.push("/login");
    });
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl]);
  return <div>LogoutPage</div>;
};

export default LogoutPage;
