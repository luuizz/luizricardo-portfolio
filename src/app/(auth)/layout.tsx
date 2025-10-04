import React from "react";
import "../globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Luiz Ricardo",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-screen flex-col dark:bg-background md:flex-1">
      {children}
    </main>
  );
}
