"use client";

import React from "react";
import { Client, Account } from "appwrite";
import type { Models } from "appwrite";

function JWTPage({ endpoint, project }: { endpoint: string; project: string }) {
  const client = new Client();

  client.setEndpoint(endpoint).setProject(project);

  const account = new Account(client);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [jwt, setJwt] = React.useState<Models.Jwt | null>(null);

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      setIsLoggedIn(true);
      setJwt(await account.createJWT());
    } catch (error: any) {
      console.error(error);
    }
  };

  if (isLoggedIn) {
    if (jwt) {
      return (
        <div>
          <p>Your JWT is {jwt.jwt}.</p>
        </div>
      );
    } else {
      return (
        <div>
          <p>Fetching your JWT... please wait.</p>
        </div>
      );
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p>Not logged in</p>
        <form>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={() => login(email, password)}>
            Login
          </button>
        </form>
      </div>
    </main>
  );
}

export default JWTPage;
