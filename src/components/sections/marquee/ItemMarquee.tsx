import React from 'react'
import { MarqueeItem } from '@/app/shared/types/types'

type ItemMarqueeProps = MarqueeItem;
export default function ItemMarquee({ title, icon: Icon }: ItemMarqueeProps) {
  return (
    <div className='py-4 px-8 bg-white/50 flex items-center gap-2 mx-2'>
      <div className='h-8 w-8 flex items-center justify-center'>
        <Icon className='text-3xl' />
      </div>
      <span className='font-poppins text-lg/short'>{title}</span>
     </div>
  )
}
