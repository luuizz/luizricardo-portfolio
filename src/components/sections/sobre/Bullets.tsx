import React from 'react'
import { Bullet } from '@/app/shared/types/types'

type DetailsBullet = Bullet;

export default function Bullets({ icon: Icon, title }: DetailsBullet) {
  return (
    <div className='py-3 px-4 flex items-center gap-2 rounded-full border border-brand-gray-100'>
      <div className='h-8 w-8 flex items-center justify-center rounded-full bg-brand-primary-default'>
        <Icon  />
      </div>
      <span className='text-sm/short '>{ title }</span>
    </div>
  )
}
