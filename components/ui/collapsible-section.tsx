'use client'

import * as React from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface CollapsibleSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  contentClassName?: string
}

const CollapsibleSection = React.forwardRef<HTMLDivElement, CollapsibleSectionProps>(
  (
    {
      title,
      children,
      defaultOpen = false,
      variant = 'default',
      size = 'default',
      icon,
      rightIcon,
      className,
      contentClassName,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    const variantStyles = {
      default: 'border rounded-md overflow-hidden',
      outline: 'border-2 rounded-md overflow-hidden',
      ghost: 'overflow-hidden rounded-lg',
    }

    const headerVariantStyles = {
      default: 'hover:bg-muted/50',
      outline: 'hover:bg-muted/50',
      ghost: 'border-b hover:bg-muted/30',
    }

    const sizeStyles = {
      sm: 'p-2',
      default: 'p-3',
      lg: 'p-4',
    }

    const titleSizeStyles = {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    }

    return (
      <div ref={ref} className={cn(variantStyles[variant], className)} {...props}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between transition-colors',
            headerVariantStyles[variant],
            sizeStyles[size]
          )}
        >
          <div className="flex items-center gap-2">
            {icon}
            <h4 className={cn('font-medium', titleSizeStyles[size])}>{title}</h4>
          </div>
          {rightIcon ||
            (isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ))}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={cn(sizeStyles[size], contentClassName)}>{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

CollapsibleSection.displayName = 'CollapsibleSection'

export { CollapsibleSection }
