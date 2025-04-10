'use client'
import { dadosDiferencial } from '@/app/shared/utils/data'
import Grid from '@/components/grid'
import React, { useRef } from 'react'
import CardDiferencial from './CardDiferencial'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function SectionDiferenciais() {

  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useScrollReveal(titleRef, { direction: 'left', duration: 1.2, delay: 0.5 });
  useScrollReveal(paragraphRef, { direction: 'right', duration: 1, delay: 0.5 });

  return (
    <section  id='diferenciais' className='py-28 scroll-mt-header'>
      <Grid>
        <div className='flex items-center justify-between mb-16'>
          <h2 ref={titleRef} className='text-4xl/short text-brand-gray-900'>Meus diferenciais</h2>

          <p ref={paragraphRef} className='w-96  text-base/large text-brand-gray-600'><strong className='text-brand-gray-900 font-inter'>Transformo design</strong> em páginas para a web com agilidade, qualidade e <strong className='text-brand-gray-900 font-inter'>alta perfomance.</strong></p>
        </div>

        <div className='grid grid-cols-3 gap-8'>
          {
            dadosDiferencial.map((item) => (
              <CardDiferencial key={item.id} {...item} />
            ))
          }
        </div>
      </Grid>
    </section>
  )
}
