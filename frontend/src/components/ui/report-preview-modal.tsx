'use client'

import { X, FileText, Download, Calendar, CheckCircle, BarChart3, AlertTriangle } from 'lucide-react'
import { Badge } from '@/src/components/ui/badge'
import type { ReportRecord } from '@/src/types'

interface ReportPreviewModalProps {
  report: ReportRecord
  open: boolean
  onClose: () => void
}

export function ReportPreviewModal({ report, open, onClose }: ReportPreviewModalProps) {
  if (!open) return null

  const typeLabel: Record<string, string> = {
    executive: 'Resumen Ejecutivo',
    detailed: 'Informe Detallado',
    summary: 'Resumen',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-2xl border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold">{report.name}</h2>
              <p className="text-xs text-muted-foreground">
                {typeLabel[report.type]} &middot; {report.format.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="space-y-6 p-6">
          {/* Meta */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4" />
              {new Date(report.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge variant={report.status === 'completed' ? 'success' : report.status === 'failed' ? 'destructive' : 'warning'}>
                {report.status === 'completed' ? 'Completado' : report.status === 'failed' ? 'Falló' : 'Generando'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Download className="size-4" />
              {report.size}
            </div>
          </div>

          {/* Mock report preview */}
          <div className="rounded-xl border bg-muted/30 p-6 space-y-5">
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold text-foreground">DataClean</h3>
              <p className="text-xs text-muted-foreground">Reporte de Calidad de Datos</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Calidad Promedio', value: '94.2%', icon: CheckCircle, color: 'text-green-500' },
                { label: 'Registros', value: '15,234', icon: BarChart3, color: 'text-primary' },
                { label: 'Errores', value: '127', icon: AlertTriangle, color: 'text-red-500' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border bg-background/60 p-3 text-center">
                  <stat.icon className={`mx-auto mb-1 size-4 ${stat.color}`} />
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Errores por Categoría</span>
              </div>
              {[
                { name: 'Campos faltantes', pct: 35 },
                { name: 'Duplicados', pct: 25 },
                { name: 'Email inválido', pct: 20 },
                { name: 'Teléfono inválido', pct: 12 },
                { name: 'Otros', pct: 8 },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground">{cat.name}</span>
                    <span className="text-muted-foreground">{cat.pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Cerrar
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="size-4" />
              Descargar {report.format.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
