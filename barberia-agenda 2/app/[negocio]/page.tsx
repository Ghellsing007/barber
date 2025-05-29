"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, Users, Star } from "lucide-react"
import Link from "next/link"
import { useApp } from "@/components/providers/app-provider"

export default function LandingNegocio({ params }: { params: { negocio: string } }) {
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
          <p className="text-gray-600 mb-4">El negocio que buscas no existe o no está disponible</p>
          <Link href="/">
            <Button>Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (negocio.status !== "activo") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Negocio temporalmente no disponible</h1>
          <p className="text-gray-600 mb-4">Este negocio está temporalmente fuera de servicio</p>
          <Link href="/">
            <Button>Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom right, ${negocio.colores.primario}10, ${negocio.colores.secundario}10)`,
      }}
    >
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: negocio.colores.primario }}>
                {negocio.nombre}
              </h1>
              <p className="text-gray-600">{negocio.descripcion}</p>
            </div>
            <Link href="/login">
              <Button variant="outline">Soy Profesional</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Agenda tu cita en <span style={{ color: negocio.colores.secundario }}>{negocio.nombre}</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">{negocio.descripcion}</p>

          {/* Información del negocio */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-8">
            {negocio.direccion && (
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{negocio.direccion}</span>
              </div>
            )}
            {negocio.telefono && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-5 w-5" />
                <span>{negocio.telefono}</span>
              </div>
            )}
          </div>

          <Link href={`/${params.negocio}/profesionales`}>
            <Button size="lg" className="text-lg px-8 py-4" style={{ backgroundColor: negocio.colores.secundario }}>
              Ver Profesionales Disponibles
            </Button>
          </Link>
        </div>
      </section>

      {/* Profesionales Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Nuestro Equipo</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profesionales.slice(0, 3).map((profesional) => (
              <Card key={profesional.id} className="text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h4 className="text-xl font-semibold mb-2">{profesional.nombre}</h4>
                  <Badge variant="secondary" className="mb-3">
                    {profesional.especialidad}
                  </Badge>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{profesional.servicios.length} servicios disponibles</p>
                    <p>Desde ${Math.min(...profesional.servicios.map((s: any) => s.precio))}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {profesionales.length > 3 && (
            <div className="text-center mt-8">
              <Link href={`/${params.negocio}/profesionales`}>
                <Button variant="outline">Ver Todos los Profesionales</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4" style={{ color: negocio.colores.secundario }} />
                <h4 className="text-xl font-semibold mb-2">Horarios Flexibles</h4>
                <p className="text-gray-600">Agenda en los horarios que mejor te convengan</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4" style={{ color: negocio.colores.secundario }} />
                <h4 className="text-xl font-semibold mb-2">Profesionales Expertos</h4>
                <p className="text-gray-600">Equipo calificado y con experiencia</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 mx-auto mb-4" style={{ color: negocio.colores.secundario }} />
                <h4 className="text-xl font-semibold mb-2">Servicio de Calidad</h4>
                <p className="text-gray-600">Comprometidos con tu satisfacción</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold mb-2">{negocio.nombre}</h3>
          <p className="text-gray-400 mb-4">{negocio.descripcion}</p>
          <div className="flex justify-center items-center space-x-6 text-sm">
            {negocio.direccion && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{negocio.direccion}</span>
              </div>
            )}
            {negocio.telefono && (
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>{negocio.telefono}</span>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-gray-500 text-sm">Powered by Agendly</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
