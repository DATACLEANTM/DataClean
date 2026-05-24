'use client'

import { useState } from 'react'
import { FileText, Download, FileSpreadsheet, File, Clock, CheckCircle, XCircle, BarChart3, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { SummaryCard } from '@/src/components/cards/summary-card'
import { AppLayout } from '@/src/components/layout/app-layout'
import { EmptyState } from '@/src/components/ui/empty-state'
import { ReportPreviewModal } from '@/src/components/ui/report-preview-modal'
import { reports } from '@/src/data/mock-data'
import type { ReportRecord } from '@/src/types'
import toast from 'react-hot-toast'

const typeLabel: Record<ReportRecord['type'], string> = {
  executive: 'Resumen Ejecutivo',
  detailed: 'Informe Detallado',
  summary: 'Resumen de Calidad',
}

const statusLabel: Record<ReportRecord['status'], string> = {
  completed: 'Completado',
  generating: 'Generando',
  failed: 'Fallido',
}

const formatIcon = (format: ReportRecord['format']) => {
  switch (format) {
    case 'pdf':
      return <FileText className="size-4" />
    case 'csv':
      return <FileSpreadsheet className="size-4" />
    case 'xlsx':
      return <File className="size-4" />
  }
}

const statusBadge = (status: ReportRecord['status']) => {
  const variants: Record<string, 'success' | 'warning' | 'destructive'> = {
    completed: 'success',
    generating: 'warning',
    failed: 'destructive',
  }
  return <Badge variant={variants[status]}>{statusLabel[status]}</Badge>
}

const typeBadge = (type: ReportRecord['type']) => {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    executive: 'default',
    detailed: 'secondary',
    summary: 'outline',
  }
  return <Badge variant={variants[type]}>{typeLabel[type]}</Badge>
}

export default function ReportsPage() {
  const [previewReport, setPreviewReport] = useState<ReportRecord | null>(null)

  const total = reports.length
  const completed = reports.filter((r) => r.status === 'completed').length
  const failed = reports.filter((r) => r.status === 'failed').length
  const latest = reports.length > 0
    ? new Date(Math.max(...reports.map((r) => new Date(r.createdAt).getTime()))).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '--'

  const handleDownload = (report: ReportRecord) => {
    if (report.status === 'generating') {
      toast.error('El reporte aún se está generando')
      return
    }
    if (report.status === 'failed') {
      toast.error('El reporte no pudo generarse')
      return
    }
    toast.success(`Descargando ${report.name}`)
  }

  const handleQuickExport = (format: string) => {
    toast.success(`Exportando reporte como ${format.toUpperCase()}...`)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
          <p className="text-sm text-muted-foreground">Genera y gestiona reportes ejecutivos de calidad</p>
        </div>

        {reports.length === 0 ? (
          <EmptyState
            title="No hay reportes disponibles"
            description="Los reportes generados aparecerán aquí después de completar una auditoría."
            action={
              <Button render={<a href="/upload" />}>
                Subir un archivo
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard title="Total Reportes" icon={<FileText className="size-5" />}>
                <p className="text-3xl font-bold">{total}</p>
              </SummaryCard>
              <SummaryCard title="Completados" icon={<CheckCircle className="size-5" />}>
                <p className="text-3xl font-bold text-green-600">{completed}</p>
              </SummaryCard>
              <SummaryCard title="Fallidos" icon={<XCircle className="size-5" />}>
                <p className="text-3xl font-bold text-red-600">{failed}</p>
              </SummaryCard>
              <SummaryCard title="Más Reciente" icon={<Clock className="size-5" />}>
                <p className="text-xl font-semibold">{latest}</p>
              </SummaryCard>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="size-5 text-muted-foreground" />
                  Historial de Reportes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 font-medium">Nombre</th>
                        <th className="pb-3 font-medium">Tipo</th>
                        <th className="pb-3 font-medium">Formato</th>
                        <th className="pb-3 font-medium">Fecha</th>
                        <th className="pb-3 font-medium">Estado</th>
                        <th className="pb-3 font-medium">Tamaño</th>
                        <th className="pb-3 font-medium" />
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report) => (
                        <tr key={report.id} className="border-b last:border-0">
                          <td className="py-3 font-medium">{report.name}</td>
                          <td className="py-3">{typeBadge(report.type)}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              {formatIcon(report.format)}
                              <span className="uppercase">{report.format}</span>
                            </div>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3">{statusBadge(report.status)}</td>
                          <td className="py-3 text-muted-foreground">{report.size}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              {report.status === 'completed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPreviewReport(report)}
                                >
                                  <Eye className="mr-1 size-3" />
                                  Vista Previa
                                </Button>
                              )}
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleDownload(report)}
                              >
                                <Download className="mr-1 size-3" />
                                Descargar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="size-5 text-muted-foreground" />
                  Exportación Rápida
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="default" onClick={() => handleQuickExport('pdf')}>
                  <FileText className="mr-2 size-4" />
                  Exportar como PDF
                </Button>
                <Button variant="outline" onClick={() => handleQuickExport('csv')}>
                  <FileSpreadsheet className="mr-2 size-4" />
                  Exportar como CSV
                </Button>
                <Button variant="outline" onClick={() => handleQuickExport('xlsx')}>
                  <File className="mr-2 size-4" />
                  Exportar como XLSX
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <ReportPreviewModal
        report={previewReport!}
        open={!!previewReport}
        onClose={() => setPreviewReport(null)}
      />
    </AppLayout>
  )
}
