import React from 'react'
import { twMerge } from 'tailwind-merge'

interface GridProps {
  children: React.ReactNode,
  className?: string
}

export default function Grid({ children, className }:GridProps) {
  return (
    <div className={twMerge('px-3 w-full max-w-container mx-auto', className)}>{children}</div>
  )
}
