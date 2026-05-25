'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Database, AlertTriangle, BarChart3, Activity } from 'lucide-react'
import { AppLayout } from '@/src/components/layout/app-layout'
import { KpiCard } from '@/src/components/cards/kpi-card'
import { QualityTrendsChart } from '@/src/components/charts/quality-trends-chart'
import { ErrorDistributionChart } from '@/src/components/charts/error-distribution-chart'
import { ScoreProgressionChart } from '@/src/components/charts/score-progression-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

const scoreVariant = (score: number) => {
  if (score > 95) return 'success' as const
  if (score > 90) return 'warning' as const
  return 'destructive' as const
}

const scoreColor = (score: number) => {
  if (score > 95) return 'bg-green-500'
  if (score > 90) return 'bg-yellow-500'
  return 'bg-red-500'
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    api.get('/analytics/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data?.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const qualityTrends = data?.qualityTrends ?? []
  const avgScore = qualityTrends.length > 0
    ? qualityTrends.reduce((sum: number, q: any) => sum + q.score, 0) / qualityTrends.length
    : 0
  const totalRecords = qualityTrends.reduce((sum: number, q: any) => sum + q.records, 0)
  const totalErrors = qualityTrends.reduce((sum: number, q: any) => sum + q.errors, 0)
  const firstScore = qualityTrends.length > 0 ? qualityTrends[0].score : 0
  const lastScore = qualityTrends.length > 0 ? qualityTrends[qualityTrends.length - 1].score : 0
  const trendValue = (lastScore - firstScore).toFixed(1)

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analíticas</h1>
            <p className="text-sm text-muted-foreground">Análisis profundo de tus métricas de calidad</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Calidad Promedio"
            value={`${avgScore.toFixed(1)}%`}
            icon={<TrendingUp className="size-5" />}
            description="En todos los conjuntos"
          />
          <KpiCard
            title="Total Registros Procesados"
            value={totalRecords.toLocaleString()}
            icon={<Database className="size-5" />}
            description="De todas las verificaciones"
          />
          <KpiCard
            title="Total Errores Encontrados"
            value={totalErrors.toLocaleString()}
            icon={<AlertTriangle className="size-5" />}
            description="En todos los conjuntos"
          />
          <KpiCard
            title="Tendencia"
            value={`+${trendValue}%`}
            icon={<Activity className="size-5" />}
            change="Mejora del primero al último"
            changeType="positive"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Cargando analíticas...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-7">
              <div className="lg:col-span-4">
                <QualityTrendsChart data={qualityTrends} />
              </div>
              <div className="lg:col-span-3">
                <ErrorDistributionChart data={data?.errorDistribution ?? []} />
              </div>
            </div>

            <ScoreProgressionChart data={qualityTrends} />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="size-5 text-muted-foreground" />
                  Historial de Auditorías
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(data?.history ?? []).length > 0 ? (
                    data.history.map((item: any, i: number) => (
                      <Card
                        key={item.id ?? i}
                        className="border-border/50 transition-all hover:border-border hover:shadow-sm"
                      >
                        <CardContent className="p-5">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate font-semibold">{item.filename ?? `Auditoría #${item.fileId}`}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.analyzedAt
                                    ? new Date(item.analyzedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })
                                    : '--'}
                                </p>
                              </div>
                              <Badge variant={scoreVariant(item.qualityScore ?? 0)} className="shrink-0">
                                {item.qualityScore ?? '--'}%
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Registros</span>
                              <span className="font-medium tabular-nums">{(item.totalRecords ?? 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Errores</span>
                              <span className="font-medium tabular-nums">{(item.totalErrors ?? 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                      No hay datos de auditorías disponibles
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  )
}
