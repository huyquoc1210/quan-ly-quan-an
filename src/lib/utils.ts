import { toast } from "@/hooks/use-toast";
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequest/auth";

interface JWTPayloadProps {
  exp: number;
  iat: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Xoá đị ký tự đàu tiên của path

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xá định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("refreshToken", value);

export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("accessToken", value);

export const removeTokensFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
  }
};

export const checkAndRefreshToken = async (params?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();

  if (!accessToken || !refreshToken) return;
  const decodeAccessToken = jwt.decode(accessToken) as JWTPayloadProps;
  const decodeRefreshToken = jwt.decode(refreshToken) as JWTPayloadProps;

  const now = new Date().getTime() / 1000 - 1;
  if (decodeRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    return params?.onError && params.onError();
  }

  if (
    decodeAccessToken.exp - now <
    (decodeAccessToken.exp - decodeAccessToken.iat) / 3
  ) {
    try {
      const result = await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(result.payload.data.accessToken);
      setRefreshTokenToLocalStorage(result.payload.data.refreshToken);

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      params?.onSuccess && params.onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      params?.onError && params.onError();
    }
  }
};
