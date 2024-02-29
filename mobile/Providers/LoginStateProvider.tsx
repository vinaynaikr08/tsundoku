import React from "react";

export const LoginStateContext = React.createContext(null);

function LoginStateProvider({ children }) {
  const [loggedIn, setLoggedIn] = React.useState(false);

  return (
    <LoginStateContext.Provider value={{loggedIn, setLoggedIn}}>
      {children}
    </LoginStateContext.Provider>
  )
}

export default LoginStateProvider;
