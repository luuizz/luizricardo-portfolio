import BadgeIcon from '@/app/assets/BadgeIcon'
import Grid from '@/components/grid'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Bullets from './Bullets'
import { dadosBullets } from '@/app/shared/utils/data'

export default function SectionSobre() {
  return (
    <section id='quem-sou' className='py-28 scroll-mt-header'>
      <Grid className='flex items-center justify-between gap-10'>
        <div className='flex-1 max-w-[29.25rem] relative'>
          <Image src={"/foto-destaque.png"} alt='Foto de destaque do Luiz Ricardo' width={488} height={665} />
          <BadgeIcon className='absolute top-1/2 -translate-y-1/2 -right-8'  />
        </div>
        <div className='flex-1 max-w-[32rem]'>
          <h4 className='mb-6 text-lg/short font-inter font-semibold text-black'>Olá, prazer 👋🏻</h4>
          <h2 className='text-4xl-short/short mb-1'>Luiz Ricardo</h2>
          <h5 className='mb-10 text-lg/short text-black font-inter font-semibold'>Desenvolvedor Front end</h5>
          <p className='text-base/large text-brand-gray-700 mb-6 w-[27.125rem]'>Sou formado em Design Gráfico e trabalho como desenvolvedor front-end há 3 anos. Minhas experiências na área de programação me fizeram evoluir como profissional, e como consequência do amor pelo que faço, desenvolver se tornou meu hobby favorito.</p>

          <Link className='text-brand-gray-800 underline font-semibold transition-colors duration-300 hover:text-brand-primary-dark' href={"https://www.instagram.com/luizricardo.st/"} title='Instagram' target='_blank'>@luizricardo.st</Link>

          <div className='mt-14 flex flex-wrap gap-4'>
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
