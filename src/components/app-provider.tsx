/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import ListenLogoutSocket from "@/components/listen-logout-socket";
import RefreshToken from "@/components/refresh-token";
import {
  decodeToken,
  generateSocketInstance,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import { FCC } from "@/types/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { create } from "zustand";

type Props = {
  isAuth: boolean;
  role: RoleType | undefined;
  setRole: (role?: RoleType | undefined) => void;
  socket: Socket | undefined;
  setSocket: (socket?: Socket | undefined) => void;
  disconnectSocket: () => void;
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

// const AppContext = createContext<Props>({
//   isAuth: false,
//   role: undefined,
//   setRole: (role?: RoleType | undefined) => {},
//   socket: undefined,
//   setSocket: (socket?: Socket | undefined) => {},
//   disconnectSocket: () => {},
// });

export const useAppStore = create<Props>((set) => ({
  isAuth: false,
  role: undefined,
  setRole: (role?: RoleType | undefined) => {
    set({ role, isAuth: Boolean(role) });
    if (!role) {
      removeTokensFromLocalStorage();
    }
  },
  socket: undefined,
  setSocket: (socket?: Socket | undefined) => set({ socket }),
  disconnectSocket: () => {
    set((state) => {
      state.socket?.disconnect();
      return { socket: undefined };
    });
  },
}));

const AppProvider: FCC = (props) => {
  const { children } = props;
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);
  // const [socket, setSocket] = useState<Socket | undefined>(undefined);
  // const [role, setRoleState] = useState<RoleType | undefined>(undefined);
  const count = useRef(0);
  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const role = decodeToken(accessToken).role;
        setRole(role);
        setSocket(generateSocketInstance(accessToken));
      }
      count.current++;
    }
  }, [setRole, setSocket]);

  // const disconnectSocket = () => {
  //   socket?.disconnect();
  //   setSocket(undefined);
  // };

  // const setRole = (role?: RoleType | undefined) => {
  //   setRoleState(role);
  //   if (!role) {
  //     removeTokensFromLocalStorage();
  //   }
  // };

  // const isAuth = Boolean(role);

  return (
    // <AppContext.Provider
    //   value={{ isAuth, role, setRole, socket, setSocket, disconnectSocket }}
    // >
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ListenLogoutSocket />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    // </AppContext.Provider>
  );
};

export default AppProvider;
