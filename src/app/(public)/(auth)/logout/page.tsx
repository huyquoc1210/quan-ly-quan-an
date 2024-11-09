"use client";

import { useAppContext } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const LogoutPage = () => {
  // Không dùng logoutMutation vì nó là 1 object khi đưa vào useEffect khi dependency sẽ thay đổi vì sinh ra tham chiếu mới
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef(null);
  const { setIsAuth } = useAppContext();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");

  useEffect(() => {
    if (
      refreshTokenFromUrl ||
      accessTokenFromUrl ||
      (!ref.current &&
        ((refreshTokenFromUrl &&
          refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
          (accessTokenFromUrl &&
            accessTokenFromUrl === getAccessTokenFromLocalStorage())))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        setIsAuth(false);
        router.push("/login");
      });
    } else {
      router.push("/");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setIsAuth]);
  return <div>LogoutPage</div>;
};

export default LogoutPage;
