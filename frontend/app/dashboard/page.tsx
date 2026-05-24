'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Database, AlertTriangle, TrendingUp, Layers, ArrowRight, Upload, FileSpreadsheet, Clock, CheckCircle, XCircle, Zap } from 'lucide-react'
import { AppLayout } from '@/src/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { QualityChart } from '@/src/components/charts/quality-chart'
import { ErrorDistributionChart } from '@/src/components/charts/error-distribution-chart'
import { recentUploads } from '@/src/data/mock-data'
import type { UploadRecord } from '@/src/types'
import toast from 'react-hot-toast'

const statusLabels: Record<UploadRecord['status'], string> = {
  completed: 'completado',
  failed: 'falló',
  processing: 'procesando',
  pending: 'pendiente',
}

function relativeTime(dateString: string) {
  const now = Date.now()
  const date = new Date(dateString).getTime()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'ahora mismo'
  if (diffMins < 60) return `hace ${diffMins}m`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays < 7) return `hace ${diffDays}d`
  return new Date(dateString).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}

function statusBadge(status: UploadRecord['status']) {
  const config: Record<UploadRecord['status'], { variant: 'success' | 'destructive' | 'warning' | 'secondary'; icon: typeof CheckCircle }> = {
    completed: { variant: 'success', icon: CheckCircle },
    failed: { variant: 'destructive', icon: XCircle },
    processing: { variant: 'warning', icon: Clock },
    pending: { variant: 'secondary', icon: Clock },
  }
  const { variant, icon: Icon } = config[status]
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="size-3" />
      {statusLabels[status]}
    </Badge>
  )
}

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

const kpiCards = [
  { title: 'Total Registros', value: '156,320', icon: Database, trend: '+12.5%', trendColor: 'text-green-500' },
  { title: 'Errores Encontrados', value: '4,247', icon: AlertTriangle, trend: '+3.2%', trendColor: 'text-red-500' },
  { title: 'Calidad Promedio', value: '95.2%', icon: TrendingUp, trend: '+1.7%', trendColor: 'text-green-500' },
  { title: 'Conjuntos de Datos', value: '12', icon: Layers, trend: '+3 este mes', trendColor: 'text-green-500' },
]

export default function DashboardPage() {
  const [demoMode, setDemoMode] = useState(false)
  const latest = recentUploads[0]
  const recent = recentUploads.slice(0, 4)

  const startDemo = () => {
    setDemoMode(true)
    toast.success('Modo Demo activado — simulando auditoría de ejemplo', { duration: 3000 })
    const steps = [
      'Analizando duplicados',
      'Validando correos electrónicos',
      'Detectando campos vacíos',
      'Verificando consistencia',
      'Calculando score de calidad',
      'Generando reporte',
    ]
    steps.forEach((step, i) => {
      setTimeout(() => toast.loading(`${step}...`, { id: `demo-${i}` }), (i + 1) * 800)
      setTimeout(() => toast.success(`${step} completado`, { id: `demo-${i}` }), (i + 1) * 800 + 600)
    })
    setTimeout(() => {
      toast.success('✅ Auditoría de demostración completada', { duration: 5000 })
    }, steps.length * 800 + 800)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Demo mode banner */}
        {demoMode && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-5 py-3">
            <Zap className="size-5 text-amber-500" />
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Modo Demo activado — los datos mostrados son simulados para fines de demostración.
            </p>
          </div>
        )}

        {/* Title area */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Panel Principal</h1>
            <p className="text-sm text-muted-foreground">Bienvenido de nuevo, Gabriel</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={startDemo}
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-muted hover:shadow-md"
            >
              <Zap className="size-4" />
              Demo Rápida
            </button>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              <Upload className="size-4" />
              Iniciar Nueva Auditoría
            </Link>
          </div>
        </div>

        {/* Row 1 - KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/5">
                    <kpi.icon className="size-4 text-primary" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight">{kpi.value}</p>
                <p className={`mt-1 text-xs font-medium ${kpi.trendColor}`}>{kpi.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Row 2 - Quick Action CTA */}
        <Card className="border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <CardTitle className="text-lg text-white">¿Listo para una nueva auditoría?</CardTitle>
              <CardDescription className="text-blue-100">
                Sube tu archivo y deja que DataClean analice posibles problemas de calidad.
              </CardDescription>
            </div>
            <Link
              href="/upload"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md"
            >
              Iniciar Nueva Auditoría
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>

        {/* Row 3 - Charts */}
        <div className="grid gap-6 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <QualityChart />
          </div>
          <div className="lg:col-span-3">
            <ErrorDistributionChart />
          </div>
        </div>

        {/* Row 4 - Latest Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Último Archivo</CardTitle>
            <CardDescription>El archivo subido más reciente</CardDescription>
          </CardHeader>
          <CardContent>
            {latest && (
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                  <FileSpreadsheet className="size-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{latest.fileName}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{formatNumber(latest.records)} registros</span>
                    <span>{latest.fileSize}</span>
                    <span>{new Date(latest.uploadedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="shrink-0">{statusBadge(latest.status)}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Row 5 - Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Tus últimas subidas</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recent.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                    <FileSpreadsheet className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{upload.fileName}</p>
                    <p className="text-xs text-muted-foreground">{relativeTime(upload.uploadedAt)}</p>
                  </div>
                  {statusBadge(upload.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
