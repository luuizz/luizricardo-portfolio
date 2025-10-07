import React from "react";
import "../globals.css";
import { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";

export const metadata: Metadata = {
  title: "Login | Luiz Ricardo",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <main className="flex h-screen flex-col dark:bg-background md:flex-1">
        {children}
      </main>
    </UserProvider>
  );
}
