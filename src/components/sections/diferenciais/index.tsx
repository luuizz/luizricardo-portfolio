import { dadosDiferencial } from '@/app/shared/utils/data'
import Grid from '@/components/grid'
import React from 'react'
import CardDiferencial from './CardDiferencial'

export default function SectionDiferenciais() {
  return (
    <section id='diferenciais' className='py-28 scroll-mt-header'>
      <Grid>
        <div className='flex items-center justify-between mb-16'>
          <h2 className='text-4xl/short text-brand-gray-900'>Meus diferenciais</h2>

          <p className='w-96  text-base/large text-brand-gray-600'><strong className='text-brand-gray-900 font-inter'>Transformo design</strong> em páginas para a web com agilidade, qualidade e <strong className='text-brand-gray-900 font-inter'>alta perfomance.</strong></p>
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
