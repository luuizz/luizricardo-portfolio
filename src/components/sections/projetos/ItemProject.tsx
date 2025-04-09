import React, { Dispatch, SetStateAction } from 'react'
import Link from 'next/link'
import { ModalState, Projects } from '@/app/shared/types/types'

type ItemProjectProps = Projects & {
  index: number
  setModal: Dispatch<SetStateAction<ModalState>>
}

export default function ItemProject({ title, category, url, setModal, index }:ItemProjectProps) {
  return (
    <Link href={url ?? '#'}
    className='flex w-full justify-between items-center py-14 px-28 border-t last:border-b border-s-neutral-100 hover:opacity-50 transition-opacity duration-300 group cursor-pointer' 
    target='_blank'
      onMouseEnter={() => setModal({ active: true, index })}
      onMouseLeave={() => setModal({ active: false, index })}
    >
      <h3 className='transition-transform group-hover:-translate-x-3 text-4xl/short text-black'>{title}</h3>
      <p className='text-lg/short text-brand-gray-700 transition-transform group-hover:translate-x-3'>{category}</p>
    </Link>
  )
}
