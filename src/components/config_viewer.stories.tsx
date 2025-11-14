// Storybook stories for ConfigViewer component
// Demonstrates the config viewer component with mock config provider

import type { Meta, StoryObj } from '@storybook/react'
import { ConfigViewer } from './config_viewer'
import { MockConfigProvider } from '../lib/mock_config_provider'

/**
 * Sample configuration data for testing
 */
const sample_config = {
  database: {
    host: 'localhost',
    port: '5432',
    name: 'myapp_db',
    user: 'admin',
  },
  logging: {
    logfile: 'logs/app.log',
    level: 'info',
    max_size: '10MB',
  },
  api: {
    base_url: 'https://api.example.com',
    timeout: '5000',
    retry_count: '3',
  },
}

/**
 * Meta configuration for ConfigViewer stories
 */
const meta: Meta<typeof ConfigViewer> = {
  title: 'Components/ConfigViewer',
  component: ConfigViewer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    config_provider: {
      control: false,
      description: 'The config provider instance',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof ConfigViewer>

/**
 * Default story with sample configuration
 */
export const Default: Story = {
  args: {
    config_provider: new MockConfigProvider(sample_config),
  },
}

/**
 * Story with database configuration only
 */
export const DatabaseConfig: Story = {
  args: {
    config_provider: new MockConfigProvider({
      database: sample_config.database,
    }),
  },
}

/**
 * Story with logging configuration
 */
export const LoggingConfig: Story = {
  args: {
    config_provider: new MockConfigProvider({
      logging: sample_config.logging,
    }),
  },
}

/**
 * Story with API configuration
 */
export const ApiConfig: Story = {
  args: {
    config_provider: new MockConfigProvider({
      api: sample_config.api,
    }),
  },
}

/**
 * Story with empty configuration
 */
export const EmptyConfig: Story = {
  args: {
    config_provider: new MockConfigProvider(),
  },
}

/**
 * Story with multiple sections
 */
export const MultipleSections: Story = {
  args: {
    config_provider: new MockConfigProvider({
      ...sample_config,
      server: {
        host: '0.0.0.0',
        port: '3000',
        env: 'production',
      },
      app: {
        name: 'My App',
        version: '1.0.0',
        debug: 'false',
      },
    }),
  },
}

