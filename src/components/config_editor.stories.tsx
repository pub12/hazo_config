// Storybook stories for ConfigEditor component
// Demonstrates the config editor component with mock config provider

import type { Meta, StoryObj } from '@storybook/react'
import { ConfigEditor } from './config_editor'
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
    password: 'secret123',
  },
  logging: {
    logfile: 'logs/app.log',
    level: 'info',
    max_size: '10MB',
    format: 'json',
  },
  api: {
    base_url: 'https://api.example.com',
    timeout: '5000',
    retry_count: '3',
    rate_limit: '100',
  },
  server: {
    host: '0.0.0.0',
    port: '3000',
    env: 'production',
    cors_enabled: 'true',
  },
}

/**
 * Meta configuration for ConfigEditor stories
 */
const meta: Meta<typeof ConfigEditor> = {
  title: 'Components/ConfigEditor',
  component: ConfigEditor,
  parameters: {
    layout: 'fullscreen',
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
type Story = StoryObj<typeof ConfigEditor>

/**
 * Default story with full configuration
 */
export const Default: Story = {
  args: {
    config_provider: new MockConfigProvider(sample_config),
  },
}

/**
 * Story with minimal configuration
 */
export const MinimalConfig: Story = {
  args: {
    config_provider: new MockConfigProvider({
      app: {
        name: 'My App',
        version: '1.0.0',
      },
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
 * Story with complex configuration
 */
export const ComplexConfig: Story = {
  args: {
    config_provider: new MockConfigProvider({
      ...sample_config,
      features: {
        feature_a: 'enabled',
        feature_b: 'disabled',
        feature_c: 'beta',
      },
      integrations: {
        stripe_api_key: 'sk_test_123456',
        sendgrid_api_key: 'SG.abcdef',
        aws_region: 'us-east-1',
      },
    }),
  },
}

