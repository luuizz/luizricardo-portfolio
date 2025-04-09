"use client"
import React, { useState } from 'react'
import Grid from '@/components/grid'
import { dadosProjetos } from '@/app/shared/utils/data';
import ItemProject from './ItemProject';
import ModalProject from './ModalProject';
import { ModalState } from '@/app/shared/types/types';


export default function SectionProjetos() {
  const [modal, setModal] = useState<ModalState>({ active: false, index: 0 })

  return (
    <section id='projetos' className='py-28 scroll-mt-header'>
      <Grid>
        <div className='flex items-start justify-between mb-16'>
          <h2 className='text-6xl/short text-brand-gray-900 w-[28.125rem] text-balance'>Projetos mais recentes</h2>
          <p className='w-96 text-base/large text-brand-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
        <div className='relative'>
          {
            dadosProjetos.map((item, index) => (
              <ItemProject key={index}
              {...item}
              index={index}
              setModal={setModal}
              />
            ))
          }
        </div>
        <ModalProject modal={modal} projects={dadosProjetos} />
      </Grid>
    </section>
  )
}
