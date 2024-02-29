import React from "react";

import { client } from "@/appwrite";
import { Account } from "appwrite";

const account = new Account(client);

export const LoginStateContext = React.createContext(null);

function checkLoggedIn() {
  try {
    (async () => {
      await account.get();
    })();
  } catch (error: any) {
    return false;
  }
  return true;
}

function LoginStateProvider({ children }) {
  const [loggedIn, setLoggedIn] = React.useState(checkLoggedIn);

  function refreshLoginState() {
    setLoggedIn(checkLoggedIn());
  }

  return (
    <LoginStateContext.Provider
      value={{ loggedIn, setLoggedIn, refreshLoginState }}
    >
      {children}
    </LoginStateContext.Provider>
  );
}

export default LoginStateProvider;
