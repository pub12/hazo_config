// Mock config provider for browser/Storybook testing
// Implements ConfigProvider interface using in-memory storage instead of file system

import type { ConfigProvider } from './types'

/**
 * Mock config provider that stores configuration in memory
 * Useful for testing and Storybook demonstrations where file system is not available
 */
export class MockConfigProvider implements ConfigProvider {
  private config: Record<string, Record<string, string>> = {}

  /**
   * Constructor
   * @param initial_config - Optional initial configuration data
   */
  constructor(initial_config?: Record<string, Record<string, string>>) {
    if (initial_config) {
      this.config = JSON.parse(JSON.stringify(initial_config)) // Deep copy
    }
  }

  /**
   * Get a configuration value by section and key
   * @param section - The configuration section name
   * @param key - The configuration key name
   * @returns The configuration value, or undefined if not found
   */
  get(section: string, key: string): string | undefined {
    return this.config[section]?.[key]
  }

  /**
   * Get an entire configuration section
   * @param section - The configuration section name
   * @returns A record of key-value pairs for the section, or undefined if section doesn't exist
   */
  getSection(section: string): Record<string, string> | undefined {
    return this.config[section] ? { ...this.config[section] } : undefined
  }

  /**
   * Set a configuration value
   * @param section - The configuration section name
   * @param key - The configuration key name
   * @param value - The value to set
   */
  set(section: string, key: string, value: string): void {
    if (!this.config[section]) {
      this.config[section] = {}
    }
    this.config[section][key] = value
  }

  /**
   * Save the current configuration (no-op for mock, but maintains interface compatibility)
   */
  save(): void {
    // No-op for mock provider
  }

  /**
   * Refresh the configuration (no-op for mock, but maintains interface compatibility)
   */
  refresh(): void {
    // No-op for mock provider
  }

  /**
   * Get all configuration sections
   * @returns A record of all sections and their key-value pairs
   */
  getAllSections(): Record<string, Record<string, string>> {
    const result: Record<string, Record<string, string>> = {}
    for (const [section, values] of Object.entries(this.config)) {
      result[section] = { ...values }
    }
    return result
  }

  /**
   * Reset the configuration to initial state or empty
   * @param new_config - Optional new configuration to set
   */
  reset(new_config?: Record<string, Record<string, string>>): void {
    if (new_config) {
      this.config = JSON.parse(JSON.stringify(new_config))
    } else {
      this.config = {}
    }
  }
}

