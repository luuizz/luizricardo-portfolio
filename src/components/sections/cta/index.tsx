'use client'
import React from 'react'
import { baseSocialLinks } from '@/app/shared/utils/socialBase'
import Button from '@/components/Button'
import Grid from '@/components/grid'
import Image from 'next/image'
import { PiGlobe } from 'react-icons/pi'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function CallToAction() {
  const cvLink = baseSocialLinks.find(link => link.title === 'Curriculum')
  const whatsappLink = baseSocialLinks.find(link => link.title === 'Whatsapp')

  const leftAreaRef = React.useRef<HTMLDivElement>(null)
  const rightAreaRef = React.useRef<HTMLDivElement>(null)
  const globeRef = React.useRef<HTMLDivElement>(null)

  useScrollReveal(leftAreaRef, { direction: 'left', duration: 1 })
  useScrollReveal(rightAreaRef, { direction: 'right', duration: 1 })
  useScrollReveal(globeRef, { direction: 'bottom', duration: 1.2, delay: 0.5 });

  return (
    <section className='bg-black py-28 scroll-mt-header' id='contato'>
      <Grid className='flex items-center justify-between'>
        <div ref={leftAreaRef} className='flex-1 max-w-[36.9375rem]'>
          <h2 className='text-6xl-short/short mb-4 text-white'>Vamos construir algo incrível juntos.</h2>
          <p className='mb-10 text-lg/large text-brand-gray-400 w-96'>Interfaces responsivas, código limpo e foco total na melhor experiência para o usuário.</p>

          <div className='flex items-center gap-4'>
          {whatsappLink && (
              <Button url={whatsappLink.url} icon={whatsappLink.icons.filled} variant='filled'>
                Entre em contato
              </Button>
            )}
            {cvLink && (
              <Button url={cvLink.url} icon={cvLink.icons.filled} variant='outline'>
                Baixe meu CV
              </Button>
            )}
          </div>
        </div>
        <div ref={rightAreaRef} className='flex-1 max-w-[30.5rem] relative'>
          <div ref={globeRef} className='w-24 absolute top-20 -left-12 h-24 flex items-center justify-center bg-brand-primary-default rounded-full'>
            <PiGlobe size={50} />
          </div>
          <Image src="/globe.png" alt='Imagem de um globo em wireframe' width={488} height={488} />
        </div>
      </Grid>
    </section>
  )
}
