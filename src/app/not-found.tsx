import React from "react";

import Link from "next/link";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <div>
        <h2>Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">Voltar para página Inicial</Link>
      </div>
      <Footer />
    </>
  );
}
