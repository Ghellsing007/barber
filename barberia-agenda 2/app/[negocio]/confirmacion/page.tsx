"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Clock, User, Home, DollarSign } from "lucide-react"
import Link from "next/link"

export default function ConfirmacionNegocio({ params }: { params: { negocio: string } }) {
  const searchParams = useSearchParams()

  const profesional = searchParams.get("profesional") || ""
  const fecha = searchParams.get("fecha") || ""
  const hora = searchParams.get("hora") || ""
  const cliente = searchParams.get("cliente") || ""
  const servicio = searchParams.get("servicio") || ""
  const precio = searchParams.get("precio") || ""

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr + "T00:00:00")
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">¡Cita Confirmada!</CardTitle>
            <p className="text-gray-600">Tu cita ha sido reservada exitosamente</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Detalles de la cita */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div className="text-left">
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{cliente}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div className="text-left">
                  <p className="text-sm text-gray-500">Profesional</p>
                  <p className="font-medium">{profesional}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div className="text-left">
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">{formatearFecha(fecha)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div className="text-left">
                  <p className="text-sm text-gray-500">Hora</p>
                  <p className="font-medium">{hora}</p>
                </div>
              </div>

              {servicio && (
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">S</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500">Servicio</p>
                    <p className="font-medium">{servicio}</p>
                  </div>
                </div>
              )}

              {precio && (
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <div className="text-left">
                    <p className="text-sm text-gray-500">Precio</p>
                    <p className="font-medium">${precio}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Importante:</strong> Llega 5 minutos antes de tu cita.
              </p>
              <p>Si necesitas cancelar o reprogramar, contacta directamente al negocio.</p>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <Link href={`/${params.negocio}`} className="block">
                <Button className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Volver al Negocio
                </Button>
              </Link>
              <Link href={`/${params.negocio}/profesionales`} className="block">
                <Button variant="outline" className="w-full">
                  Agendar Otra Cita
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
