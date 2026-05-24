'use client'

import { useState } from 'react'
import { User, Bell, Palette, Shield, Save, Moon, Sun } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Switch } from '@/src/components/ui/switch'
import { Separator } from '@/src/components/ui/separator'
import { AppLayout } from '@/src/components/layout/app-layout'
import { currentUser } from '@/src/data/mock-data'
import { useTheme } from '@/src/hooks/use-theme'

export default function SettingsPage() {
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [company, setCompany] = useState('DataClean Inc.')
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    uploadComplete: true,
    validationComplete: true,
    errorThreshold: false,
    weeklyReport: true,
    monthlyReport: false,
  })
  const [twoFactor, setTwoFactor] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
          <p className="text-sm text-muted-foreground">Gestiona tu cuenta y preferencias</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-muted-foreground" />
              Perfil
            </CardTitle>
            <CardDescription>Actualiza tu información personal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>
            <Button onClick={() => alert('Cambios guardados exitosamente')}>
              <Save className="mr-2 size-4" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5 text-muted-foreground" />
              Notificaciones
            </CardTitle>
            <CardDescription>Configura cómo recibes alertas y reportes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {([
              ['emailNotifications', 'Notificaciones por Email'],
              ['uploadComplete', 'Subida Completada'],
              ['validationComplete', 'Validación Completada'],
              ['errorThreshold', 'Umbral de Error Excedido'],
              ['weeklyReport', 'Reporte Semanal'],
              ['monthlyReport', 'Reporte Mensual'],
            ] as const).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="cursor-pointer">{label}</Label>
                <Switch
                  id={key}
                  checked={notifications[key as keyof typeof notifications]}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="size-5 text-muted-foreground" />
              Apariencia
            </CardTitle>
            <CardDescription>Personaliza el tema de la interfaz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="size-5 text-blue-500" />
                ) : (
                  <Sun className="size-5 text-amber-500" />
                )}
                <div>
                  <Label htmlFor="theme" className="font-medium">Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    Actual: {theme === 'dark' ? 'Oscuro' : 'Claro'}
                  </p>
                </div>
              </div>
              <Switch id="theme" checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5 text-muted-foreground" />
              Seguridad
            </CardTitle>
            <CardDescription>Gestiona las preferencias de seguridad de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="2fa" className="font-medium">Autenticación de dos factores</Label>
                <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad a tu cuenta</p>
              </div>
              <Switch id="2fa" checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>

            <Separator />

            <div className="space-y-1">
              <Label className="font-medium">Último cambio de contraseña</Label>
              <p className="text-sm text-muted-foreground">March 1, 2026</p>
            </div>

            <Button variant="outline" onClick={() => alert('Flujo de cambio de contraseña')}>
              <Shield className="mr-2 size-4" />
              Cambiar Contraseña
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
