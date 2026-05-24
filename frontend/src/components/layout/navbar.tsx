'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Moon, Sun, Search } from 'lucide-react'
import { useTheme } from '@/src/hooks/use-theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { ProfileDropdown } from '@/src/components/layout/profile-dropdown'
import toast from 'react-hot-toast'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()

  const handleNotificationClick = () => {
    toast('No tienes notificaciones nuevas', { icon: '🔔' })
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar datasets, reportes..."
            className="h-9 bg-muted/50 pl-9 text-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationClick}>
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
        </Button>
        <div className="border-l pl-2">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}
