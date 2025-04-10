import { menuLinks, socialLinks } from '@/app/shared/utils/global-data'
import Link from 'next/link'
import React from 'react'
import Grid from '../grid'

export default function AsideMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <div className={`fixed top-0 bottom-0 bg-black block text-white w-full h-screen z-40 overflow-y-auto transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'} lg:hidden`}>
      <Grid className='py-10 gap-10 h-screen flex flex-col items-center justify-center'>
      <ul className='flex flex-col items-center gap-6'>
        {
          menuLinks.map((item, index) => (
            <li key={index}>
              <Link onClick={onClose} className='font-normal text-white transition-colors duration-300 text-lg/short hover:text-brand-primary-default' href={item.url} title={item.title}>
                {item.title}
              </Link>
            </li>
          ))
        }
      </ul>
      <ul className='flex flex-col sm:flex-row items-center gap-3'>
        {
          socialLinks.map((item, index) => (
            <li key={index}>
              <Link target='_blank' className='group underline text-lg/short' href={item.url} title={item.title}>
                {item.title}
              </Link>
            </li>
          ))
        }
      </ul>
      </Grid>
    </div>
  )
}
