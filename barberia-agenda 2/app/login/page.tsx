"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Scissors, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useApp } from "@/components/providers/app-provider"
import { useToast } from "@/hooks/use-toast"

export default function Login() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      const exito = await login(email, password)

      if (exito) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
        })

        // Redirigir según el rol
        if (email === "admin@agendly.com") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        toast({
          title: "Error de autenticación",
          description: "Email o contraseña incorrectos",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="flex items-center space-x-2 mr-4">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Scissors className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Agendly</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
              <p className="text-gray-600">Accede a tu panel de control</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={mostrarPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contraseña"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                    >
                      {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={cargando}>
                  {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              {/* Credenciales de prueba */}
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Administrador:</h3>
                  <p className="text-sm text-blue-800">admin@agendly.com / admin123</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Profesionales:</h3>
                  <div className="text-sm text-green-800 space-y-1">
                    <p>
                      <strong>Carlos:</strong> carlos@barberia.com / 123456
                    </p>
                    <p>
                      <strong>Ana:</strong> ana@salon.com / 123456
                    </p>
                    <p>
                      <strong>Miguel:</strong> miguel@moderncuts.com / 123456
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
