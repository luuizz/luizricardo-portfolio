import React from 'react'
import Marquee from 'react-fast-marquee'
import ItemMarquee from './ItemMarquee'
import { dadosMarquee } from '@/app/shared/utils/data'

export default function SectionMarquee() {
  return (
    <section className='py-6 bg-brand-primary-default'>
      <Marquee
      autoFill={true}
      gradient={true}
      gradientColor='#FFD300'
      speed={20}
      loop={0}
      >
        {
          dadosMarquee.map((item) => (
            <ItemMarquee key={item.id} {...item} />
          ))
        }
      </Marquee>
    </section>
  )
}
