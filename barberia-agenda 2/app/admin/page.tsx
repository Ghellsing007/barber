"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Calendar, TrendingUp, Plus, LogOut, Eye, Pause, Play } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useApp } from "@/components/providers/app-provider"

export default function PanelAdmin() {
  const router = useRouter()
  const { usuario, logout, negocios, obtenerEstadisticasGlobales, actualizarStatusNegocio } = useApp()

  useEffect(() => {
    if (!usuario || usuario.rol !== "admin") {
      router.push("/login")
      return
    }
  }, [usuario, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleStatusNegocio = (idNegocio: string, statusActual: string) => {
    const nuevoStatus = statusActual === "activo" ? "inactivo" : "activo"
    actualizarStatusNegocio(idNegocio, nuevoStatus as any)
  }

  if (!usuario || usuario.rol !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso denegado</h1>
          <Link href="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    )
  }

  const estadisticas = obtenerEstadisticasGlobales()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600">Gestiona todos los negocios de Agendly</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/negocios/nuevo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Negocio
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Negocios</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.totalNegocios}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Profesionales</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.totalProfesionales}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Citas</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.totalCitas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Citas Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.citasHoy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Negocios */}
        <Card>
          <CardHeader>
            <CardTitle>Negocios Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {negocios.map((negocio) => (
                <div key={negocio.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{negocio.nombre}</h3>
                        <Badge variant={negocio.status === "activo" ? "default" : "secondary"}>{negocio.status}</Badge>
                        <Badge variant="outline">{negocio.plan}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>URL:</strong> /{negocio.slugURL}
                        </p>
                        <p>
                          <strong>Propietario:</strong> {negocio.emailPropietario}
                        </p>
                        <p>
                          <strong>Dirección:</strong> {negocio.direccion}
                        </p>
                        <p>
                          <strong>Creado:</strong> {new Date(negocio.fechaCreacion).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/${negocio.slugURL}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatusNegocio(negocio.id, negocio.status)}
                      >
                        {negocio.status === "activo" ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Activar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
