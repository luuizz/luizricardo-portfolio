import React from 'react'
import Grid from '../grid'
import Link from 'next/link'
import Image from 'next/image'
import { menuLinks, socialLinks } from '@/app/shared/utils/global-data'


export default function Header() {
  return (
    <header className='sticky top-0 z-50 py-8 bg-black/65 backdrop-blur-2xl'>
      <Grid className='flex items-center justify-between'>
        <Link href="/" title='Ir para a página inicial'>
          <Image src="logo.svg"
          alt='Logo do Luiz Ricardo'
          width={160}
          height={41}
          />
        </Link>
        <nav className='flex items-center justify-between gap-4'>
          <ul className='flex items-center gap-6'>
            {
              menuLinks.map((item, index) => (
                <li key={index}>
                  <Link className='font-normal text-white transition-colors duration-300 text-base/short hover:text-brand-primary-default' href={item.url} title={item.title}>
                    {item.title}
                  </Link>
                </li>
              ))
            }
          </ul>
          <div className='w-0.5 h-6 bg-brand-gray-700' />
          <ul className='flex items-center gap-3'>
            {
              socialLinks.map((item, index) => (
                <li key={index}>
                  <Link className='group' href={item.url} title={item.title}>
                    <item.icon className='text-white hover:group-hover:text-brand-primary-default' size={32} />
                  </Link>
                </li>
              ))
            }
          </ul>
        </nav>
      </Grid>
    </header>
  )
}
