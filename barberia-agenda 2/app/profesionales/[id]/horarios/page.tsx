"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, MapPin, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useApp } from "@/components/providers/app-provider"
import { useToast } from "@/hooks/use-toast"

export default function HorariosDisponibles({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { profesionales, agendarCita } = useApp()
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>("")
  const [nombreCliente, setNombreCliente] = useState("")
  const [telefono, setTelefono] = useState("")
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const profesional = profesionales.find((p) => p.id === params.id)

  if (!profesional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profesional no encontrado</h1>
          <Link href="/profesionales">
            <Button>Volver a la lista</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSeleccionarHora = (hora: string) => {
    setHoraSeleccionada(hora)
    setMostrarFormulario(true)
  }

  const handleConfirmarCita = () => {
    if (!nombreCliente.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu nombre",
        variant: "destructive",
      })
      return
    }

    const fechaHoy = new Date().toISOString().split("T")[0]

    agendarCita({
      idCliente: Date.now().toString(),
      idProfesional: profesional.id,
      fecha: fechaHoy,
      hora: horaSeleccionada,
      estado: "confirmada",
      nombreCliente,
      telefono,
    })

    // Redirigir a confirmación
    router.push(
      `/confirmacion?profesional=${encodeURIComponent(profesional.nombre)}&fecha=${fechaHoy}&hora=${horaSeleccionada}&cliente=${encodeURIComponent(nombreCliente)}`,
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/profesionales" className="flex items-center space-x-2 mr-4">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Agendar Cita</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información del profesional */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Image
                src={profesional.foto || "/placeholder.svg"}
                alt={profesional.nombre}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{profesional.nombre}</h2>
                <Badge variant="secondary" className="mb-2">
                  {profesional.especialidad}
                </Badge>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profesional.ubicacion}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{profesional.duracionServicio} min</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Horarios disponibles */}
          <Card>
            <CardHeader>
              <CardTitle>Horarios Disponibles - Hoy</CardTitle>
              <p className="text-sm text-gray-600">Selecciona el horario que mejor te convenga</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {profesional.horariosDisponibles.map((hora) => (
                  <Button
                    key={hora}
                    variant={horaSeleccionada === hora ? "default" : "outline"}
                    className="h-12"
                    onClick={() => handleSeleccionarHora(hora)}
                  >
                    {hora}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Formulario de confirmación */}
          {mostrarFormulario && (
            <Card>
              <CardHeader>
                <CardTitle>Confirmar Cita</CardTitle>
                <p className="text-sm text-gray-600">Completa tus datos para confirmar la reserva</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Hora seleccionada: {horaSeleccionada}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mt-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <span>Con: {profesional.nombre}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre completo *</Label>
                    <Input
                      id="nombre"
                      value={nombreCliente}
                      onChange={(e) => setNombreCliente(e.target.value)}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono (opcional)</Label>
                    <Input
                      id="telefono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Tu número de teléfono"
                    />
                  </div>
                </div>

                <Button className="w-full" onClick={handleConfirmarCita} disabled={!nombreCliente.trim()}>
                  Confirmar Cita
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
