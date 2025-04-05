import { baseSocialLinks } from '@/app/shared/utils/socialBase'
import Button from '@/components/Button'
import Grid from '@/components/grid'
import Image from 'next/image'
import React from 'react'
import { PiGlobe } from 'react-icons/pi'

export default function CallToAction() {
  const cvLink = baseSocialLinks.find(link => link.title === 'Curriculum')
  const whatsappLink = baseSocialLinks.find(link => link.title === 'Whatsapp')
  return (
    <section className='bg-black py-28' id='contato'>
      <Grid className='flex items-center justify-between'>
        <div className='flex-1 max-w-[36.9375rem]'>
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
        <div className='flex-1 max-w-[30.5rem] relative'>
          <div className='w-24 absolute top-20 -left-12 h-24 flex items-center justify-center bg-brand-primary-default rounded-full'>
            <PiGlobe size={50} />
          </div>
          <Image src="/globe.png" alt='Imagem de um globo em wireframe' width={488} height={488} />
        </div>
      </Grid>
    </section>
  )
}
