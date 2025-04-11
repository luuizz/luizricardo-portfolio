'use client'

import React, { useRef } from 'react'
import BadgeIcon from '@/app/assets/BadgeIcon'
import Grid from '@/components/grid'
import Image from 'next/image'
import Link from 'next/link'
import Bullets from './Bullets'
import { dadosBullets } from '@/app/shared/utils/data'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import usePrefersReducedMotion from '@/hooks/usePreferReducedMotion'
import useIsDesktop from '@/hooks/useIsDesktop'

export default function SectionSobre() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const leftAreaRef = useRef<HTMLDivElement>(null);
  const rightAreaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  const disabled = prefersReducedMotion || !isDesktop;

  useScrollReveal(leftAreaRef, { direction: 'left', duration: 1, disabled })
  useScrollReveal(rightAreaRef, { direction: 'right', duration: 1, disabled })
  useScrollReveal(cardsRef, { direction: 'bottom', duration: 1, stagger: 0.2, disabled })

  return (
    <section id='quem-sou' className='overflow-hidden py-16 sm:py-20 lg:py-28 scroll-mt-header'>
      <Grid className='flex lg:flex-row flex-col items-center justify-between gap-10'>
        <div ref={leftAreaRef} className='flex-1 max-w-[29.25rem] relative'>
          <Image src={"/foto-destaque.png"} alt='Foto de destaque do Luiz Ricardo' width={488} height={665} />
          <BadgeIcon className='absolute hidden sm:block top-1/2 -translate-y-1/2 -right-8'  />
        </div>
        <div ref={rightAreaRef} className='flex-1 text-center lg:text-left max-w-full sm:max-w-[80%] lg:max-w-[26.75rem] xl:max-w-[32rem]'>
          <h4 className='mb-6 text-lg/short font-inter font-semibold text-black'>Olá, prazer 👋🏻</h4>
          <h2 className='text-4xl-short/short mb-1'>Luiz Ricardo</h2>
          <h5 className='mb-10 text-lg/short text-black font-inter font-semibold'>Desenvolvedor Front end</h5>
          <p className='text-base/large text-brand-gray-700 mb-6 w-auto lg:w-[27.125rem]'>Sou formado em Design Gráfico e trabalho como desenvolvedor front-end há 3 anos. Minhas experiências na área de programação me fizeram evoluir como profissional, e como consequência do amor pelo que faço, desenvolver se tornou meu hobby favorito.</p>

          <Link className='text-brand-gray-800 underline font-semibold transition-colors duration-300 hover:text-brand-primary-dark' href={"https://www.instagram.com/luizricardo.st/"} title='Instagram' target='_blank'>@luizricardo.st</Link>

          <div className='mt-14 flex justify-center lg:justify-start flex-wrap gap-4'>
            {
              dadosBullets.map((item) => (
                <Bullets key={item.id} {...item} />
              ))
            }
          </div>
        </div>
      </Grid>
    </section>
  )
}
