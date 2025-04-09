"use client"
import Link from 'next/link'
import React, { useRef } from 'react'
import Image from 'next/image'
import Element01 from '@/app/assets/Element'
import Element02 from '@/app/assets/Element02'
import Grid from '@/components/grid'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Slider from './Slider'

export default function SectionHero() {

  const areaTextRef = useRef<HTMLDivElement>(null)
  const circleAvatarRef = useRef<HTMLImageElement>(null)
  const circleLogoRef = useRef<HTMLImageElement>(null)
  const areaImagesRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const elements = [
      { ref: areaTextRef, xFrom: -20 },
      { ref: circleAvatarRef, xFrom: -30 },
      { ref: circleLogoRef, xFrom: 30 },
      { ref: areaImagesRef, xFrom: 30 },
    ]

    const tl = gsap.timeline()

    elements.forEach((el, i) => {
      if (el.ref.current) {
        tl.fromTo(
          el.ref.current,
          { opacity: 0, x: el.xFrom },
          { opacity: 1, x: 0, duration: 1 },
          i === 0 ? 'start' : '>-1'
        )
      }
    })
  }, [])

  return (
    <section className='py-56 -mt-28 bg-black overflow-hidden'>
      <Grid>
        <main className='flex items-center justify-between'>
          <div className='flex-1 max-w-[645px]' ref={areaTextRef}>
            <span className='text-base/short text-brand-gray-200 font-poppins tracking-widest font-medium'>
              Olá, eu sou <strong className='text-white font-semibold'>Luiz Ricardo</strong> 👋🏻
            </span>

            <h1 className='text-6xl/short mt-6 mb-4 text-brand-gray-100'>
            Especialista
              <div className='inline-flex mx-3 align-middle'>
                <Image
                src="/foto_luiz.png"
                alt='Foto do Luiz Ricardo'
                width={56}
                height={56}
                ref={circleAvatarRef}
                />
                <Image
                className='-ml-2'
                src="/avatar-logo.svg"
                alt='Símbolo do Logo do Luiz Ricardo'
                width={56}
                height={56}
                ref={circleLogoRef}
                />
              </div>
            em Desenvolvimento Front-end
            </h1>
            <p className='text-brand-gray-500 text-lg/large mb-16 w-[32.5rem] text-balance'>Trabalhei em diversos projetos front-end, desde pequenos websites até lojas virtuais. Essa experiência prática me permitiu desenvolver habilidades que me ajudam a criar soluções eficientes e eficazes.</p>
            
            <Link className='p-2 group flex items-center gap-4 ' href="/#contato">
              <span className='!font-poppins transition-colors duration-300 group-hover:text-brand-primary-default font-semibold text-lg/short underline text-brand-gray-100'>Vamos conversar?</span>
              <Image className='transition-transform duration-300 group-hover:rotate-180' src={"/arrow.svg"} alt='Ícone de uma seta' width={14} height={19} />
            </Link>
          </div>
          <div className='flex-1 max-w-[520px] relative' ref={areaImagesRef}>
              <Element01 className='absolute bottom-28 -right-16 z-10' />
              <Element02 className='absolute top-16 -left-20 z-10' />
              <Slider />
          </div>
        </main>
      </Grid>
    </section>
  )
}
