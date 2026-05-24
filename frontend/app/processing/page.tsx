'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  Upload,
  FileText,
  GitCompare,
  ShieldCheck,
  BarChart3,
  CheckCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { AppLayout } from '@/src/components/layout/app-layout'

interface Stage {
  id: string
  icon: React.ElementType
  name: string
  description: string
}

const stages: Stage[] = [
  { id: 'uploading', icon: Upload, name: 'Subiendo archivo...', description: 'Transfiriendo archivo al almacenamiento seguro' },
  { id: 'parsing', icon: FileText, name: 'Analizando registros...', description: 'Leyendo y analizando 15,234 registros' },
  { id: 'schema', icon: GitCompare, name: 'Detectando estructura...', description: 'Analizando tipos de columna y estructura' },
  { id: 'validations', icon: ShieldCheck, name: 'Ejecutando validaciones...', description: 'Verificando duplicados, formatos y reglas' },
  { id: 'analytics', icon: BarChart3, name: 'Generando analíticas...', description: 'Calculando métricas de calidad y tendencias' },
  { id: 'report', icon: FileText, name: 'Construyendo reporte...', description: 'Compilando resumen ejecutivo' },
]

const totalStages = stages.length

const summaryStats = {
  records: 15234,
  issues: 127,
  quality: 94.2,
}

export default function ProcessingPage() {
  const [currentStage, setCurrentStage] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    if (isComplete) return

    const interval = setInterval(() => {
      if (!mounted.current) return
      setCurrentStage((prev) => {
        if (prev >= totalStages - 1) {
          setIsComplete(true)
          toast.success('Auditoría completada exitosamente', { duration: 4000 })
          return prev
        }
        return prev + 1
      })
    }, 2000)

    return () => {
      mounted.current = false
      clearInterval(interval)
    }
  }, [isComplete])

  const progress = Math.round(((currentStage + 1) / totalStages) * 100)

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auditoría en Proceso</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Procesando{' '}
            <span className="font-mono text-xs tracking-tight">leads_march_2026.csv</span>
          </p>
        </div>

        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <span>Pipeline de Procesamiento</span>
                <Badge variant={isComplete ? 'success' : 'secondary'}>
                  {isComplete ? 'Completado' : `${progress}%`}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress
              value={progress}
              className={cn(isComplete && '[--primary:var(--color-green-500)]')}
            />

            <div className="space-y-0">
              {stages.map((stage, index) => {
                const Icon = stage.icon
                const isCompleted = index < currentStage
                const isActive = index === currentStage
                const isPending = index > currentStage

                return (
                  <div key={stage.id} className="relative flex gap-4 pb-8 last:pb-0">
                    {index < totalStages - 1 && (
                      <div
                        className={cn(
                          'absolute left-[19px] top-10 w-0.5',
                          isCompleted ? 'bg-green-400' : 'bg-muted-foreground/20',
                        )}
                        style={{ height: 'calc(100% - 1.5rem)' }}
                      />
                    )}

                    <div
                      className={cn(
                        'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500',
                        isCompleted && 'border-green-500 bg-green-50 dark:bg-green-900/20',
                        isActive &&
                          'border-blue-500 bg-blue-50 shadow-[0_0_0_4px_rgba(59,130,246,0.15)] dark:bg-blue-950/20',
                        isPending && 'border-muted-foreground/30 bg-muted',
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Icon
                          className={cn(
                            'size-5',
                            isActive && 'text-blue-600 dark:text-blue-400',
                            isPending && 'text-muted-foreground',
                          )}
                        />
                      )}
                      {isActive && (
                        <span className="absolute inset-0 animate-ping rounded-full border-2 border-blue-400 opacity-25" />
                      )}
                    </div>

                    <div className="flex flex-col justify-center pt-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isPending && 'text-muted-foreground',
                            isActive && 'text-blue-600 dark:text-blue-400',
                          )}
                        >
                          {stage.name}
                        </span>
                        {isActive && !isComplete && (
                          <Loader2 className="size-3.5 animate-spin text-blue-500" />
                        )}
                        {isCompleted && (
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Listo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{stage.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {isComplete && (
              <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 pt-2 duration-500">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="size-10 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">¡Auditoría Completa!</h2>
                    <p className="text-sm text-muted-foreground">
                      Todas las etapas de procesamiento han finalizado exitosamente
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Registros Procesados', value: summaryStats.records.toLocaleString() },
                    { label: 'Problemas Encontrados', value: summaryStats.issues },
                    { label: 'Puntuación de Calidad', value: `${summaryStats.quality}%` },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-lg font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button render={<Link href="/validation" />}>
                    Ver Resultados
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                  <Button variant="outline" render={<Link href="/dashboard" />}>
                    Volver al Panel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
