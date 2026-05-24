'use client'

import { useState } from 'react'
import { ArrowRight, Check, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/components/ui/button'
import { sourceColumns, standardFields, columnMappings } from '@/src/data/mock-data'

export function ColumnMapper() {
  const [mappings, setMappings] = useState(columnMappings)

  const updateMapping = (target: string, source: string) => {
    setMappings((prev) =>
      prev.map((m) =>
        m.target === target ? { ...m, source, mapped: true, confidence: 'high' as const } : m
      )
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr,auto,1fr] gap-4">
        <div className="rounded-lg border bg-card p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Columnas Origen
          </p>
          <div className="space-y-1">
            {sourceColumns.map((col) => (
              <div
                key={col.name}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
              >
                <span className="font-mono text-xs">{col.name}</span>
                {col.detected && (
                  <Badge variant="secondary" className="text-[10px]">detectada</Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="size-5 text-muted-foreground" />
        </div>

        <div className="rounded-lg border bg-card p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Campos Estándar
          </p>
          <div className="space-y-1">
            {standardFields.map((field) => {
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
                    {mapping?.mapped && (
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
                        <Check className="size-3.5 text-green-500" />
                      </>
                    )}
                    {!mapping?.mapped && (
                      <X className="size-3.5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">Reiniciar</Button>
        <Button size="sm">
          <Check className="size-4" />
          Confirmar Mapeo
        </Button>
      </div>
    </div>
  )
}
