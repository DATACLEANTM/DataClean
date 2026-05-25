'use client'

import { Check, Sparkles, X, AlertTriangle } from 'lucide-react'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface SourceColumn {
  name: string
  detected?: boolean
}

export interface StandardField {
  name: string
  type: string
  required: boolean
  description: string
}

export interface ColumnMapping {
  source: string
  target: string
  confidence: 'high' | 'medium' | 'low'
  mapped: boolean
}

interface ColumnMapperProps {
  sourceColumns: SourceColumn[]
  standardFields: StandardField[]
  mappings: ColumnMapping[]
  onConfirm: (mappings: ColumnMapping[]) => void
  onReset: () => void
}

export function ColumnMapper({ sourceColumns, standardFields, mappings, onConfirm, onReset }: ColumnMapperProps) {

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Columnas Origen
          </p>
          <div className="space-y-1">
            {sourceColumns.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2 py-1.5">No hay columnas disponibles</p>
            ) : (
              sourceColumns.map((col) => (
                <div
                  key={col.name}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <span className="font-mono text-xs">{col.name}</span>
                  {col.detected && (
                    <Badge variant="secondary" className="text-[10px]">detectada</Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Campos Estándar
          </p>
          <div className="space-y-1">
            {standardFields.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2 py-1.5">No hay campos estándar</p>
            ) : (
              standardFields.map((field) => {
                const mapping = mappings.find((m) => m.target === field.name)
                return (
                  <div
                    key={field.name}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <span>{field.name}</span>
                      {field.required && (
                        <span className="text-[10px] text-destructive">*</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {mapping?.mapped ? (
                        <>
                          {mapping.confidence === 'high' && (
                            <Badge variant="success" className="text-[10px]">
                              <Sparkles className="mr-0.5 size-2.5" />
                              Auto
                            </Badge>
                          )}
                          {mapping.confidence === 'medium' && (
                            <Badge variant="warning" className="text-[10px]">Sugerido</Badge>
                          )}
                          {mapping.confidence === 'low' && (
                            <Badge variant="secondary" className="text-[10px]">
                              <AlertTriangle className="mr-0.5 size-2.5" />
                              Bajo
                            </Badge>
                          )}
                          <Check className="size-3.5 text-green-500" />
                        </>
                      ) : (
                        <X className="size-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onReset}>Reiniciar</Button>
        <Button size="sm" onClick={() => onConfirm(mappings)}>
          <Check className="size-4" />
          Confirmar Mapeo
        </Button>
      </div>
    </div>
  )
}
