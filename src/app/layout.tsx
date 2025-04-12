import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { ClarityProvider } from "./provider/clarity";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "600"
});

export const metadata: Metadata = {
  title: "Luiz Ricardo | Desenvolvedor Front-end",
  description: "Olá, sou o Luiz Ricardo, um desenvolvedor front-end apaixonado por criar experiências digitais incriveis. Neste portfólio, você poderá explorar meus trabalhos criativos, recomendações e habilidades adquiridas ao longo da minha jornada profissional. Sinta-se à vontade para se conectar comigo no LinkedIn e explorar meus projetos no Github para ter uma visão mais aprofundada do meu expertise técnico e criativo.",
  keywords: "desenvolvedor front-end, react, angular, profissional programador, programação front-end, recrutador front-end, typescript, nodejs",
  authors: [{ name: "Luiz Ricardo", url: "https://github.com/luuizz" }],
  publisher: "Luiz Ricardo",
  openGraph: {
    title: "Luiz Ricardo | Desenvolvedor Front-end",
    images: [
      {
        url: "/share-og.png",
        width: 1200,
        height: 628,
        alt: "Luiz Ricardo | Desenvolvedor Front-end",
      },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="pt-br">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        <Header />
        <ClarityProvider />
        {children}
        <Footer />
      </body>
    </html>
  );
}
