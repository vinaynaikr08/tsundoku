import React from "react";

import { client } from "@/appwrite";
import { Account } from "appwrite";

const account = new Account(client);

export const LoginStateContext = React.createContext(null);

function checkLoggedIn(setLoggedIn) {
  account.get()
  .then(() => {
    setLoggedIn(true);
  }).catch(() => {
    setLoggedIn(false);
  })
}

function LoginStateProvider({ children }) {
  const [loggedIn, setLoggedIn] = React.useState(false);

  function refreshLoginState() {
    checkLoggedIn(setLoggedIn);
  }

  React.useEffect(()=> {
    refreshLoginState();
  }, [])

  return (
    <LoginStateContext.Provider
      value={{ loggedIn, setLoggedIn, refreshLoginState }}
    >
      {children}
    </LoginStateContext.Provider>
  );
}

export default LoginStateProvider;
