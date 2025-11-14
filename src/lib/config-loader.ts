/**
 * Purpose: Main implementation of HazoConfig
 *
 * This file provides the HazoConfig class that implements the ConfigProvider
 * interface. It handles reading and writing INI configuration files with
 * in-memory caching, sync operations, and preservation of file formatting.
 * Zero dependencies - only Node.js built-ins and the 'ini' package.
 */

import fs from 'fs'
import path from 'path'
import ini from 'ini'
import type { ConfigProvider, HazoConfigOptions, Logger } from './types'
import { ConfigErrorCode as EC } from './types'

/**
 * No-op logger implementation (default when no logger provided)
 */
const no_op_logger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {}
}

/**
 * HazoConfig class
 * 
 * Implements ConfigProvider interface for managing INI configuration files.
 * Provides sync read/write operations with in-memory caching.
 */
export class HazoConfig implements ConfigProvider {
  private filePath: string
  private logger: Logger
  private config: Record<string, Record<string, string>> = {}

  /**
   * Constructor
   * @param options - Configuration options including filePath and optional logger
   * @throws Error if file doesn't exist
   */
  constructor(options: HazoConfigOptions) {
    this.filePath = path.resolve(options.filePath)
    this.logger = options.logger || no_op_logger

    // Validate file exists
    if (!fs.existsSync(this.filePath)) {
      const error: any = new Error(`Configuration file not found: ${this.filePath}`)
      error.code = EC.FILE_NOT_FOUND
      this.logger.error(`[HazoConfig] Configuration file not found: ${this.filePath}`)
      throw error
    }

    // Load initial configuration
    this.refresh()
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
    this.logger.info(`[HazoConfig] Set config value: ${section}.${key}`, { value })
  }

  /**
   * Save the current configuration to disk
   * Writes all changes immediately to the configuration file
   */
  save(): void {
    try {
      // Convert config object back to INI format
      const iniContent = ini.stringify(this.config, {
        section: '[',
        whitespace: true
      })

      // Write to file
      fs.writeFileSync(this.filePath, iniContent, 'utf-8')
      
      this.logger.info(`[HazoConfig] Configuration saved to: ${this.filePath}`)
    } catch (error: any) {
      const configError: any = new Error(`Failed to save configuration: ${error.message || String(error)}`)
      configError.code = EC.WRITE_ERROR
      configError.originalError = error
      this.logger.error(`[HazoConfig] Failed to save configuration: ${this.filePath}`, { error: String(error) })
      throw configError
    }
  }

  /**
   * Refresh the configuration from disk
   * Reloads the configuration file and updates the in-memory cache
   */
  refresh(): void {
    try {
      // Read file content
      const content = fs.readFileSync(this.filePath, 'utf-8')
      // Parse INI content
      const parsed = ini.parse(content)
      
      // Convert to our internal format (ensure all values are strings)
      this.config = {}
      for (const [section, values] of Object.entries(parsed)) {
        if (typeof values === 'object' && values !== null) {
          this.config[section] = {}
          for (const [key, value] of Object.entries(values)) {
            this.config[section][key] = String(value)
          }
        }
      }

      this.logger.info(`[HazoConfig] Configuration refreshed from: ${this.filePath}`, {
        sections: Object.keys(this.config)
      })
    } catch (error: any) {
      // Handle file read errors
      if (error.code === 'ENOENT') {
        const configError: any = new Error(`Configuration file not found: ${this.filePath}`)
        configError.code = EC.FILE_NOT_FOUND
        this.logger.error(`[HazoConfig] Configuration file not found: ${this.filePath}`)
        throw configError
      }

      // Handle parse errors
      const configError: any = new Error(`Failed to parse configuration: ${error.message || String(error)}`)
      configError.code = EC.PARSE_ERROR
      configError.originalError = error
      this.logger.error(`[HazoConfig] Failed to parse configuration: ${this.filePath}`, { error: String(error) })
      throw configError
    }
  }

  /**
   * Get the file path being managed
   * @returns The resolved file path
   */
  getFilePath(): string {
    return this.filePath
  }

  /**
   * Get all configuration sections
   * @returns A record of all sections and their key-value pairs
   */
  getAllSections(): Record<string, Record<string, string>> {
    // Return a deep copy to prevent external modification
    const result: Record<string, Record<string, string>> = {}
    for (const [section, values] of Object.entries(this.config)) {
      result[section] = { ...values }
    }
    return result
  }
}

