'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileSpreadsheet } from 'lucide-react'
import { Card, CardContent } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { AppLayout } from '@/src/components/layout/app-layout'
import { Dropzone } from '@/src/components/upload/dropzone'
import api from '@/lib/api'

interface UploadedFile {
  id: number
  name: string
  size: number
  uploadedAt: string
  status?: string
}

export default function UploadPage() {
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    api.get('/upload/history', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? []
        const files = data.map((r: any) => ({
          id: r.id,
          name: r.originalName ?? r.filename ?? `Archivo #${r.id}`,
          size: r.size ?? 0,
          uploadedAt: r.uploadedAt ?? new Date().toISOString(),
          status: 'completed',
        }))
        setUploadedFiles(files)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleUpload = (uploaded: UploadedFile) => {
    setUploadedFiles((prev) => [uploaded, ...prev])
    router.push(`/mapping?fileId=${uploaded.id}`)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subir Archivo</h1>
          <p className="text-sm text-muted-foreground">
            Importa archivos CSV o Excel para limpiar y validar tus datos
          </p>
        </div>

        <div className="max-w-2xl">
          <Dropzone onUpload={handleUpload} />
        </div>

        {loading ? (
          <div className="max-w-2xl">
            <p className="text-sm text-muted-foreground">Cargando archivos...</p>
          </div>
        ) : uploadedFiles.length > 0 ? (
          <div className="max-w-2xl space-y-3">
            <h2 className="text-lg font-semibold">Archivos subidos</h2>
            {uploadedFiles.map((f) => (
              <Card key={f.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileSpreadsheet className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {f.size > 0 && `${(f.size / 1024 / 1024).toFixed(2)} MB`}
                        {f.size > 0 && f.uploadedAt && ' · '}
                        {f.uploadedAt && new Date(f.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={f.status === 'completed' ? 'success' : 'secondary'}>
                    {f.status === 'completed' ? 'Completado' : f.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}
