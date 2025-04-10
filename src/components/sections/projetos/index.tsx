"use client"
import React, { useState } from 'react'
import Grid from '@/components/grid'
import { dadosProjetos } from '@/app/shared/utils/data';
import ItemProject from './ItemProject';
import ModalProject from './ModalProject';
import { ModalState } from '@/app/shared/types/types';
import { PiRocketLaunch } from 'react-icons/pi';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function SectionProjetos() {
  const [modal, setModal] = useState<ModalState>({ active: false, index: 0 })
  const leftAreaRef = React.useRef<HTMLHeadingElement>(null);
  const rightAreaRef = React.useRef<HTMLDivElement>(null);

  useScrollReveal(leftAreaRef, { direction: 'left', duration: 1.2, delay: 0.5 });
  useScrollReveal(rightAreaRef, { direction: 'right', duration: 1.2, delay: 0.5 });

  return (
    <section id='projetos' className='py-28 scroll-mt-header'>
      <Grid>
        <div className='flex items-start justify-between mb-16'>
          <h2 ref={leftAreaRef} className='text-6xl/short text-brand-gray-900 w-[28.125rem] text-balance'>Projetos mais recentes</h2>
          <div ref={rightAreaRef} className='flex flex-col gap-6'>
            <div className='w-10 h-10 flex items-center justify-center bg-brand-primary-default/50 rounded-full'>
              <PiRocketLaunch size={16} />
            </div>
            <p className='w-96 text-xl/large text-brand-gray-600'>Cada projeto é pensado para gerar impacto real, combinando estética, performance e propósito.</p>
          </div>
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
