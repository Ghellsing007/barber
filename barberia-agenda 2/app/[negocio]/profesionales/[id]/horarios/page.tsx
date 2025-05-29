"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, MapPin, User, DollarSign } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useApp } from "@/components/providers/app-provider"
import { useToast } from "@/hooks/use-toast"

export default function HorariosNegocio({ params }: { params: { negocio: string; id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { obtenerNegocioPorSlug, profesionales, agendarCita } = useApp()

  const [negocio, setNegocio] = useState<any>(null)
  const [profesional, setProfesional] = useState<any>(null)
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>("")
  const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null)
  const [nombreCliente, setNombreCliente] = useState("")
  const [telefono, setTelefono] = useState("")
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  useEffect(() => {
    const negocioEncontrado = obtenerNegocioPorSlug(params.negocio)
    if (negocioEncontrado) {
      setNegocio(negocioEncontrado)
    }

    const profesionalEncontrado = profesionales.find((p) => p.id === params.id)
    if (profesionalEncontrado) {
      setProfesional(profesionalEncontrado)
    }
  }, [params.negocio, params.id, obtenerNegocioPorSlug, profesionales])

  if (!negocio || !profesional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No encontrado</h1>
          <Link href={`/${params.negocio}`}>
            <Button>Volver</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSeleccionarHora = (hora: string) => {
    setHoraSeleccionada(hora)
    if (servicioSeleccionado) {
      setMostrarFormulario(true)
    }
  }

  const handleSeleccionarServicio = (servicioId: string) => {
    const servicio = profesional.servicios.find((s: any) => s.id === servicioId)
    setServicioSeleccionado(servicio)
    if (horaSeleccionada) {
      setMostrarFormulario(true)
    }
  }

  const handleConfirmarCita = () => {
    if (!nombreCliente.trim() || !servicioSeleccionado || !horaSeleccionada) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    const fechaHoy = new Date().toISOString().split("T")[0]

    agendarCita({
      idNegocio: negocio.id,
      idProfesional: profesional.id,
      fecha: fechaHoy,
      hora: horaSeleccionada,
      estado: "confirmada",
      nombreCliente,
      telefono,
      servicio: servicioSeleccionado,
    })

    // Redirigir a confirmación
    router.push(
      `/${params.negocio}/confirmacion?profesional=${encodeURIComponent(profesional.nombre)}&fecha=${fechaHoy}&hora=${horaSeleccionada}&cliente=${encodeURIComponent(nombreCliente)}&servicio=${encodeURIComponent(servicioSeleccionado.nombre)}&precio=${servicioSeleccionado.precio}`,
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href={`/${params.negocio}/profesionales`} className="flex items-center space-x-2 mr-4">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: negocio.colores.primario }}>
                Agendar Cita
              </h1>
              <p className="text-gray-600">Con {profesional.nombre}</p>
            </div>
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
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Selección de servicio */}
          <Card>
            <CardHeader>
              <CardTitle>Selecciona un Servicio</CardTitle>
              <p className="text-sm text-gray-600">Elige el servicio que deseas</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profesional.servicios.map((servicio: any) => (
                  <div
                    key={servicio.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      servicioSeleccionado?.id === servicio.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSeleccionarServicio(servicio.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{servicio.nombre}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{servicio.duracion} min</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold">{servicio.precio}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Horarios disponibles */}
          <Card>
            <CardHeader>
              <CardTitle>Horarios Disponibles - Hoy</CardTitle>
              <p className="text-sm text-gray-600">Selecciona el horario que prefieras</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {profesional.horariosDisponibles.map((hora: string) => (
                  <Button
                    key={hora}
                    variant={horaSeleccionada === hora ? "default" : "outline"}
                    className="h-12"
                    onClick={() => handleSeleccionarHora(hora)}
                    disabled={!servicioSeleccionado}
                  >
                    {hora}
                  </Button>
                ))}
              </div>
              {!servicioSeleccionado && <p className="text-sm text-gray-500 mt-3">Primero selecciona un servicio</p>}
            </CardContent>
          </Card>
        </div>

        {/* Formulario de confirmación */}
        {mostrarFormulario && servicioSeleccionado && horaSeleccionada && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Confirmar Cita</CardTitle>
              <p className="text-sm text-gray-600">Completa tus datos para confirmar la reserva</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Profesional: {profesional.nombre}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Hora: {horaSeleccionada}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Servicio: {servicioSeleccionado.nombre}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Precio: ${servicioSeleccionado.precio}</span>
                  </div>
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

              <Button
                className="w-full"
                onClick={handleConfirmarCita}
                disabled={!nombreCliente.trim()}
                style={{ backgroundColor: negocio.colores.secundario }}
              >
                Confirmar Cita - ${servicioSeleccionado.precio}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
