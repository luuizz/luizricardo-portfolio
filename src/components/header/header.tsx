'use client'
import React, { useEffect, useState } from 'react'
import Grid from '../grid'
import Link from 'next/link'
import { menuLinks, socialLinks } from '@/app/shared/utils/global-data'
import AsideMenu from './AsideMenu'
import Logo from '@/app/assets/Logo'


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <header className={`sticky transition-all duration-300 ease-linear py-8 top-0 z-50  bg-black/65  ${scrolled ? 'group backdrop-blur-md bg-white/70' : 'backdrop-blur-2xl'}`}>
      <Grid className='flex items-center justify-between'>
        <Link href="/" title='Ir para a página inicial'>
          <Logo className={scrolled ? 'fill-black' : 'fill-white'} />
        </Link>
        <nav className='hidden lg:flex items-center justify-between gap-4'>
          <ul className='flex items-center gap-6'>
            {
              menuLinks.map((item, index) => (
                <li key={index}>
                  <Link 
                  className={`font-normal transition-colors duration-300 text-base/short hover:text-brand-primary-default ${scrolled ? 'text-brand-gray-800' : 'text-white'}`} 
                  href={item.url} 
                  title={item.title}>
                    {item.title}
                  </Link>
                </li>
              ))
            }
          </ul>
          <div className={`w-0.5 transition-all duration-300 ease-linear h-6 ${scrolled ? 'bg-brand-gray-300' : 'bg-brand-gray-700'}`} />
          <ul className='flex items-center gap-3'>
            {
              socialLinks.map((item, index) => (
                <li key={index}>
                  <Link target='_blank' className='group' href={item.url} title={item.title}>
                    <item.icon className={`transition-colors duration-300 text-white hover:group-hover:fill-brand-primary-default ${scrolled ? 'fill-brand-gray-800' : 'fill-white'}`} size={32} />
                  </Link>
                </li>
              ))
            }
          </ul>
        </nav>
        <button 
        onClick={() => setIsOpen(!isOpen)} 
        className='lg:hidden relative z-50 w-14 h-14 rounded-full cursor-pointer flex items-center justify-center bg-white'
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        >
          <div className={`burger w-full relative ${isOpen ? 'burgerActive' : ''}`}></div>
        </button>
      </Grid>
    </header>
      <AsideMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
