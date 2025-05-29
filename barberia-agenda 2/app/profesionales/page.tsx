"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/components/providers/app-provider"

export default function ProfesionalesList() {
  const { profesionales } = useApp()

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
            <h1 className="text-2xl font-bold text-gray-900">Profesionales Disponibles</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">Selecciona un profesional para ver su disponibilidad y agendar tu cita</p>
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
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{profesional.duracionServicio} min por servicio</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Horarios disponibles hoy:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profesional.horariosDisponibles.slice(0, 3).map((hora) => (
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
                <Link href={`/profesionales/${profesional.id}/horarios`} className="block">
                  <Button className="w-full">Ver Disponibilidad</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
