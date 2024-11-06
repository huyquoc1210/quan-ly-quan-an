"use client";

import authApiRequest from "@/apiRequest/auth";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromToLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import jwt from "jsonwebtoken";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface JWTPayloadProps {
  exp: number;
  iat: number;
}

const UNAUTHENTICATED_PATH = ["/login", "/logout", "refresh-token"];

const RefreshToken = () => {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;

    const checkAndRefreshToken = async () => {
      const accessToken = getAccessTokenFromLocalStorage();
      const refreshToken = getRefreshTokenFromToLocalStorage();

      if (!accessToken || !refreshToken) return;
      const decodeAccessToken = jwt.decode(accessToken) as JWTPayloadProps;
      const decodeRefreshToken = jwt.decode(refreshToken) as JWTPayloadProps;

      const now = Math.round(new Date().getTime() / 1000);
      if (decodeRefreshToken.exp <= now) return;

      if (
        decodeAccessToken.exp - now <
        (decodeAccessToken.exp - decodeAccessToken.iat) / 3
      ) {
        try {
          const result = await authApiRequest.refreshToken();
          setAccessTokenToLocalStorage(result.payload.data.accessToken);
          setRefreshTokenToLocalStorage(result.payload.data.refreshToken);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          clearInterval(interval);
        }
      }
    };

    checkAndRefreshToken();

    const TIMEOUT = 1000;
    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => {
      clearInterval(interval);
    };
  }, [pathname]);
  return null;
};

export default RefreshToken;
