import Link from 'next/link'
import { IconType } from 'react-icons'
import React from 'react'

interface ButtonProps {
  url: string
  children: React.ReactNode
  icon?: IconType
  variant?: 'filled' | 'outline'
  isLink?: boolean
  className?: string
}

export default function Button({
  url,
  children,
  icon: Icon,
  variant = 'filled',
  isLink = true,
  className = '',
}: ButtonProps) {
  const baseStyles = 'inline-block text-center py-4 px-8 flex items-center gap-3 text-base/short rounded-md transition-colors duration-300'
  const filled = 'bg-brand-primary-default text-black hover:bg-brand-primary-dark'
  const outline = 'border border-brand-primary-default text-brand-primary-default hover:bg-brand-primary-default hover:text-black'

  const combinedClasses = `${baseStyles} ${variant === 'filled' ? filled : outline} ${className}`

  const content = (
    <>
      {Icon && <Icon size={24} className="text-current" />}
      <span>{children}</span>
    </>
  )

  return isLink ? (
    <Link href={url} className={combinedClasses} target='_blank'>
      {content}
    </Link>
  ) : (
    <button className={combinedClasses} onClick={() => window.open(url, '_blank')}>
      {content}
    </button>
  )
}
