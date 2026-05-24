'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/src/lib/auth'
import {
  Sparkles,
  Upload,
  Scan,
  BarChart3,
  ArrowRight,
  Menu,
  X,
  Database,
  CheckCircle,
  TrendingUp,
  Activity,
  Clock,
  AlertTriangle,
  Eye,
  FileText,
  LineChart,
  ChevronRight,
  Shield,
} from 'lucide-react'

const navigation = [
  { name: 'Características', href: '#features' },
]

const features = [
  {
    name: 'Sube tus datos',
    description:
      'Soporta archivos CSV, Excel y más con carga segura y rápida.',
    icon: Upload,
  },
  {
    name: 'Auditoría automática',
    description:
      'Detecta errores, duplicados, valores inválidos e inconsistencias.',
    icon: Scan,
  },
  {
    name: 'Reportes y analíticas',
    description:
      'Visualiza resultados, analiza tendencias y exporta reportes ejecutivos.',
    icon: BarChart3,
  },
]

const stats = [
  { label: 'conjuntos procesados', value: '10K+' },
  { label: 'tiempo de actividad', value: '99.9%' },
  { label: 'registros analizados', value: '50M+' },
  { label: 'calificación', value: '4.9/5' },
]

const footerLinks = {
  product: [
    { name: 'Características', href: '#features' },
    { name: 'Precios', href: '#' },
    { name: 'Integraciones', href: '#' },
    { name: 'API', href: '#' },
  ],
  company: [
    { name: 'Nosotros', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Carreras', href: '#' },
    { name: 'Contacto', href: '#' },
  ],
  legal: [
    { name: 'Privacidad', href: '#' },
    { name: 'Términos', href: '#' },
    { name: 'Seguridad', href: '#' },
    { name: 'Cookies', href: '#' },
  ],
}

function handleSmoothScroll(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
  e.preventDefault()
  document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleUploadClick = () => {
    if (isAuthenticated()) {
      router.push('/upload')
    } else {
      router.push('/login?redirect=/upload&message=unauthorized')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out 2s infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
      `}</style>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20 transition-shadow group-hover:shadow-md group-hover:shadow-primary/30">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              DataClean
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.href.startsWith('#')) {
                    handleSmoothScroll(e, item.href.slice(1))
                  }
                }}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              Comenzar
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl px-4 pb-6 pt-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    setIsMenuOpen(false)
                    if (item.href.startsWith('#')) {
                      handleSmoothScroll(e, item.href.slice(1))
                    }
                  }}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.name}
                </a>
              ))}
              <hr className="my-2 border-border/40" />
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Comenzar
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-24 sm:pb-32 lg:pt-40 lg:pb-40">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          <div className="absolute top-1/4 right-1/4 -z-10 size-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/3 left-1/4 -z-10 size-[400px] rounded-full bg-secondary/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Column */}
              <div className="max-w-xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  <Shield className="size-3" />
                  Plataforma empresarial de calidad de datos
                </div>

                <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Auditoría de Datos
                  <br />
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Simple, Inteligente
                  </span>
                  <br />
                  y Confiable
                </h1>

                <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  DataClean te ayuda a detectar errores, duplicados e
                  inconsistencias en tus datos para que tomes decisiones con
                  información precisa y confiable.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
                  >
                    <Upload className="size-4" />
                    Subir Archivo
                  </button>
                  <a
                    href="#features"
                    onClick={(e) => handleSmoothScroll(e, 'features')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md"
                  >
                    <Eye className="size-4" />
                    Ver Demo
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  {[
                    { icon: Shield, text: 'Seguro y Privado' },
                    { icon: TrendingUp, text: 'Procesamiento Rápido' },
                    { icon: CheckCircle, text: 'Resultados Confiables' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-1.5">
                      <item.icon className="size-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Dashboard Preview */}
              <div className="relative">
                <div className="absolute -top-4 -right-4 z-10 hidden rounded-xl border border-border/60 bg-card px-4 py-2 shadow-lg backdrop-blur-sm lg:block animate-float">
                  <div className="flex items-center gap-2">
                    <div className="flex size-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-foreground">
                      Calidad general: 98.5%
                    </span>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/5">
                  {/* Window chrome */}
                  <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <div className="size-3 rounded-full bg-red-400" />
                      <div className="size-3 rounded-full bg-yellow-400" />
                      <div className="size-3 rounded-full bg-green-400" />
                    </div>
                    <span className="ml-2 text-xs font-medium text-muted-foreground">
                      DataClean Dashboard
                    </span>
                  </div>

                  <div className="flex">
                    {/* Dark sidebar */}
                    <div className="hidden w-14 flex-col items-center gap-3 border-r border-border/60 bg-foreground/[0.04] py-4 sm:flex">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                        <Sparkles className="size-4 text-primary" />
                      </div>
                      <div className="mt-2 flex size-8 items-center justify-center rounded-lg bg-primary/10">
                        <BarChart3 className="size-4 text-primary" />
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-lg hover:bg-muted">
                        <Database className="size-4 text-muted-foreground" />
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-lg hover:bg-muted">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-lg hover:bg-muted">
                        <Activity className="size-4 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Main dashboard content */}
                    <div className="flex-1 p-4 sm:p-5">
                      {/* Dashboard cards row */}
                      <div className="mb-4 grid grid-cols-3 gap-3">
                        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-primary/[0.08] p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                              Calidad
                            </span>
                            <CheckCircle className="size-3.5 text-green-500" />
                          </div>
                          <div className="mt-1.5 flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-foreground">
                              98.5
                            </span>
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                            <TrendingUp className="size-2.5" />
                            +2.3%
                          </div>
                        </div>

                        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-amber-500/5 to-amber-500/[0.08] p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                              Errores
                            </span>
                            <AlertTriangle className="size-3.5 text-amber-500" />
                          </div>
                          <div className="mt-1.5 flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-foreground">
                              12
                            </span>
                            <span className="text-xs text-muted-foreground">detectados</span>
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                            <CheckCircle className="size-2.5" />
                            8 resueltos
                          </div>
                        </div>

                        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-violet-500/5 to-violet-500/[0.08] p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                              Registros
                            </span>
                            <Database className="size-3.5 text-violet-500" />
                          </div>
                          <div className="mt-1.5 flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-foreground">
                              50.2M
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-primary">
                            <CheckCircle className="size-2.5" />
                            100% cobertura
                          </div>
                        </div>
                      </div>

                      {/* Bottom row: chart + recent audits */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        {/* Analytics chart */}
                        <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                              Tendencia de Calidad
                            </span>
                            <LineChart className="size-3.5 text-muted-foreground" />
                          </div>
                          <div className="flex items-end gap-1">
                            {[68, 72, 78, 74, 82, 88, 85, 90, 92, 94, 96, 98].map(
                              (h, i) => (
                                <div
                                  key={i}
                                  className="flex-1 rounded-t-sm transition-all"
                                  style={{
                                    height: `${h * 0.3}px`,
                                    background:
                                      i === 11
                                        ? 'linear-gradient(to top, var(--color-primary), var(--color-secondary))'
                                        : 'linear-gradient(to top, var(--color-primary)/0.2, var(--color-primary)/0.5)',
                                    opacity: i === 11 ? 1 : 0.4 + h / 200,
                                  }}
                                />
                              ),
                            )}
                          </div>
                          <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                            <span>Abr</span>
                            <span>May</span>
                          </div>
                        </div>

                        {/* Recent audits */}
                        <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                              Auditorías Recientes
                            </span>
                            <Clock className="size-3.5 text-muted-foreground" />
                          </div>
                          <div className="space-y-2.5">
                            {[
                              { name: 'ventas_q1_2026.csv', status: 'Completado', issues: 3 },
                              { name: 'clientes_nuevos.xlsx', status: 'Completado', issues: 0 },
                              { name: 'inventario_mayo.csv', status: 'En Proceso', issues: 8 },
                            ].map((audit) => (
                              <div
                                key={audit.name}
                                className="flex items-center justify-between rounded-lg border border-border/40 bg-background/60 px-3 py-2"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="flex size-6 items-center justify-center rounded-md bg-primary/10">
                                    <FileText className="size-3 text-primary" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="truncate text-xs font-medium text-foreground">
                                      {audit.name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                      {audit.issues} incidencia{audit.issues !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                </div>
                                <span
                                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                    audit.status === 'Completado'
                                      ? 'bg-green-500/10 text-green-600'
                                      : 'bg-amber-500/10 text-amber-600'
                                  }`}
                                >
                                  {audit.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 z-10 hidden rounded-xl border border-border/60 bg-card px-4 py-2 shadow-lg backdrop-blur-sm lg:block animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <div className="flex size-2 rounded-full bg-primary" />
                    <span className="text-xs font-medium text-foreground">
                      +12% precisión este trimestre
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border/40 bg-muted/30 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold text-primary">
                <Activity className="size-3" />
                Características
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Todo lo que necesitas para calidad de datos
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Herramientas diseñadas para ayudarte a detectar, limpiar y monitorear la calidad
                de los datos en toda tu organización.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="group relative rounded-2xl border border-border/60 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-0">
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {feature.name}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative overflow-hidden bg-primary py-16 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-primary-foreground/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-primary py-24 sm:py-32">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary to-secondary" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ¿Listo para transformar tu calidad de datos?
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Únete a miles de empresas que ya usan DataClean para impulsar sus
              pipelines de datos.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
              >
                Comienza gratis
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Hablar con ventas
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-sm">
                  <Sparkles className="size-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold tracking-tight text-background">
                  DataClean
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-background/60">
                Plataforma empresarial de calidad de datos que ayuda a las organizaciones
                a limpiar, validar y monitorear sus datos a escala.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-background">Producto</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          handleSmoothScroll(e, link.href.slice(1))
                        }
                      }}
                      className="text-sm text-background/60 transition-colors hover:text-background"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-background">Empresa</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-background/60 transition-colors hover:text-background"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-background">Legal</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-background/60 transition-colors hover:text-background"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-xs text-background/50">
              &copy; {new Date().getFullYear()} DataClean. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs text-background/50 transition-colors hover:text-background"
              >
                Privacidad
              </a>
              <a
                href="#"
                className="text-xs text-background/50 transition-colors hover:text-background"
              >
                Términos
              </a>
              <a
                href="#"
                className="text-xs text-background/50 transition-colors hover:text-background"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
