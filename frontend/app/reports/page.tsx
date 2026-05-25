'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Download, FileSpreadsheet, File, Clock, CheckCircle, XCircle, BarChart3, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { SummaryCard } from '@/src/components/cards/summary-card'
import { AppLayout } from '@/src/components/layout/app-layout'
import { EmptyState } from '@/src/components/ui/empty-state'
import { ReportPreviewModal } from '@/src/components/ui/report-preview-modal'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const formatIcon = (format: string) => {
  switch (format) {
    case 'pdf':
      return <FileText className="size-4" />
    case 'csv':
      return <FileSpreadsheet className="size-4" />
    case 'xlsx':
      return <File className="size-4" />
    default:
      return <FileText className="size-4" />
  }
}

const statusBadge = (status: string) => {
  const variants: Record<string, 'success' | 'warning' | 'destructive'> = {
    completed: 'success',
    generating: 'warning',
    failed: 'destructive',
  }
  return <Badge variant={variants[status] ?? 'secondary'}>{status}</Badge>
}

export default function ReportsPage() {
  const router = useRouter()
  const [previewReport, setPreviewReport] = useState<any>(null)
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    api.get('/reports/history', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? []
        setReports(data.map((r: any, i: number) => ({
          id: r.id ?? `rpt_${i}`,
          name: r.filename ?? `Auditoría #${r.fileId}`,
          type: r.type ?? 'detailed',
          format: r.format ?? 'pdf',
          createdAt: r.analyzedAt ?? r.createdAt ?? new Date().toISOString(),
          status: r.status ?? 'completed',
          size: r.size ?? '--',
        })))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const total = reports.length
  const completed = reports.filter((r: any) => r.status === 'completed').length
  const failed = reports.filter((r: any) => r.status === 'failed').length
  const latest = reports.length > 0
    ? new Date(Math.max(...reports.map((r: any) => new Date(r.createdAt).getTime()))).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '--'

  const handleDownload = (report: any) => {
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

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Cargando reportes...</p>
        </div>
      </AppLayout>
    )
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
              <Button onClick={() => router.push('/upload')}>
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
                        <th className="pb-3 font-medium">Fecha</th>
                        <th className="pb-3 font-medium">Registros</th>
                        <th className="pb-3 font-medium">Errores</th>
                        <th className="pb-3 font-medium">Calidad</th>
                        <th className="pb-3 font-medium" />
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report: any) => (
                        <tr key={report.id} className="border-b last:border-0">
                          <td className="py-3 font-medium">{report.name}</td>
                          <td className="py-3 text-muted-foreground">
                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3">{report.totalRecords?.toLocaleString() ?? '--'}</td>
                          <td className="py-3">{report.totalErrors?.toLocaleString() ?? '--'}</td>
                          <td className="py-3">{statusBadge(report.qualityScore ? `${report.qualityScore}%` : '--')}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
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
