// Config editor component for managing configuration
// Provides a more advanced interface for editing configuration values

import React, { useState, useEffect } from 'react'
import { cn } from '../lib/utils'
import type { ConfigProvider } from '../lib/types'
import { RefreshCw, Save } from 'lucide-react'

/**
 * Config editor component props
 */
export interface ConfigEditorProps {
  /**
   * The config provider instance
   */
  config_provider: ConfigProvider
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Callback when config is updated
   */
  on_update?: () => void
}

/**
 * Config editor component
 * Provides interface for viewing and editing configuration with refresh and save capabilities
 * @param props - Component props
 * @returns React component
 */
export const ConfigEditor: React.FC<ConfigEditorProps> = ({
  config_provider,
  className,
  on_update,
}) => {
  const [sections, set_sections] = useState<Record<string, Record<string, string>>>({})
  const [selected_section, set_selected_section] = useState<string | null>(null)
  const [new_key, set_new_key] = useState<string>('')
  const [new_value, set_new_value] = useState<string>('')

  /**
   * Load configuration from provider
   */
  const load_config = () => {
    const all_sections: Record<string, Record<string, string>> = {}
    
    if ('getAllSections' in config_provider && typeof config_provider.getAllSections === 'function') {
      const all = (config_provider as any).getAllSections()
      Object.assign(all_sections, all)
    }
    
    set_sections(all_sections)
    if (!selected_section && Object.keys(all_sections).length > 0) {
      set_selected_section(Object.keys(all_sections)[0])
    }
  }

  useEffect(() => {
    load_config()
  }, [config_provider])

  /**
   * Handle refresh button click
   */
  const handle_refresh = () => {
    config_provider.refresh()
    load_config()
    if (on_update) {
      on_update()
    }
  }

  /**
   * Handle save button click
   */
  const handle_save = () => {
    config_provider.save()
    load_config()
    if (on_update) {
      on_update()
    }
  }

  /**
   * Add a new key-value pair to selected section
   */
  const handle_add_key = () => {
    if (selected_section && new_key && new_value) {
      config_provider.set(selected_section, new_key, new_value)
      set_new_key('')
      set_new_value('')
      load_config()
      if (on_update) {
        on_update()
      }
    }
  }

  /**
   * Update a config value
   */
  const handle_update_value = (section: string, key: string, value: string) => {
    config_provider.set(section, key, value)
    load_config()
  }

  const current_section_data = selected_section ? sections[selected_section] : null

  return (
    <div className={cn('cls_config_editor space-y-4', className)}>
      <div className="cls_config_editor_header flex items-center justify-between border-b pb-2">
        <h2 className="text-xl font-semibold">Configuration Editor</h2>
        <div className="flex gap-2">
          <button
            onClick={handle_refresh}
            className="px-3 py-1 border rounded hover:bg-muted flex items-center gap-2"
            aria-label="Refresh"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={handle_save}
            className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center gap-2"
            aria-label="Save"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="cls_config_editor_content grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="cls_config_sections_list border rounded p-4">
          <h3 className="font-semibold mb-2">Sections</h3>
          <div className="space-y-1">
            {Object.keys(sections).map((section_name) => (
              <button
                key={section_name}
                onClick={() => set_selected_section(section_name)}
                className={cn(
                  'w-full text-left px-2 py-1 rounded text-sm',
                  selected_section === section_name
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                {section_name}
              </button>
            ))}
          </div>
        </div>

        <div className="cls_config_section_content md:col-span-2 border rounded p-4">
          {selected_section ? (
            <>
              <h3 className="font-semibold mb-4">{selected_section}</h3>
              <div className="space-y-3">
                {current_section_data &&
                  Object.entries(current_section_data).map(([key, value]) => (
                    <div key={key} className="cls_config_item">
                      <label className="block text-sm font-medium mb-1">{key}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handle_update_value(selected_section, key, e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                    </div>
                  ))}
                
                <div className="cls_add_new_key border-t pt-3 mt-3">
                  <h4 className="text-sm font-medium mb-2">Add New Key</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Key name"
                      value={new_key}
                      onChange={(e) => set_new_key(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={new_value}
                      onChange={(e) => set_new_value(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <button
                      onClick={handle_add_key}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm"
                    >
                      Add Key
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Select a section to view/edit
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

