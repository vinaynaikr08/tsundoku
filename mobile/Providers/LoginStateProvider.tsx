import React from "react";

import { client } from "@/appwrite";
import { Account } from "appwrite";

const account = new Account(client);

export const LoginStateContext = React.createContext(null);

function LoginStateProvider({ children }) {
  const [loggedIn, setLoggedIn] = React.useState(() => {
    try {
      (async () => {await account.get()})();
    } catch (error: any) {
      return false;
    }
    return true;
  });

  return (
    <LoginStateContext.Provider value={{loggedIn, setLoggedIn}}>
      {children}
    </LoginStateContext.Provider>
  )
}

export default LoginStateProvider;
