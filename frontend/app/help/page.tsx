'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, HelpCircle, Search, ChevronDown, Mail, MessageCircle, BookOpen, ArrowRight } from 'lucide-react'
import { AppLayout } from '@/src/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Badge } from '@/src/components/ui/badge'

const faqs = [
  {
    q: '¿Cómo subo un archivo para auditoría?',
    a: 'Ve a "Subir Archivo" en el menú lateral, arrastra tu archivo CSV o Excel o haz clic para seleccionarlo. DataClean procesará automáticamente los datos.',
  },
  {
    q: '¿Qué formatos de archivo soporta DataClean?',
    a: 'Soportamos archivos CSV, XLSX y XLS. El tamaño máximo recomendado es de 50MB por archivo.',
  },
  {
    q: '¿Cómo interpreto los resultados de validación?',
    a: 'Cada error detectado incluye la fila, columna, tipo de error, severidad y una recomendación. Los filtros por categoría y estado te ayudan a priorizar.',
  },
  {
    q: '¿Puedo exportar los reportes?',
    a: 'Sí. Desde la sección "Reportes" puedes descargar informes en PDF, CSV y XLSX con un solo clic.',
  },
  {
    q: '¿Cómo funciona el mapeo de columnas?',
    a: 'DataClean detecta automáticamente las columnas de tu archivo y las sugiere mapear a campos estándar. Puedes ajustar manualmente cada mapeo.',
  },
  {
    q: '¿Qué significa cada nivel de severidad?',
    a: 'Crítico: requiere atención inmediata. Mayor: debe revisarse pronto. Menor: sugerencia de mejora.',
  },
]

const guides = [
  { title: 'Guía Rápida de Inicio', desc: 'Aprende los conceptos básicos en 5 minutos', icon: BookOpen },
  { title: 'Tutorial de Auditoría', desc: 'Paso a paso para auditar tu primer archivo', icon: BookOpen },
  { title: 'Interpretación de Resultados', desc: 'Cómo leer y actuar sobre los errores detectados', icon: BookOpen },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Centro de Ayuda</h1>
          <p className="text-sm text-muted-foreground">Encuentra respuestas y guías para usar DataClean</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar preguntas, guías, temas..."
            className="h-12 rounded-xl pl-11 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="size-5 text-primary" />
              Preguntas Frecuentes
            </CardTitle>
            <CardDescription>Respuestas a las dudas más comunes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {filteredFaqs.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No encontramos resultados para &ldquo;{searchQuery}&rdquo;
              </p>
            ) : (
              filteredFaqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-transparent transition-colors hover:border-border hover:bg-muted/30">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left"
                  >
                    <span className="text-sm font-medium text-foreground">{faq.q}</span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Guides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              Guías y Tutoriales
            </CardTitle>
            <CardDescription>Aprende a sacar el máximo provecho de DataClean</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {guides.map((guide) => (
                <div
                  key={guide.title}
                  className="group rounded-xl border p-5 transition-all hover:border-primary/20 hover:shadow-sm"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <guide.icon className="size-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{guide.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{guide.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                    Leer guía <ArrowRight className="size-3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="size-5 text-primary" />
              ¿Necesitas más ayuda?
            </CardTitle>
            <CardDescription>Nuestro equipo está listo para asistirte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50">
                <Mail className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Correo Electrónico</p>
                  <p className="text-xs text-muted-foreground">soporte@dataclean.io</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50">
                <MessageCircle className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Chat en Vivo</p>
                  <p className="text-xs text-muted-foreground">Disponible 9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
