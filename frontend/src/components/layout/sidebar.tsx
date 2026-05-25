'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { logout } from '@/src/lib/auth'
import {
  LayoutDashboard,
  Upload,
  GitCompare,
  ShieldCheck,
  BarChart3,
  FileText,
  Settings,
  Sparkles,
  Loader2,
  LogOut,
  HelpCircle,
} from 'lucide-react'

const navItems: { label: string; href: string; icon: string; badge?: string }[] = [
  { label: 'Panel Principal', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Subir Archivo', href: '/upload', icon: 'Upload' },
  { label: 'Mapeo de Columnas', href: '/mapping', icon: 'GitCompare' },
  { label: 'Procesando Auditoría', href: '/processing', icon: 'Loader2' },
  { label: 'Resultados', href: '/validation', icon: 'ShieldCheck' },
  { label: 'Analíticas', href: '/analytics', icon: 'BarChart3' },
  { label: 'Reportes', href: '/reports', icon: 'FileText' },
  { label: 'Configuración', href: '/settings', icon: 'Settings' },
  { label: 'Ayuda', href: '/help', icon: 'HelpCircle' },
]

const primaryItems = ['LayoutDashboard', 'Upload', 'GitCompare', 'Loader2', 'ShieldCheck']
const secondaryItems = ['BarChart3', 'FileText', 'Settings', 'HelpCircle']

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="size-4" />,
  Upload: <Upload className="size-4" />,
  GitCompare: <GitCompare className="size-4" />,
  Loader2: <Loader2 className="size-4" />,
  ShieldCheck: <ShieldCheck className="size-4" />,
  BarChart3: <BarChart3 className="size-4" />,
  FileText: <FileText className="size-4" />,
  Settings: <Settings className="size-4" />,
  HelpCircle: <HelpCircle className="size-4" />,
}

function NavLink({ item, pathname }: { item: typeof navItems[number]; pathname: string }) {
  const isActive = pathname === item.href
  return (
    <Link
      key={item.href}
      href={item.href}
      className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
      style={{
        backgroundColor: isActive ? '#1A2744' : 'transparent',
        color: isActive ? '#FFFFFF' : '#8B97AB',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = '#1A2744'
          e.currentTarget.style.color = '#FFFFFF'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#8B97AB'
        }
      }}
    >
      {isActive && (
        <span
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full"
          style={{ backgroundColor: '#3B82F6' }}
        />
      )}
      <span style={{ color: isActive ? '#FFFFFF' : '#8B97AB' }}>
        {iconMap[item.icon]}
      </span>
      <span className={isActive ? 'text-white' : ''}>{item.label}</span>
      {item.badge && (
        <span
          className="ml-auto flex size-5 items-center justify-center rounded-full text-xs font-medium"
          style={{ backgroundColor: 'rgba(239,68,68,0.2)', color: '#EF4444' }}
        >
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  const primary = navItems.filter((i) => primaryItems.includes(i.icon))
  const secondary = navItems.filter((i) => secondaryItems.includes(i.icon))

  return (
    <aside
      className="flex h-screen w-60 flex-col"
      style={{ backgroundColor: '#0B1120', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#3B82F6' }}>
          <Sparkles className="size-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">DataClean</span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#5A6785' }}>
          Auditoría
        </p>
        {primary.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
        <div className="my-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
        <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#5A6785' }}>
          General
        </p>
        {secondary.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
      <div className="space-y-1 px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 mb-2"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ backgroundColor: '#22C55E' }} />
            <span className="relative inline-flex size-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
          </span>
          <span className="text-xs font-medium" style={{ color: '#8B97AB' }}>Sistema en Línea</span>
        </div>
        <button
          onClick={() => { logout(); window.location.href = '/login' }}
          className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-white"
          style={{ color: '#8B97AB' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1A2744'; e.currentTarget.style.color = '#FFFFFF' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8B97AB' }}
        >
          <LogOut className="size-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
