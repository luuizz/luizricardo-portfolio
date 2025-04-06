import { Diferencial } from '@/app/shared/types/types'
import React from 'react'

type CardDiferencialProps = Diferencial

export default function CardDiferencial({ icon: Icon, description, title }: CardDiferencialProps) {
  return (
    <div className='p-8 bg-brand-gray-100 rounded-lg'>
      <Icon className='text-[40px]' width={40} height={40} />
      <h3 className='my-4 text-xl/short text-brand-gray-900'>{title}</h3>
      <p className='text-base/large text-brand-gray-600'>{description}</p>
    </div>
  )
}
