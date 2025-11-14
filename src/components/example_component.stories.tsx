// Storybook stories for the ExampleComponent
// Demonstrates how to create stories for components

import type { Meta, StoryObj } from '@storybook/react'
import { ExampleComponent } from './example_component'

/**
 * Meta configuration for ExampleComponent stories
 */
const meta: Meta<typeof ExampleComponent> = {
  title: 'Components/ExampleComponent',
  component: ExampleComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof ExampleComponent>

/**
 * Default story for ExampleComponent
 */
export const Default: Story = {
  args: {
    title: 'Example Component',
  },
}

/**
 * Story with custom title
 */
export const CustomTitle: Story = {
  args: {
    title: 'Custom Title Example',
  },
}

/**
 * Story with custom styling
 */
export const CustomStyling: Story = {
  args: {
    title: 'Styled Component',
    className: 'bg-blue-100 border-blue-500',
  },
}

