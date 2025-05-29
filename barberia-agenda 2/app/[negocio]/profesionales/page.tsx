"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/components/providers/app-provider"

export default function ProfesionalesNegocio({ params }: { params: { negocio: string } }) {
  const { obtenerNegocioPorSlug, obtenerProfesionalesPorNegocio } = useApp()
  const [negocio, setNegocio] = useState<any>(null)
  const [profesionales, setProfesionales] = useState<any[]>([])

  useEffect(() => {
    const negocioEncontrado = obtenerNegocioPorSlug(params.negocio)
    if (negocioEncontrado) {
      setNegocio(negocioEncontrado)
      const profesionalesNegocio = obtenerProfesionalesPorNegocio(negocioEncontrado.id)
      setProfesionales(profesionalesNegocio)
    }
  }, [params.negocio, obtenerNegocioPorSlug, obtenerProfesionalesPorNegocio])

  if (!negocio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Negocio no encontrado</h1>
          <Link href="/">
            <Button>Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href={`/${params.negocio}`} className="flex items-center space-x-2 mr-4">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: negocio.colores.primario }}>
                {negocio.nombre}
              </h1>
              <p className="text-gray-600">Selecciona un profesional</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">Elige el profesional que prefieras y agenda tu cita</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profesionales.map((profesional) => (
            <Card key={profesional.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Image
                    src={profesional.foto || "/placeholder.svg"}
                    alt={profesional.nombre}
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl">{profesional.nombre}</CardTitle>
                <Badge variant="secondary" className="w-fit mx-auto">
                  {profesional.especialidad}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{profesional.ubicacion}</span>
                </div>

                {/* Servicios */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Servicios:</h4>
                  <div className="space-y-2">
                    {profesional.servicios.slice(0, 3).map((servicio: any) => (
                      <div key={servicio.id} className="flex justify-between items-center text-sm">
                        <span>{servicio.nombre}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">{servicio.duracion}min</span>
                          <span className="font-medium">${servicio.precio}</span>
                        </div>
                      </div>
                    ))}
                    {profesional.servicios.length > 3 && (
                      <p className="text-sm text-gray-500">+{profesional.servicios.length - 3} servicios más</p>
                    )}
                  </div>
                </div>

                {/* Horarios disponibles */}
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Horarios disponibles hoy:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profesional.horariosDisponibles.slice(0, 3).map((hora: string) => (
                      <Badge key={hora} variant="outline" className="text-xs">
                        {hora}
                      </Badge>
                    ))}
                    {profesional.horariosDisponibles.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{profesional.horariosDisponibles.length - 3} más
                      </Badge>
                    )}
                  </div>
                </div>

                <Link href={`/${params.negocio}/profesionales/${profesional.id}/horarios`} className="block">
                  <Button className="w-full" style={{ backgroundColor: negocio.colores.secundario }}>
                    Agendar Cita
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {profesionales.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay profesionales disponibles</h3>
            <p className="text-gray-600">Este negocio aún no tiene profesionales registrados</p>
          </div>
        )}
      </main>
    </div>
  )
}
