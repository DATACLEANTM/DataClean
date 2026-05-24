'use client'

import { TrendingUp, Database, AlertTriangle, BarChart3, Activity } from 'lucide-react'
import { AppLayout } from '@/src/components/layout/app-layout'
import { KpiCard } from '@/src/components/cards/kpi-card'
import { QualityTrendsChart } from '@/src/components/charts/quality-trends-chart'
import { ErrorDistributionChart } from '@/src/components/charts/error-distribution-chart'
import { ScoreProgressionChart } from '@/src/components/charts/score-progression-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { qualityTrends, datasetComparisons } from '@/src/data/mock-data'
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
  const avgScore = qualityTrends.reduce((sum, q) => sum + q.score, 0) / qualityTrends.length
  const totalRecords = qualityTrends.reduce((sum, q) => sum + q.records, 0)
  const totalErrors = qualityTrends.reduce((sum, q) => sum + q.errors, 0)
  const firstScore = qualityTrends[0].score
  const lastScore = qualityTrends[qualityTrends.length - 1].score
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

        <div className="grid gap-6 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <QualityTrendsChart />
          </div>
          <div className="lg:col-span-3">
            <ErrorDistributionChart />
          </div>
        </div>

        <ScoreProgressionChart />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="size-5 text-muted-foreground" />
              Comparación de Conjuntos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {datasetComparisons.map((dataset) => (
                <Card
                  key={dataset.id}
                  className="border-border/50 transition-all hover:border-border hover:shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{dataset.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(dataset.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <Badge variant={scoreVariant(dataset.qualityScore)} className="shrink-0">
                          {dataset.qualityScore}%
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Registros</span>
                        <span className="font-medium tabular-nums">{dataset.records.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Errores</span>
                        <span className="font-medium tabular-nums">{dataset.errors.toLocaleString()}</span>
                      </div>
                      <div>
                        <div className="mb-1.5 flex justify-between text-xs">
                          <span className="text-muted-foreground">Calidad</span>
                          <span className="font-medium">{dataset.qualityScore}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn('h-full rounded-full transition-all', scoreColor(dataset.qualityScore))}
                            style={{ width: `${dataset.qualityScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
