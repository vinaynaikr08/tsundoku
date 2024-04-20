import React from "react";

import { client } from "@/appwrite";
import { Account } from "appwrite";

const account = new Account(client);

export interface LoginStateContextType {
  loggedIn: boolean | null;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
  refreshLoginState: () => void;
}

export const LoginStateContext =
  React.createContext<LoginStateContextType | null>(null);

function checkLoggedIn(
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>,
) {
  account
    .get()
    .then(() => {
      setLoggedIn(true);
    })
    .catch(() => {
      setLoggedIn(false);
    });
}

function LoginStateProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null);

  function refreshLoginState() {
    checkLoggedIn(setLoggedIn);
  }

  React.useEffect(() => {
    refreshLoginState();
  }, []);

  return (
    <LoginStateContext.Provider
      value={{ loggedIn, setLoggedIn, refreshLoginState }}
    >
      {children}
    </LoginStateContext.Provider>
  );
}

export default LoginStateProvider;
