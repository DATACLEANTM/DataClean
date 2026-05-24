'use client'

import { useState, useMemo } from 'react'
import {
  Database, AlertTriangle, TrendingUp, Copy, FileText, XCircle, Search,
} from 'lucide-react'
import { AppLayout } from '@/src/components/layout/app-layout'
import { KpiCard } from '@/src/components/cards/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Tabs, TabsList, TabsTab, TabsPanel } from '@/src/components/ui/tabs'
import { Input } from '@/src/components/ui/input'
import { validationIssues, errorDistribution } from '@/src/data/mock-data'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const categoryLabels: Record<string, string> = {
  exact_duplicate: 'Duplicado Exacto',
  fuzzy_duplicate: 'Duplicado Borroso',
  missing_field: 'Campo Faltante',
  invalid_email: 'Correo Inválido',
  invalid_phone: 'Teléfono Inválido',
  invalid_date: 'Fecha Inválida',
}

function formatCategory(category: string): string {
  return categoryLabels[category] ?? category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const severityVariant: Record<string, 'destructive' | 'warning' | 'secondary'> = {
  critical: 'destructive',
  major: 'warning',
  minor: 'secondary',
}

const severityLabel: Record<string, string> = {
  critical: 'Crítico',
  major: 'Mayor',
  minor: 'Menor',
}

const statusVariant: Record<string, 'destructive' | 'success' | 'secondary'> = {
  open: 'destructive',
  resolved: 'success',
  ignored: 'secondary',
}

const statusLabel: Record<string, string> = {
  open: 'abierto',
  resolved: 'resuelto',
  ignored: 'ignorado',
}

export default function ValidationPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const categories = useMemo(() => {
    const set = new Set(validationIssues.map(i => i.category))
    return Array.from(set)
  }, [])

  const filteredIssues = useMemo(() => {
    let issues = validationIssues
    if (activeTab !== 'all') {
      issues = issues.filter(i => i.category === activeTab)
    }
    if (search) {
      const q = search.toLowerCase()
      issues = issues.filter(i =>
        i.message.toLowerCase().includes(q) ||
        i.column.toLowerCase().includes(q) ||
        i.value.toLowerCase().includes(q)
      )
    }
    return issues
  }, [activeTab, search])

  const totalIssues = validationIssues.length
  const criticalCount = validationIssues.filter(i => i.severity === 'critical').length
  const majorCount = validationIssues.filter(i => i.severity === 'major').length
  const minorCount = validationIssues.filter(i => i.severity === 'minor').length
  const openCount = validationIssues.filter(i => i.status === 'open').length
  const resolvedCount = validationIssues.filter(i => i.status === 'resolved').length
  const ignoredCount = validationIssues.filter(i => i.status === 'ignored').length
  const duplicateCount = validationIssues.filter(
    i => i.category === 'exact_duplicate' || i.category === 'fuzzy_duplicate'
  ).length
  const missingFieldCount = validationIssues.filter(i => i.category === 'missing_field').length
  const invalidCount = validationIssues.filter(i =>
    ['invalid_email', 'invalid_phone', 'invalid_date'].includes(i.category)
  ).length

  const severityBreakdown = [
    { label: 'Crítico', count: criticalCount, color: '#EF4444' },
    { label: 'Mayor', count: majorCount, color: '#F59E0B' },
    { label: 'Menor', count: minorCount, color: '#3B82F6' },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Resultados de Validación</h1>
            <p className="text-sm text-muted-foreground">
              Desglose detallado de problemas de calidad encontrados
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <KpiCard
            title="Total Registros"
            value="15,234"
            icon={<Database className="size-5" />}
          />
          <KpiCard
            title="Total Errores"
            value={totalIssues}
            icon={<AlertTriangle className="size-5" />}
          />
          <KpiCard
            title="Calidad Promedio"
            value="94.2%"
            change="+1.2%"
            changeType="positive"
            icon={<TrendingUp className="size-5" />}
          />
          <KpiCard
            title="Duplicados"
            value={duplicateCount}
            icon={<Copy className="size-5" />}
          />
          <KpiCard
            title="Campos Faltantes"
            value={missingFieldCount}
            icon={<FileText className="size-5" />}
          />
          <KpiCard
            title="Datos Inválidos"
            value={invalidCount}
            icon={<XCircle className="size-5" />}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>Desglose por Categoría de Problemas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={errorDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {errorDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        formatter={(value, name) => [Number(value).toLocaleString(), name]}
                      />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => (
                          <span className="text-xs text-muted-foreground">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Resumen de Problemas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {severityBreakdown.map(s => (
                    <div
                      key={s.label}
                      className="rounded-lg p-4 text-center"
                      style={{ backgroundColor: `${s.color}0d` }}
                    >
                      <p className="text-2xl font-bold" style={{ color: s.color }}>
                        {s.count}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Abierto</span>
                    <span className="font-semibold">{openCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Resuelto</span>
                    <span className="font-semibold">{resolvedCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ignorado</span>
                    <span className="font-semibold">{ignoredCount}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Desglose por Severidad</p>
                  {severityBreakdown.map(s => (
                    <div key={s.label} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{s.label}</span>
                        <span className="font-semibold">{s.count}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${totalIssues > 0 ? (s.count / totalIssues) * 100 : 0}%`,
                            backgroundColor: s.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle>Problemas</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar problemas..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTab value="all">Todos</TabsTab>
                {categories.map(cat => (
                  <TabsTab key={cat} value={cat}>
                    {formatCategory(cat)}
                  </TabsTab>
                ))}
              </TabsList>
              <TabsPanel value={activeTab}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 pr-4 font-medium text-muted-foreground">Fila</th>
                        <th className="py-3 pr-4 font-medium text-muted-foreground">Columna</th>
                        <th className="py-3 pr-4 font-medium text-muted-foreground">Categoría</th>
                        <th className="py-3 pr-4 font-medium text-muted-foreground">Mensaje</th>
                        <th className="py-3 pr-4 font-medium text-muted-foreground">Severidad</th>
                        <th className="py-3 font-medium text-muted-foreground">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIssues.map(issue => (
                        <tr key={issue.id} className="border-b last:border-0">
                          <td className="py-3 pr-4">{issue.row}</td>
                          <td className="py-3 pr-4 font-medium">{issue.column}</td>
                          <td className="py-3 pr-4">{formatCategory(issue.category)}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{issue.message}</td>
                          <td className="py-3 pr-4">
                            <Badge variant={severityVariant[issue.severity]}>
                              {severityLabel[issue.severity]}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <Badge variant={statusVariant[issue.status]}>
                              {statusLabel[issue.status]}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredIssues.length === 0 && (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      No se encontraron problemas
                    </div>
                  )}
                </div>
              </TabsPanel>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
