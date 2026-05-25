'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { GitCompare, Sparkles, Target, Layers, Loader2 } from 'lucide-react'
import { AppLayout } from '@/src/components/layout/app-layout'
import { ColumnMapper, SourceColumn, StandardField, ColumnMapping } from '@/src/components/mapping/column-mapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const standardFields: StandardField[] = [
  { name: 'Nombre Completo', type: 'string', required: true, description: 'Nombre completo de la persona' },
  { name: 'Email', type: 'email', required: true, description: 'Dirección de correo electrónico válida' },
  { name: 'Teléfono', type: 'phone', required: false, description: 'Número telefónico con código de país' },
  { name: 'Dirección', type: 'string', required: false, description: 'Dirección completa' },
]

function MappingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const fileId = searchParams.get('fileId')

  const [sourceColumns, setSourceColumns] = useState<SourceColumn[]>([])
  const [mappings, setMappings] = useState<ColumnMapping[]>([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!fileId) {
      setLoading(false)
      return
    }

    const token = localStorage.getItem('token')

    api.get('/upload/history', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? []
        const file = data.find((r: any) => r.id === parseInt(fileId, 10))

        if (!file || !file.columns || file.columns.length === 0) {
          setLoading(false)
          return
        }

        const cols: SourceColumn[] = file.columns.map((c: string) => ({ name: c, detected: true }))
        setSourceColumns(cols)

        return api.post('/mapping/columns', { columns: file.columns }, {
          headers: { Authorization: `Bearer ${token}` },
        })
      })
      .then((detectRes: any) => {
        const detected: { originalName: string; suggestedField: string; confidence: number }[] =
          detectRes?.data?.data ?? []

        const standardNames = standardFields.map((f) => f.name)

        const fieldMap: Record<string, string> = {
          nombre: 'Nombre Completo',
          email: 'Email',
          telefono: 'Teléfono',
          direccion: 'Dirección',
        }

        const initialMappings: ColumnMapping[] = standardFields.map((field) => {
          const match = detected.find(
            (d) => fieldMap[d.suggestedField.toLowerCase()] === field.name
          )

          if (match) {
            return {
              source: match.originalName,
              target: field.name,
              confidence: 'high',
              mapped: true,
            }
          }

          return {
            source: '',
            target: field.name,
            confidence: 'high',
            mapped: false,
          }
        })
        setMappings(initialMappings)
      })
      .catch(() => {
        const fallback: ColumnMapping[] = standardFields.map((f) => ({
          source: '', target: f.name, confidence: 'high', mapped: false,
        }))
        setMappings(fallback)
      })
      .finally(() => setLoading(false))
  }, [fileId])

  const handleConfirm = async (localMappings: ColumnMapping[]) => {
    console.log("LOCAL MAPPINGS FULL:", JSON.stringify(localMappings, null, 2))

    if (!fileId) {
      toast.error('No hay archivo seleccionado')
      return
    }

    setConfirming(true)
    const token = localStorage.getItem('token')

    try {
      const payload = {
        fileId: parseInt(fileId, 10),
        mappings: localMappings
          .filter((m) => m.source)
          .map((m) => ({
            originalColumnName: m.source,
            mappedField: m.target,
          })),
      }

      console.log("FINAL PAYLOAD:", JSON.stringify(payload, null, 2))

      if (!payload.mappings.length) {
        toast.error('No hay columnas mapeadas para guardar')
        return
      }

      const response = await api.post('/mapping/confirm', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("SAVE RESPONSE:", response.data)

      const verify = await api.get(`/mapping/${payload.fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("VERIFY SAVED:", verify.data)

      const savedMappings = verify?.data?.data ?? []

      if (!savedMappings.length) {
        toast.error('El backend no guardó los mappings')
        return
      }

      toast.success('Mapeo guardado exitosamente')

      router.push(`/processing?fileId=${payload.fileId}`)

    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Error al guardar el mapeo')
    }
  }

  const handleReset = () => {
    const reset: ColumnMapping[] = standardFields.map((f) => ({
      source: '', target: f.name, confidence: 'high', mapped: false,
    }))
    setMappings(reset)
    toast.success('Mapeo reiniciado')
  }

  const mappedCount = mappings.filter((m) => m.mapped).length
  const totalFields = standardFields.length
  const highConfidence = mappings.filter((m) => m.mapped && m.confidence === 'high').length

  const stats = [
    {
      icon: Target,
      label: 'Campos Mapeados',
      value: loading ? '...' : `${mappedCount} / ${totalFields}`,
      sub: mappedCount === totalFields ? 'Todo completo' : `${totalFields - mappedCount} pendientes`,
      accent: true,
    },
    {
      icon: Sparkles,
      label: 'Alta Confianza',
      value: loading ? '...' : `${highConfidence}`,
      sub: totalFields > 0 ? `${Math.round((highConfidence / totalFields) * 100)}% de campos mapeados` : '0% de campos mapeados',
      accent: true,
    },
    {
      icon: Layers,
      label: 'Auto Detectados',
      value: loading ? '...' : `${sourceColumns.length}`,
      sub: `${sourceColumns.length} columnas origen escaneadas`,
      accent: true,
    },
  ]

  if (!fileId) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">No hay archivo seleccionado. Sube un archivo primero.</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mapeo de Columnas</h1>
          <p className="text-sm text-muted-foreground">
            Mapea tus columnas de origen a los campos estándar de DataClean. El
            sistema detecta automáticamente los tipos de columna y sugiere mapeos para que revises y confirmes.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <ColumnMapper
              sourceColumns={sourceColumns}
              standardFields={standardFields}
              mappings={mappings}
              onConfirm={handleConfirm}
              onReset={handleReset}
            />

            <Separator />

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.label} className="overflow-hidden border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex size-8 items-center justify-center rounded-lg ${stat.accent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                          }`}
                      >
                        <stat.icon className="size-4" />
                      </div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default function MappingPage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    }>
      <MappingContent />
    </Suspense>
  )
}