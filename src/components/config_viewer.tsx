// Config viewer component for displaying configuration data
// Displays configuration sections and values in a readable format

import React, { useState, useEffect } from 'react'
import { cn } from '../lib/utils'
import type { ConfigProvider } from '../lib/types'
import { Pencil, CheckCircle2, XCircle } from 'lucide-react'

/**
 * Config viewer component props
 */
export interface ConfigViewerProps {
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
 * Config viewer component
 * Displays configuration sections and allows viewing/editing values
 * @param props - Component props
 * @returns React component
 */
export const ConfigViewer: React.FC<ConfigViewerProps> = ({
  config_provider,
  className,
  on_update,
}) => {
  const [sections, set_sections] = useState<Record<string, Record<string, string>>>({})
  const [editing, set_editing] = useState<{ section: string; key: string } | null>(null)
  const [edit_value, set_edit_value] = useState<string>('')

  /**
   * Load configuration from provider
   */
  const load_config = () => {
    const all_sections: Record<string, Record<string, string>> = {}
    
    // Try to get all sections - if provider has getAllSections, use it
    if ('getAllSections' in config_provider && typeof config_provider.getAllSections === 'function') {
      const all = (config_provider as any).getAllSections()
      Object.assign(all_sections, all)
    } else {
      // Fallback: try common section names
      const common_sections = ['database', 'logging', 'api', 'server', 'app']
      for (const section of common_sections) {
        const section_data = config_provider.getSection(section)
        if (section_data) {
          all_sections[section] = section_data
        }
      }
    }
    
    set_sections(all_sections)
  }

  useEffect(() => {
    load_config()
  }, [config_provider])

  /**
   * Start editing a config value
   */
  const start_edit = (section: string, key: string) => {
    const value = config_provider.get(section, key) || ''
    set_editing({ section, key })
    set_edit_value(value)
  }

  /**
   * Cancel editing
   */
  const cancel_edit = () => {
    set_editing(null)
    set_edit_value('')
  }

  /**
   * Save edited value
   */
  const save_edit = () => {
    if (editing) {
      config_provider.set(editing.section, editing.key, edit_value)
      config_provider.save()
      load_config()
      set_editing(null)
      set_edit_value('')
      if (on_update) {
        on_update()
      }
    }
  }

  return (
    <div className={cn('cls_config_viewer space-y-4', className)}>
      {Object.keys(sections).length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No configuration sections found
        </div>
      ) : (
        Object.entries(sections).map(([section_name, section_data]) => (
          <div key={section_name} className="cls_config_section border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">{section_name}</h3>
            <div className="space-y-2">
              {Object.entries(section_data).map(([key, value]) => {
                const is_editing = editing?.section === section_name && editing?.key === key
                
                return (
                  <div key={key} className="cls_config_item flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-muted-foreground">{key}</div>
                      {is_editing ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={edit_value}
                            onChange={(e) => set_edit_value(e.target.value)}
                            className="flex-1 px-2 py-1 border rounded text-sm"
                            autoFocus
                          />
                          <button
                            onClick={save_edit}
                            className="text-green-600 hover:text-green-700"
                            aria-label="Save"
                          >
                            <CheckCircle2 size={20} />
                          </button>
                          <button
                            onClick={cancel_edit}
                            className="text-red-600 hover:text-red-700"
                            aria-label="Cancel"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 px-2 py-1 bg-muted rounded text-sm">
                            {value || '(empty)'}
                          </div>
                          <button
                            onClick={() => start_edit(section_name, key)}
                            className="text-blue-600 hover:text-blue-700"
                            aria-label="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

