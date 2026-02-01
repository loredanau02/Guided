import type { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-cream-200 shadow-sm',
        hover && 'hover:shadow-md hover:border-sage-200 transition-shadow cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={clsx('px-6 py-4 border-b border-cream-100', className)}>{children}</div>
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={clsx('px-6 py-4', className)}>{children}</div>
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={clsx('px-6 py-3 border-t border-cream-100 bg-cream-50 rounded-b-xl', className)}>{children}</div>
}
