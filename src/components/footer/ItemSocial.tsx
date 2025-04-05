import Link from 'next/link'
import React from 'react'
import { SocialLink } from '@/app/shared/types/types'

type Props = SocialLink

export default function ItemSocial({ url, icon: Icon, title }: Props) {
  return (
    <Link className='py-1 px-3 flex items-center group gap-3' href={url} target='_blank'>
    <div className='group-hover:bg-brand-gray-200 transition-all duration-300 rounded-full bg-brand-primary-default w-8 h-8 flex items-center justify-center'>
      <Icon size={14} />
    </div>
    <span className='font-medium text-brand-gray-100 transition-colors duration-300 group-hover:text-brand-primary-default text-sm/short'>{title}</span>
  </Link>
  )
}
