'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  FileText,
  ShieldCheck,
  BarChart3,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { AppLayout } from '@/src/components/layout/app-layout'
import api from '@/lib/api'

interface Stage {
  id: string
  icon: React.ElementType
  name: string
  description: string
}

const stages: Stage[] = [
  {
    id: 'parsing',
    icon: FileText,
    name: 'Analizando registros...',
    description: 'Leyendo y analizando los datos del archivo',
  },
  {
    id: 'validations',
    icon: ShieldCheck,
    name: 'Ejecutando validaciones...',
    description: 'Verificando duplicados, formatos y reglas',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    name: 'Generando analíticas...',
    description: 'Calculando métricas de calidad y tendencias',
  },
  {
    id: 'report',
    icon: FileText,
    name: 'Construyendo reporte...',
    description: 'Compilando resumen ejecutivo',
  },
  {
    id: 'done',
    icon: CheckCircle,
    name: 'Reporte listo',
    description: 'Auditoría completada exitosamente',
  },
]

const stageMap: Record<number, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
}

function ProcessingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const fileId = searchParams.get('fileId')

  const [currentStage, setCurrentStage] = useState(-1)
  const [totalStages] = useState(stages.length)
  const [isComplete, setIsComplete] = useState(false)
  const [isFailed, setIsFailed] = useState(false)
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    if (!fileId) return

    const token = localStorage.getItem('token')

    const startValidation = async () => {
      try {
        const uploadRes = await api.get('/upload/history', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const files = Array.isArray(uploadRes.data)
          ? uploadRes.data
          : uploadRes.data?.data ?? []

        const file = files.find((r: any) => r.id === parseInt(fileId, 10))
        if (file) setFileName(file.originalName ?? file.filename ?? '')

        try {
          await api.post(
            `/validation/run/${fileId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )

        } catch (err: any) {
          const msg = err?.response?.data?.error ?? ''
          if (msg === 'No hay mapeos guardados para este archivo') {
            console.error('Validation started before mappings were available:', fileId)
            setIsFailed(true)
            toast.error('Validation could not start because mappings were not found')
          } else {
            console.error('Validation error:', err)
            toast.error('Error al iniciar la validación')
            setIsFailed(true)
          }
          return
        }

        const poll = setInterval(async () => {
          try {
            const statusRes = await api.get(`/validation/status/${fileId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })

            const progress = statusRes?.data?.data
            if (!progress) return

            const stageIndex = stageMap[progress.current] ?? -1
            setCurrentStage(stageIndex)

            if (progress.status === 'completed') {
              clearInterval(poll)
              setIsComplete(true)
              toast.success('Auditoría completada exitosamente')
              setTimeout(() => {
                router.push(`/validation?fileId=${fileId}`)
              }, 1500)
            }

            if (progress.status === 'failed') {
              clearInterval(poll)
              setIsFailed(true)
              toast.error('La auditoría falló')
            }
          } catch {
            clearInterval(poll)
            setIsFailed(true)
          }
        }, 2500)
      } catch (error) {
        console.error(error)
        toast.error('Error al iniciar la validación')
        setIsFailed(true)
      }
    }

    startValidation()
  }, [fileId, router])

  const progress =
    currentStage >= 0
      ? Math.round(((currentStage + 1) / totalStages) * 100)
      : 0

  if (!fileId) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">No hay archivo seleccionado.</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Auditoría en Proceso
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Procesando{' '}
            <span className="font-mono text-xs tracking-tight">
              {fileName || 'archivo'}
            </span>
          </p>
        </div>

        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <span>Pipeline de Procesamiento</span>
                <Badge
                  variant={
                    isComplete
                      ? 'success'
                      : isFailed
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {isComplete ? 'Completado' : isFailed ? 'Falló' : `${progress}%`}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStage >= 0 && (
              <Progress
                value={progress}
                className={cn(
                  isComplete && '[--primary:var(--color-green-500)]'
                )}
              />
            )}

            {currentStage < 0 && !isFailed && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Iniciando auditoría...
                </span>
              </div>
            )}

            {isFailed && (
              <div className="flex flex-col items-center gap-3 text-center">
                <AlertCircle className="size-10 text-red-500" />
                <h2 className="text-xl font-semibold">Error en la Auditoría</h2>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/mapping?fileId=${fileId}`)}
                  >
                    Volver al Mapeo
                  </Button>

                  <Button onClick={() => router.push('/dashboard')}>
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

export default function ProcessingPage() {
  return (
    <Suspense
      fallback={
        <AppLayout>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        </AppLayout>
      }
    >
      <ProcessingContent />
    </Suspense>
  )
}
