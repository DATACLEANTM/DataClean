'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, FileSpreadsheet, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/components/ui/button'

interface DropzoneProps {
  onUpload?: (file: File) => void
}

export function Dropzone({ onUpload }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'completed' | 'error'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover')
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFile(droppedFile)
  }, [])

  const handleFile = (f: File) => {
    setFile(f)
    setStatus('uploading')
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStatus('completed')
          onUpload?.(f)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  const reset = () => {
    setFile(null)
    setProgress(0)
    setStatus('idle')
  }

  return (
    <div className="space-y-4">
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
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Upload className="size-6 text-primary" />
        </div>
        <p className="mb-1 text-sm font-medium">
          {isDragging ? 'Suelta tu archivo aquí' : 'Arrastra y suelta tu archivo aquí'}
        </p>
        <p className="text-xs text-muted-foreground">o haz clic para buscar archivos CSV, XLSX hasta 50MB</p>
      </div>

      {file && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <FileSpreadsheet className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
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
              {status === 'idle' && (
                <Badge variant="secondary">Listo</Badge>
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
                <span className="font-medium">{Math.min(Math.round(progress), 100)}%</span>
              </div>
              <Progress value={Math.min(progress, 100)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
