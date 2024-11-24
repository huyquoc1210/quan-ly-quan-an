"use client";

import { useAppStore } from "@/components/app-provider";
import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATH = ["/login", "/logout", "refresh-token"];

const RefreshToken = () => {
  const pathname = usePathname();
  const router = useRouter();
  const socket = useAppStore((state) => state.socket);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;

    const onRefreshToken = (force?: boolean) =>
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          disconnectSocket();
          router.push("/login");
        },
        force,
      });

    onRefreshToken();

    const TIMEOUT = 1000;
    interval = setInterval(onRefreshToken, TIMEOUT);

    const onConnect = () => {
      console.log(socket?.id);
    };

    const onDisconnect = () => {
      console.log("disconnect");
    };

    const onRefreshTokenSocket = () => {
      onRefreshToken(true);
    };

    if (socket?.connected) {
      onConnect();
    }

    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("refresh-token", onRefreshTokenSocket);
    return () => {
      clearInterval(interval);
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("refresh-token", onRefreshTokenSocket);
    };
  }, [pathname, router, socket, disconnectSocket]);
  return null;
};

export default RefreshToken;
