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
import { createContext, useContext, useEffect, useState } from "react";

interface Props {
  isAuth: boolean;
  role: RoleType | undefined;
  setRole: (role?: RoleType | undefined) => void;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContext = createContext<Props>({
  isAuth: false,
  role: undefined,
  setRole: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppProvider: FCC = (props) => {
  const { children } = props;
  const [role, setRoleState] = useState<RoleType | undefined>(undefined);

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const role = decodeToken(accessToken).role;
      setRoleState(role);
    }
  }, []);

  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokensFromLocalStorage();
    }
  };

  const isAuth = Boolean(role);

  return (
    <AppContext.Provider value={{ isAuth, role, setRole }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
};

export default AppProvider;
