/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import RefreshToken from "@/components/refresh-token";
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import { FCC } from "@/types/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  isAuth: boolean;
  role: RoleType | undefined;
  setRole: (role?: RoleType | undefined) => void;
  socket: Socket | undefined;
  setSocket: (socket?: Socket | undefined) => void;
  disconnectSocket: () => void;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContext = createContext<Props>({
  isAuth: false,
  role: undefined,
  setRole: (role?: RoleType | undefined) => {},
  socket: undefined,
  setSocket: (socket?: Socket | undefined) => {},
  disconnectSocket: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppProvider: FCC = (props) => {
  const { children } = props;
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [role, setRoleState] = useState<RoleType | undefined>(undefined);
  const count = useRef(0);
  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const role = decodeToken(accessToken).role;
        setRoleState(role);
      }
      count.current++;
    }
  }, []);

  const disconnectSocket = () => {
    socket?.disconnect();
    setSocket(undefined);
  };

  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokensFromLocalStorage();
    }
  };

  const isAuth = Boolean(role);

  return (
    <AppContext.Provider
      value={{ isAuth, role, setRole, socket, setSocket, disconnectSocket }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
};

export default AppProvider;
