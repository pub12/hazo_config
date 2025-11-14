/**
 * Purpose: Core interfaces and types for the HazoConfig component.
 *
 * This file defines the fundamental building blocks for creating a flexible and
 * extensible configuration management utility. It includes interfaces for the
 * ConfigProvider pattern, configuration options, and error types, ensuring
 * loose coupling and reusability across different projects.
 */

/**
 * Logger interface for dependency injection
 * Matches the Logger interface from hazo_connect for consistency
 */
export interface Logger {
  debug(message: string, data?: any): void
  info(message: string, data?: any): void
  warn(message: string, data?: any): void
  error(message: string, data?: any): void
}

/**
 * ConfigProvider interface
 * 
 * Defines the contract for configuration providers that can be used
 * by other components (like hazo_connect) to access configuration values.
 * This allows for dependency injection and makes components testable.
 */
export interface ConfigProvider {
  /**
   * Get a configuration value by section and key
   * @param section - The configuration section name
   * @param key - The configuration key name
   * @returns The configuration value, or undefined if not found
   */
  get(section: string, key: string): string | undefined

  /**
   * Get an entire configuration section
   * @param section - The configuration section name
   * @returns A record of key-value pairs for the section, or undefined if section doesn't exist
   */
  getSection(section: string): Record<string, string> | undefined

  /**
   * Set a configuration value
   * @param section - The configuration section name
   * @param key - The configuration key name
   * @param value - The value to set
   */
  set(section: string, key: string, value: string): void

  /**
   * Save the current configuration to disk
   * Writes all changes immediately to the configuration file
   */
  save(): void

  /**
   * Refresh the configuration from disk
   * Reloads the configuration file and updates the in-memory cache
   */
  refresh(): void
}

/**
 * Options for initializing HazoConfig
 */
export interface HazoConfigOptions {
  /**
   * Path to the configuration file (required)
   * Can be absolute or relative to process.cwd()
   */
  filePath: string

  /**
   * Optional logger instance for logging operations
   */
  logger?: Logger
}

/**
 * Error codes for configuration operations
 */
export enum ConfigErrorCode {
  FILE_NOT_FOUND = 'HAZO_CONFIG_FILE_NOT_FOUND',
  READ_ERROR = 'HAZO_CONFIG_READ_ERROR',
  WRITE_ERROR = 'HAZO_CONFIG_WRITE_ERROR',
  PARSE_ERROR = 'HAZO_CONFIG_PARSE_ERROR',
  VALIDATION_ERROR = 'HAZO_CONFIG_VALIDATION_ERROR'
}

/**
 * Standardized error response for configuration operations
 */
export interface HazoConfigError {
  code: string
  message: string
  filePath?: string
  originalError?: any
}

