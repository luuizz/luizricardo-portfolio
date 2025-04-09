'use client'
import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css/effect-fade';

const fotos = [
  {
    id: 1,
    src: '/img-01.png',
    alt: 'Imagem 1'
  },
  {
    id: 2,
    src: '/img-02.png',
    alt: 'Imagem 2'
  },
  {
    id: 3,
    src: '/img-03.png',
    alt: 'Imagem 3'
  }
]

export default function Slider() {
  const progressBar = useRef<HTMLDivElement>(null);
  const progressContent = useRef<HTMLDivElement>(null);
  const [paginationEl, setPaginationEl] = useState<HTMLElement | null>(null)


  return (
    <>
    <div className='relative'>
      <Swiper
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      effect={'fade'}
      grabCursor={true}
      speed={1000}
      pagination={{
        type: 'fraction',
        el: paginationEl,
      }}
      onAutoplayTimeLeft={(_, __, progress) => {
        if (progressBar.current) {
          progressBar.current.style.setProperty('--progress', `${1 - progress}`)
        }
      }}
      modules={[Autoplay, Pagination, EffectFade]}
      >
          {
            fotos.map((item) => (
              <SwiperSlide                
              key={item.id}>
                <Image
                src={item.src}
                alt={item.alt}
                width={520}
                height={673}
                className='w-full h-full object-cover'
                />
            </SwiperSlide>
            ))
          }
          <div className='relative w-full max-w-[27.375rem] -top-16 left-8 z-10'>
            <div className='text-white font-poppins text-[0.625rem]/short' ref={(el) => {
              progressContent.current = el
              setPaginationEl(el)
            }}>
              <span className='!text-white'></span>
            </div>
            <div className='mt-2 bg-brand-gray-700 w-full h-[0.125rem] relative overflow-hidden'>
              <div
                ref={progressBar}
                className='absolute left-0 top-0 h-full w-full bg-white origin-left scale-x-0 transition-transform duration-300'
                style={{
                  transform: 'scaleX(var(--progress))',
                  transition: 'transform 0.1s linear',
                }}
              ></div>
            </div>
          </div>
      </Swiper>
    </div>
    </>
  )
}
