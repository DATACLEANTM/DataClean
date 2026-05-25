'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Database, AlertTriangle, TrendingUp, Layers, ArrowRight, Upload, FileSpreadsheet, Clock, BarChart3 } from 'lucide-react'
import { AppLayout } from '@/src/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { QualityChart } from '@/src/components/charts/quality-chart'
import { ErrorDistributionChart } from '@/src/components/charts/error-distribution-chart'
import api from '@/lib/api'

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    Promise.all([
      api.get('/analytics/dashboard', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
      api.get('/reports/history', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
    ]).then(([dash, hist]) => {
      if (dash?.data?.data) setData(dash.data.data)
      if (hist?.data) setHistory(Array.isArray(hist.data) ? hist.data : [])
    }).finally(() => setLoading(false))
  }, [])

  const kpiCards = data
    ? [
        { title: 'Total Registros', value: formatNumber(data.totalRecords ?? 0), icon: Database, trend: '', trendColor: 'text-green-500' },
        { title: 'Errores Encontrados', value: formatNumber(data.totalErrors ?? 0), icon: AlertTriangle, trend: '', trendColor: 'text-red-500' },
        { title: 'Calidad Promedio', value: `${data.averageQuality ?? data.qualityScore ?? 0}%`, icon: TrendingUp, trend: '', trendColor: 'text-green-500' },
        { title: 'Auditorías Totales', value: `${data.totalFiles ?? data.totalAudits ?? 0}`, icon: Layers, trend: '', trendColor: 'text-green-500' },
      ]
    : [
        { title: 'Total Registros', value: '--', icon: Database, trend: '', trendColor: 'text-green-500' },
        { title: 'Errores Encontrados', value: '--', icon: AlertTriangle, trend: '', trendColor: 'text-red-500' },
        { title: 'Calidad Promedio', value: '--', icon: TrendingUp, trend: '', trendColor: 'text-green-500' },
        { title: 'Auditorías Totales', value: '--', icon: Layers, trend: '', trendColor: 'text-green-500' },
      ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Title area */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Panel Principal</h1>
            <p className="text-sm text-muted-foreground">Bienvenido de nuevo</p>
          </div>
          <div className="flex items-center gap-3">
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
                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {loading ? '...' : kpi.value}
                </p>
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
            <QualityChart data={data?.qualityTrends ?? []} />
          </div>
          <div className="lg:col-span-3">
            <ErrorDistributionChart data={data?.errorDistribution ?? []} />
          </div>
        </div>

        {/* Row 4 - Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Tus últimas auditorías</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {history.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                {loading ? 'Cargando...' : 'No hay actividad reciente'}
              </div>
            ) : (
              <div className="divide-y">
                {history.slice(0, 5).map((item: any, i: number) => (
                  <div
                    key={item.id ?? i}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                      <FileSpreadsheet className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.filename ?? `Auditoría #${item.fileId}`}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.analyzedAt ? new Date(item.analyzedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }) : ''}
                      </p>
                    </div>
                    <Badge variant={item.qualityScore && item.qualityScore > 90 ? 'success' : 'warning'}>
                      {item.qualityScore ?? '--'}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
