import React from "react";
import HeaderBlog from "@/app/(blog)/ui/header";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderBlog />
      {children}
    </>
  );
}
