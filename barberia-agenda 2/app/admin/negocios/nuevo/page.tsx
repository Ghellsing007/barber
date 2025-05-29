"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useApp } from "@/components/providers/app-provider"
import { useToast } from "@/hooks/use-toast"

export default function CrearNegocio() {
  const router = useRouter()
  const { toast } = useToast()
  const { crearNegocio } = useApp()

  const [formData, setFormData] = useState({
    nombre: "",
    emailPropietario: "",
    descripcion: "",
    direccion: "",
    telefono: "",
    plan: "basico" as const,
    status: "activo" as const,
    colorPrimario: "#1f2937",
    colorSecundario: "#3b82f6",
  })

  const generateSlug = (nombre: string) => {
    return nombre
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre || !formData.emailPropietario) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const nuevoNegocio = {
      nombre: formData.nombre,
      slugURL: generateSlug(formData.nombre),
      emailPropietario: formData.emailPropietario,
      status: formData.status,
      plan: formData.plan,
      descripcion: formData.descripcion,
      direccion: formData.direccion,
      telefono: formData.telefono,
      colores: {
        primario: formData.colorPrimario,
        secundario: formData.colorSecundario,
      },
    }

    crearNegocio(nuevoNegocio)

    toast({
      title: "¡Negocio creado!",
      description: `${formData.nombre} ha sido registrado exitosamente`,
    })

    router.push("/admin")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/admin" className="flex items-center space-x-2 mr-4">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al Panel</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Negocio</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Información del Negocio</CardTitle>
            <p className="text-gray-600">Completa los datos para registrar un nuevo negocio en Agendly</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Negocio *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Ej: Barbería El Clásico"
                    required
                  />
                  {formData.nombre && (
                    <p className="text-sm text-gray-500 mt-1">URL: /{generateSlug(formData.nombre)}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email del Propietario *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.emailPropietario}
                    onChange={(e) => handleInputChange("emailPropietario", e.target.value)}
                    placeholder="propietario@negocio.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    placeholder="Describe tu negocio..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange("direccion", e.target.value)}
                    placeholder="Av. Principal 123, Centro"
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange("telefono", e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              {/* Configuración */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Configuración</h3>

                <div>
                  <Label htmlFor="plan">Plan</Label>
                  <Select value={formData.plan} onValueChange={(value) => handleInputChange("plan", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basico">Básico</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="colorPrimario">Color Primario</Label>
                    <Input
                      id="colorPrimario"
                      type="color"
                      value={formData.colorPrimario}
                      onChange={(e) => handleInputChange("colorPrimario", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="colorSecundario">Color Secundario</Label>
                    <Input
                      id="colorSecundario"
                      type="color"
                      value={formData.colorSecundario}
                      onChange={(e) => handleInputChange("colorSecundario", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  Crear Negocio
                </Button>
                <Link href="/admin" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
