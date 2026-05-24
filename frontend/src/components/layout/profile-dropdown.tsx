'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar'
import { currentUser } from '@/src/data/mock-data'
import { logout } from '@/src/lib/auth'

export function ProfileDropdown() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const menuItems = [
    { label: 'Mi Perfil', icon: User, href: '/settings' },
    { label: 'Configuración', icon: Settings, href: '/settings' },
    { label: 'Ayuda', icon: HelpCircle, href: '/help' },
  ]

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-muted"
      >
        <div className="text-right">
          <p className="text-sm font-medium leading-none">{currentUser.name}</p>
        </div>
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 overflow-hidden rounded-xl border bg-card py-1 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="border-b px-4 py-2.5">
            <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
          </div>
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="border-t pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
