'use client'

import { Clock, FileSpreadsheet, Upload, HardDrive, AlertCircle } from 'lucide-react'
import { AppLayout } from '@/src/components/layout/app-layout'
import { Dropzone } from '@/src/components/upload/dropzone'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
import { recentUploads } from '@/src/data/mock-data'
import type { UploadRecord } from '@/src/types'

const statusConfig: Record<
  UploadRecord['status'],
  { variant: 'success' | 'destructive' | 'warning' | 'secondary'; label: string }
> = {
  completed: { variant: 'success', label: 'Completado' },
  processing: { variant: 'warning', label: 'Procesando' },
  failed: { variant: 'destructive', label: 'Falló' },
  pending: { variant: 'secondary', label: 'Pendiente' },
}

export default function UploadPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Subir Archivo</h1>
            <p className="text-sm text-muted-foreground">
              Importa archivos CSV o Excel para limpiar y validar tus datos
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-7">
          <div className="space-y-6 lg:col-span-4">
            <Dropzone />
          </div>

          <div className="lg:col-span-3">
            <Card className="overflow-hidden border-0 shadow-md">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="size-4 text-primary" />
                  Subidas Recientes
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tus últimas {recentUploads.length} subidas
                </p>
              </div>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentUploads.map((upload) => {
                    const { variant, label } = statusConfig[upload.status]
                    return (
                      <div
                        key={upload.id}
                        className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                          <FileSpreadsheet className="size-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{upload.fileName}</p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <HardDrive className="size-3" />
                              {upload.fileSize}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <AlertCircle className="size-3" />
                              {upload.records.toLocaleString()} registros
                            </span>
                            <span>
                              {new Date(upload.uploadedAt).toLocaleDateString('es-ES', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        <Badge variant={variant} className="shrink-0">
                          {label}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
