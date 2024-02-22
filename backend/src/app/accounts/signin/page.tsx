"use client";
import { useState } from "react";
import { Account, ID } from "appwrite";
import type { Models } from 'appwrite';

import { client } from "@/app/appwrite";

const account = new Account(client);

const LoginPage = () => {
    const [loggedInUser, setLoggedInUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const login = async (email: string, password: string) => {
        const session = await account.createEmailSession(email, password);
        setLoggedInUser(await account.get());
    };

    const register = async () => {
        await account.create(ID.unique(), email, password, name);
        login(email, password);
    };

    const logout = async () => {
        await account.deleteSession("current");
        setLoggedInUser(null);
    };

    if (loggedInUser) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                    <p>Logged in as {loggedInUser.name}</p>
                    <button type="button" onClick={logout}>
                        Logout
                    </button>
                </div>
            </main>
        );
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
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button type="button" onClick={() => login(email, password)}>
                        Login
                    </button>
                    <button type="button" onClick={register}>
                        Register
                    </button>
                </form>
            </div>
        </main>
    );
};

export default LoginPage;
