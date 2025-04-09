"use client"
import React, { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ModalState, Projects } from '@/app/shared/types/types'

const scaleAnimation = {
  initial: { scale: 0, x: '-50%', y: '-50%' },
  enter: {
    scale: 1,
    x: '-50%',
    y: '-50%',
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    scale: 0,
    x: '-50%',
    y: '-50%',
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
  },
}

type ModalProjectProps = {
  modal: ModalState
  projects: Projects[]
}

export default function ModalProject({ modal, projects }: ModalProjectProps) {

  const { active, index } = modal;
  const modalRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorLabelRef = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    const xModal = gsap.quickTo(modalRef.current, 'left', { duration: 0.8, ease: 'power3' })
    const yModal = gsap.quickTo(modalRef.current, 'top', { duration: 0.8, ease: 'power3' })

    const xCursor = gsap.quickTo(cursorRef.current, 'left', { duration: 0.5, ease: 'power3' })
    const yCursor = gsap.quickTo(cursorRef.current, 'top', { duration: 0.5, ease: 'power3' })

    const xLabel = gsap.quickTo(cursorLabelRef.current, 'left', { duration: 0.45, ease: 'power3' })
    const yLabel = gsap.quickTo(cursorLabelRef.current, 'top', { duration: 0.45, ease: 'power3' })

    const handleMouseMove = (e: MouseEvent) => {
      const { pageX, pageY } = e
      xModal(pageX)
      yModal(pageY)
      xCursor(pageX)
      yCursor(pageY)
      xLabel(pageX)
      yLabel(pageY)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])


  return (
    <>
    <motion.div 
    className='absolute bg-white overflow-hidden flex items-center justify-center w-[25rem] h-[21.875rem] pointer-events-none'
    ref={modalRef}
    variants={scaleAnimation} 
    initial="initial" 
    animate={active ? "enter" : "closed"}>
      <div className='h-full w-full absolute transition-top ease-transition-project-cards duration-500' 
      style={{top: index * -100 + "%"}}>
      {projects.map((project, i) => (
            <div
              key={`modal_${i}`}
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: project.color }}
              >
              <Image
                src={project.imgSrc}
                alt={project.title ?? 'Projeto'}
                width={300}
                height={0}
                className="h-auto"
              />
            </div>
          ))}
      </div>
    </motion.div>
    <motion.div 
    ref={cursorRef}
    className='project-cursor'
    variants={scaleAnimation} initial="initial" 
    animate={active ? "enter" : "closed"} />
    <motion.div 
    ref={cursorLabelRef}
    className='project-cursor bg-transparent' 
    variants={scaleAnimation} initial="initial" 
    animate={active ? "enter" : "closed"}>Ver site</motion.div>
    </>
  )
}
