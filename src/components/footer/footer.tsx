import React from 'react'
import Grid from '../grid'
import Image from 'next/image'
import Link from 'next/link'
import ItemSocial from './ItemSocial'
import { socialLinksFooter } from '@/app/shared/utils/global-data'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className='py-10 bg-black'>
      <Grid>
        <div className='flex items-center justify-between mb-10 pb-10 border-b border-brand-gray-700'>
          <Image src="/logo.svg" alt='Logo do Luiz Ricardo' width={210} height={54} />
          <Link href="mailto:luu.izz@hotmail.com" target='_blank' className='text-brand-gray-100 font-poppins text-2xl/short font-semibold transition-colors duration-300 hover:text-brand-primary-default'>luu.izz@hotmail.com</Link>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-white text-sm/large'>©{year} | São Paulo – SP</span>
          <ul className='flex items-center gap-6'>
            {
              socialLinksFooter.map((item) => (
                <li key={item.id}>
                  <ItemSocial {...item} />
                </li>
              ))
            }
          </ul>
        </div>
      </Grid>
    </footer>
  )
}
