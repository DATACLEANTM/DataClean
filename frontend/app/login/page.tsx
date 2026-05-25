'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sparkles, Eye, EyeOff, Mail, Lock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card'
import api from '@/lib/api'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const showMessage = searchParams.get('message') === 'unauthorized'

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs: typeof errors = {}
    if (!email) errs.email = 'El correo es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Ingresa un correo válido'
    if (!password) errs.password = 'La contraseña es requerida'

    else if (password.length < 8) errs.password = 'La contraseña debe tener al menos 8 caracteres'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      setLoading(true)

      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const { token, user } = response.data.data

      localStorage.setItem('token', token)
      if (user) localStorage.setItem('user', JSON.stringify(user))

      window.location.href = redirect
    } catch (error: any) {
      setErrors({
        email: 'Correo o contraseña incorrectos',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-4">
      <div className="bg-grid-white absolute inset-0 opacity-[0.04]" />
      <div className="pointer-events-none absolute -inset-[10%]">
        <div className="absolute left-1/3 top-1/4 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute right-1/3 top-2/3 size-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[120px]" />
      </div>
      <Card className="relative w-full max-w-md border-white/[0.08] bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-2xl">
        {showMessage && (
          <div className="mx-6 mt-6 flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
            <p className="text-sm text-amber-200">
              Debes iniciar sesión o crear una cuenta para acceder a la auditoría de datos.
            </p>
          </div>
        )}
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
              <Sparkles className="size-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-white">Bienvenido de nuevo</CardTitle>
          <CardDescription className="text-white/60">Inicia sesión en tu cuenta de DataClean</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/80">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@empresa.com"
                  className="border-white/[0.08] bg-white/5 pl-9 text-white placeholder:text-white/30 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })) }}
                />
              </div>
              {errors.email && <p className="text-xs font-medium text-red-400">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white/80">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  className="border-white/[0.08] bg-white/5 pl-9 pr-9 text-white placeholder:text-white/30 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: undefined })) }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/80"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-medium text-red-400">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-white/60 transition-colors hover:text-white/80">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-4 rounded border-white/20 bg-white/5 text-blue-500 accent-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0"
                />
                Recordarme
              </label>
              <Link
                href="#"
                className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-400 hover:to-purple-500 hover:shadow-blue-400/30"
              size="lg"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
            <p className="text-center text-xs text-white/40">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="font-medium text-blue-400 transition-colors hover:text-blue-300">
                Registrarse
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
