'use client'

import { GitCompare, CheckCircle2, Sparkles, Target, Layers } from 'lucide-react'
import { AppLayout } from '@/src/components/layout/app-layout'
import { ColumnMapper } from '@/src/components/mapping/column-mapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
import { columnMappings, standardFields, sourceColumns } from '@/src/data/mock-data'

export default function MappingPage() {
  const mappedCount = columnMappings.filter((m) => m.mapped).length
  const totalFields = standardFields.length
  const highConfidence = columnMappings.filter((m) => m.confidence === 'high').length
  const autoDetected = sourceColumns.filter((c) => c.detected).length
  const unmappedCount = totalFields - mappedCount

  const stats = [
    {
      icon: Target,
      label: 'Campos Mapeados',
      value: `${mappedCount} / ${totalFields}`,
      sub: unmappedCount > 0 ? `${unmappedCount} restantes` : 'Todo completo',
      accent: unmappedCount === 0,
    },
    {
      icon: Sparkles,
      label: 'Alta Confianza',
      value: highConfidence,
      sub: `${((highConfidence / mappedCount) * 100).toFixed(0)}% de campos mapeados`,
      accent: true,
    },
    {
      icon: Layers,
      label: 'Auto Detectados',
      value: autoDetected,
      sub: `${sourceColumns.length} columnas origen escaneadas`,
      accent: true,
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mapeo de Columnas</h1>
          <p className="text-sm text-muted-foreground">
            Mapea tus columnas de origen a los campos estándar de DataClean. El
            sistema detecta automáticamente los tipos de columna y sugiere mapeos para que revises y confirmes.
          </p>
        </div>

        <ColumnMapper />

        <Separator />

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg ${
                      stat.accent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <stat.icon className="size-4" />
                  </div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
