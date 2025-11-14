# HazoConfig

A lightweight, independent configuration management utility for INI files. Provides a unified interface for reading and writing configuration files with in-memory caching and sync operations.

## Features

- **Sync Operations**: All read/write operations are synchronous
- **In-Memory Caching**: Configuration is cached in memory for fast access
- **ConfigProvider Interface**: Standardized interface for dependency injection
- **File Validation**: Throws error if configuration file doesn't exist on initialization
- **Zero Dependencies**: Only uses Node.js built-ins and the `ini` package
- **Logger Support**: Optional logger injection for debugging

## Installation

This component is designed to be extracted as a standalone library. To use it in your project:

1. Copy the `hazo_config` directory to your project
2. Install the `ini` package: `npm install ini`
3. Import and use as shown below

## Usage

### Basic Usage

```typescript
import { HazoConfig } from './hazo_config'

// Initialize with file path
const config = new HazoConfig({
  filePath: 'config.ini'
})

// Read a value
const apiKey = config.get('gemini', 'api_key')

// Read an entire section
const geminiConfig = config.getSection('gemini')

// Set a value
config.set('gemini', 'api_key', 'new-api-key')

// Save changes to disk
config.save()

// Refresh from disk (reloads file)
config.refresh()
```

### With Logger

```typescript
import { HazoConfig } from './hazo_config'

const logger = {
  info: (msg, data) => console.log(msg, data),
  warn: (msg, data) => console.warn(msg, data),
  error: (msg, data) => console.error(msg, data)
}

const config = new HazoConfig({
  filePath: 'config.ini',
  logger
})
```

### Using ConfigProvider Interface

The `ConfigProvider` interface allows other components to consume configuration without knowing the implementation:

```typescript
import type { ConfigProvider } from './hazo_config'

function myFunction(configProvider: ConfigProvider) {
  const value = configProvider.get('section', 'key')
  // Use value...
}
```

## API Reference

### HazoConfig Class

#### Constructor

```typescript
constructor(options: HazoConfigOptions)
```

- `options.filePath` (required): Path to the INI configuration file
- `options.logger` (optional): Logger instance implementing the Logger interface

Throws error if file doesn't exist.

#### Methods

- `get(section: string, key: string): string | undefined` - Get a configuration value
- `getSection(section: string): Record<string, string> | undefined` - Get an entire section
- `set(section: string, key: string, value: string): void` - Set a configuration value
- `save(): void` - Save all changes to disk immediately
- `refresh(): void` - Reload configuration from disk
- `getFilePath(): string` - Get the resolved file path
- `getAllSections(): Record<string, Record<string, string>>` - Get all configuration sections

### ConfigProvider Interface

```typescript
interface ConfigProvider {
  get(section: string, key: string): string | undefined
  getSection(section: string): Record<string, string> | undefined
  set(section: string, key: string, value: string): void
  save(): void
  refresh(): void
}
```

## Error Handling

HazoConfig throws errors with the following error codes:

- `HAZO_CONFIG_FILE_NOT_FOUND`: Configuration file doesn't exist
- `HAZO_CONFIG_READ_ERROR`: Failed to read configuration file
- `HAZO_CONFIG_WRITE_ERROR`: Failed to write configuration file
- `HAZO_CONFIG_PARSE_ERROR`: Failed to parse INI content
- `HAZO_CONFIG_VALIDATION_ERROR`: Configuration validation failed

## Extraction Guide

To extract this component as a standalone library:

1. Copy the entire `hazo_config` directory
2. Create a `package.json` with:
   ```json
   {
     "name": "hazo-config",
     "version": "1.0.0",
     "main": "index.ts",
     "dependencies": {
       "ini": "^4.0.0"
     }
   }
   ```
3. The component has zero dependencies on the parent project
4. All types and interfaces are self-contained

## Integration with Other Components

This component is designed to work with other Hazo components like `hazo_connect`. The `ConfigProvider` interface allows components to accept configuration without tight coupling:

```typescript
import type { ConfigProvider } from 'hazo-config'
import { createHazoConnect } from 'hazo-connect'

const config = new HazoConfig({ filePath: 'config.ini' })
const adapter = createHazoConnect({
  configProvider: config,  // Pass ConfigProvider
  // ... other options
})
```

