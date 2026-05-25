'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import api from '@/lib/api'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/components/ui/button'

interface UploadedFile {
  id: number
  name: string
  size: number
  uploadedAt: string
  status?: string
}

interface DropzoneProps {
  onUpload?: (file: UploadedFile) => void
}

export function Dropzone({ onUpload }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'completed' | 'error'>('idle')
  const [currentFileName, setCurrentFileName] = useState('')
  const [currentFileSize, setCurrentFileSize] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover')
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
  }, [])

  const handleFile = async (f: File) => {
    setCurrentFileName(f.name)
    setCurrentFileSize(f.size)
    setStatus('uploading')
    setProgress(0)

    const token = localStorage.getItem('token')
    if (!token) {
      setStatus('error')
      return
    }

    const formData = new FormData()
    formData.append('file', f)

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total)
            setProgress(percent)
          }
        },
      })

      setProgress(100)
      setStatus('completed')

      const data = response?.data?.data
      const fileId = data?.fileId
      if (!fileId) {
        setStatus('error')
        return
      }
      onUpload?.({
        id: fileId,
        name: f.name,
        size: f.size,
        uploadedAt: new Date().toISOString(),
        status: 'completed',
      })

      setTimeout(() => {
        reset()
      }, 2000)
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setProgress(0)
    setCurrentFileName('')
    setCurrentFileSize(0)
  }

  const isActive = status !== 'idle'

  return (
    <div className="space-y-4">
      {isActive ? (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                {status === 'completed' ? (
                  <CheckCircle className="size-5 text-green-600" />
                ) : status === 'error' ? (
                  <AlertCircle className="size-5 text-destructive" />
                ) : (
                  <FileSpreadsheet className="size-5 text-primary" />
                )}
              </div>

              <div>
                <p className="text-sm font-medium">{currentFileName}</p>
                <p className="text-xs text-muted-foreground">
                  {(currentFileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {status === 'completed' && (
                <Badge variant="success">Completado</Badge>
              )}

              {status === 'error' && (
                <Badge variant="destructive">Falló</Badge>
              )}

              {status === 'uploading' && (
                <Badge variant="secondary">Subiendo</Badge>
              )}

              <Button variant="ghost" size="icon" onClick={reset}>
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {status === 'uploading' && (
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Subiendo...</span>
                <span className="font-medium">
                  {Math.min(Math.round(progress), 100)}%
                </span>
              </div>

              <Progress value={Math.min(progress, 100)} />
            </div>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0])
              }
            }}
          />

          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Upload className="size-6 text-primary" />
          </div>

          <p className="mb-1 text-sm font-medium">
            {isDragging ? 'Suelta tu archivo aquí' : 'Arrastra y suelta tu archivo aquí'}
          </p>

          <p className="text-xs text-muted-foreground">
            o haz clic para buscar archivos CSV, XLSX hasta 50MB
          </p>
        </div>
      )}

      {status === 'error' && (
        <p className="text-xs text-destructive text-center">
          Error al subir el archivo.{' '}
          <button
            type="button"
            className="underline hover:no-underline"
            onClick={() => {
              reset()
            }}
          >
            Intentar de nuevo
          </button>
        </p>
      )}
    </div>
  )
}
