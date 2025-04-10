'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react';
import { slideUp, opacity } from './Animation';


const words = ["Olá!" ,"Hello!", "Bonjour", "Ciao", "やあ", "Hallå", "Guten tag", "Hallo"]

export default function PreloaderAnimation() {

  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({width: 0, height:0});

  useEffect( () => {
    setDimension({width: window.innerWidth, height: window.innerHeight})
}, [])

useEffect( () => {
  if(index == words.length - 1) return;
  setTimeout( () => {
      setIndex(index + 1)
  }, index == 0 ? 1000 : 150)
}, [index])

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width/2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width/2} ${dimension.height} 0 ${dimension.height}  L0 0`

  const curve = {
    initial: {
        d: initialPath,
        transition: {duration: 1, ease: [0.76, 0, 0.24, 1]}
    },
    exit: {
        d: targetPath,
        transition: {duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.5}
    }
}

  return (
    <motion.div variants={slideUp} initial="initial" exit="exit" className="h-screen w-screen flex items-center justify-center fixed z-[99] bg-brand-gray-900">
    {dimension.width > 0 && 
    <>
        <motion.p
        className='flex items-center absolute z-10 text-5xl/short font-poppins font-semibold text-white' 
        variants={opacity} 
        initial="initial" 
        animate="enter">
          <span className='block w-3 h-3 bg-white rounded-full mr-3'></span>
          {words[index]}
        </motion.p>
        <svg className='absolute top-0 w-full h-curve-svg'>
            <motion.path className='fill-brand-gray-900' variants={curve} initial="initial" exit="exit"></motion.path>
        </svg>
    </>
    }
    </motion.div>
  )
}
