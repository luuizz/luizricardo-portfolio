import React from "react";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { PageTransition } from "./_components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Blog | Luiz Ricardo",
    template: "%s | Blog · Luiz Ricardo",
  },
  description:
    "Artigos sobre desenvolvimento web, front-end, performance e design. Escrito por Luiz Ricardo.",
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
