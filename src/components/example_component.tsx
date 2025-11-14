// Example component for the config management library
// This is a placeholder component to demonstrate the setup

import React from 'react'
import { cn } from '../lib/utils'

/**
 * Example component props interface
 */
export interface ExampleComponentProps {
  /**
   * The title to display
   */
  title?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Example component for demonstrating the component library setup
 * @param props - Component props
 * @returns React component
 */
export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title = 'Example Component',
  className,
}) => {
  return (
    <div className={cn('cls_example_component p-4 border rounded-lg', className)}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-2">
        This is an example component for the config management library.
      </p>
    </div>
  )
}

