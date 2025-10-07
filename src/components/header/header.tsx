"use client";
import React, { useEffect, useState } from "react";
import Grid from "../grid";
import Link from "next/link";
import { menuLinks, socialLinks } from "@/app/shared/utils/global-data";
import AsideMenu from "./AsideMenu";
import Logo from "@/app/assets/Logo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-b-brand-gray-900 bg-black/65 py-8 transition-all duration-300 ease-linear ${scrolled ? "group backdrop-blur-md" : "backdrop-blur-2xl"}`}
      >
        <Grid className="flex items-center justify-between">
          <Link href="/" title="Ir para a página inicial">
            <Logo />
          </Link>
          <nav className="hidden items-center justify-between gap-4 lg:flex">
            <ul className="flex items-center gap-6">
              {menuLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    className={`text-base/short font-normal transition-colors duration-300 ${scrolled ? "text-brand-gray-300 hover:text-brand-primary-default" : "text-white hover:text-brand-primary-default"}`}
                    href={item.url}
                    title={item.title}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div
              className={`h-6 w-0.5 transition-all duration-300 ease-linear ${scrolled ? "bg-brand-gray-300" : "bg-brand-gray-300"}`}
            />
            <ul className="flex items-center gap-3">
              {socialLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    target="_blank"
                    className="group"
                    href={item.url}
                    title={item.title}
                  >
                    <item.icon
                      className={`text-white transition-colors duration-300 ${scrolled ? "fill-brand-gray-100 hover:group-hover:fill-brand-primary-default" : "fill-white hover:group-hover:fill-brand-primary-default"}`}
                      size={32}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white lg:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <div
              className={`burger relative w-full ${isOpen ? "burgerActive" : ""}`}
            ></div>
          </button>
        </Grid>
      </header>
      <AsideMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
