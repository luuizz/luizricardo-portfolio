'use client'
import React, { useRef } from 'react'
import { Diferencial } from '@/app/shared/types/types'
import { useScrollReveal } from '@/hooks/useScrollReveal';

type CardDiferencialProps = Diferencial

export default function CardDiferencial({ icon: Icon, description, title }: CardDiferencialProps) {

  const cardsRef = useRef<HTMLDivElement>(null);
  useScrollReveal(cardsRef, { direction: 'bottom', duration: 1, stagger: 1 })

  return (
    <div ref={cardsRef} className='p-8 bg-brand-gray-100 rounded-lg'>
      <Icon className='text-[40px]' width={40} height={40} />
      <h3 className='my-4 text-xl/short text-brand-gray-900'>{title}</h3>
      <p className='text-base/large text-brand-gray-600'>{description}</p>
    </div>
  )
}
