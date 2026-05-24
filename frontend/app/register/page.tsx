'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card'
import { login } from '@/src/lib/auth'

const PASSWORD_RULES = [
  { label: 'Al menos 8 caracteres', test: (v: string) => v.length >= 8 },
  { label: 'Una mayúscula', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Una minúscula', test: (v: string) => /[a-z]/.test(v) },
  { label: 'Un número o símbolo', test: (v: string) => /[0-9!@#$%^&*()_\-+={}[\]|;:'",.<>?/~`]/.test(v) },
]

function RegisterForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'El nombre es requerido'
    if (!form.email) errs.email = 'El correo es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Ingresa un correo válido'
    if (!form.password) errs.password = 'La contraseña es requerida'
    else if (form.password.length < 8) errs.password = 'La contraseña debe tener al menos 8 caracteres'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden'
    else if (!form.confirmPassword) errs.confirmPassword = 'Por favor confirma tu contraseña'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true, confirmPassword: true })
    if (validate()) {
      login()
      window.location.href = redirect
    }
  }

  const updateField = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }))
    if (touched[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      if (field === 'password' || field === 'confirmPassword') {
        if (field === 'password' && form.confirmPassword && value !== form.confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden'
        } else if (field === 'confirmPassword') {
          if (!value) newErrors.confirmPassword = 'Por favor confirma tu contraseña'
          else if (value !== form.password) newErrors.confirmPassword = 'Las contraseñas no coinciden'
          else delete newErrors.confirmPassword
        }
        if (field === 'password') delete newErrors.confirmPassword
      }
      setErrors(newErrors)
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
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
              <Sparkles className="size-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-white">Crear cuenta</CardTitle>
          <CardDescription className="text-white/60">Comienza con DataClean</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-white/80">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="name"
                  placeholder="Juan Pérez"
                  className="border-white/[0.08] bg-white/5 pl-9 text-white placeholder:text-white/30 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                />
              </div>
              {touched.name && errors.name && <p className="text-xs font-medium text-red-400">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/80">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@empresa.com"
                  className="border-white/[0.08] bg-white/5 pl-9 text-white placeholder:text-white/30 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                />
              </div>
              {touched.email && errors.email && <p className="text-xs font-medium text-red-400">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white/80">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Crea una contraseña segura"
                  className="border-white/[0.08] bg-white/5 pl-9 pr-9 text-white placeholder:text-white/30 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
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
              {touched.password && errors.password && <p className="text-xs font-medium text-red-400">{errors.password}</p>}
              {form.password && (
                <div className="space-y-1 pt-1">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(form.password)
                    return (
                      <div key={rule.label} className="flex items-center gap-1.5">
                        {passed ? (
                          <Check className="size-3 text-emerald-400" />
                        ) : (
                          <X className="size-3 text-white/30" />
                        )}
                        <span className={`text-xs ${passed ? 'text-emerald-400' : 'text-white/40'}`}>
                          {rule.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  className="border-white/[0.08] bg-white/5 pl-9 pr-9 text-white placeholder:text-white/30 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20"
                  value={form.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/80"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-xs font-medium text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-400 hover:to-purple-500 hover:shadow-blue-400/30"
              size="lg"
            >
              Crear Cuenta
            </Button>
            <p className="text-center text-xs text-white/40">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="font-medium text-blue-400 transition-colors hover:text-blue-300">
                Iniciar sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  )
}
