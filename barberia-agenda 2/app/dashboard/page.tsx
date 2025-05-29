"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, Calendar, Clock, User, Settings, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useApp } from "@/components/providers/app-provider"
import { useToast } from "@/hooks/use-toast"

export default function DashboardProfesional() {
  const router = useRouter()
  const { toast } = useToast()
  const { usuario, logout, obtenerCitasProfesional, profesionales, actualizarHorarios } = useApp()
  const [citas, setCitas] = useState<any[]>([])
  const [profesional, setProfesional] = useState<any>(null)
  const [editandoHorarios, setEditandoHorarios] = useState(false)
  const [nuevosHorarios, setNuevosHorarios] = useState<string[]>([])
  const [nuevoHorario, setNuevoHorario] = useState("")

  useEffect(() => {
    if (!usuario || usuario.rol !== "profesional") {
      router.push("/login")
      return
    }

    // Buscar el profesional correspondiente
    const prof = profesionales.find((p) => p.id === usuario.id)
    if (prof) {
      setProfesional(prof)
      setNuevosHorarios([...prof.horariosDisponibles])
    }

    // Cargar citas del profesional
    const citasProfesional = obtenerCitasProfesional(usuario.id)
    setCitas(citasProfesional)
  }, [usuario, router, profesionales, obtenerCitasProfesional])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const agregarHorario = () => {
    if (nuevoHorario && !nuevosHorarios.includes(nuevoHorario)) {
      setNuevosHorarios([...nuevosHorarios, nuevoHorario].sort())
      setNuevoHorario("")
    }
  }

  const eliminarHorario = (horario: string) => {
    setNuevosHorarios(nuevosHorarios.filter((h) => h !== horario))
  }

  const guardarHorarios = () => {
    if (usuario) {
      actualizarHorarios(usuario.id, nuevosHorarios)
      setEditandoHorarios(false)
      toast({
        title: "Horarios actualizados",
        description: "Tus horarios disponibles han sido guardados",
      })
    }
  }

  const cancelarEdicion = () => {
    if (profesional) {
      setNuevosHorarios([...profesional.horariosDisponibles])
    }
    setEditandoHorarios(false)
  }

  if (!usuario || !profesional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cargando...</h1>
        </div>
      </div>
    )
  }

  const citasHoy = citas.filter((cita) => {
    const hoy = new Date().toISOString().split("T")[0]
    return cita.fecha === hoy
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
              <p className="text-gray-600">Bienvenido, {usuario.nombre}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Citas de hoy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Citas de Hoy</span>
                <Badge variant="secondary">{citasHoy.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {citasHoy.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tienes citas programadas para hoy</p>
              ) : (
                <div className="space-y-4">
                  {citasHoy.map((cita) => (
                    <div key={cita.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{cita.hora}</span>
                            <Badge variant="outline" className="text-xs">
                              {cita.estado}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{cita.nombreCliente}</span>
                          </div>
                          {cita.telefono && <p className="text-sm text-gray-600 mt-1">Tel: {cita.telefono}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuración de horarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Horarios Disponibles</span>
                </div>
                {!editandoHorarios && (
                  <Button variant="outline" size="sm" onClick={() => setEditandoHorarios(true)}>
                    Editar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editandoHorarios ? (
                <div className="space-y-4">
                  {/* Agregar nuevo horario */}
                  <div className="flex space-x-2">
                    <Input
                      type="time"
                      value={nuevoHorario}
                      onChange={(e) => setNuevoHorario(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={agregarHorario} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Lista de horarios */}
                  <div className="space-y-2">
                    <Label>Horarios configurados:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {nuevosHorarios.map((horario) => (
                        <div key={horario} className="flex items-center justify-between bg-gray-50 rounded p-2">
                          <span className="text-sm">{horario}</span>
                          <Button variant="ghost" size="sm" onClick={() => eliminarHorario(horario)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex space-x-2">
                    <Button onClick={guardarHorarios} className="flex-1">
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={cancelarEdicion} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {profesional.horariosDisponibles.map((horario: string) => (
                    <Badge key={horario} variant="outline" className="justify-center py-2">
                      {horario}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del perfil */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <p className="text-lg font-medium">{profesional.nombre}</p>
              </div>
              <div>
                <Label>Especialidad</Label>
                <p>{profesional.especialidad}</p>
              </div>
              <div>
                <Label>Ubicación</Label>
                <p>{profesional.ubicacion}</p>
              </div>
              <div>
                <Label>Duración por servicio</Label>
                <p>{profesional.duracionServicio} minutos</p>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{citas.length}</p>
                  <p className="text-sm text-gray-600">Total de citas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{citasHoy.length}</p>
                  <p className="text-sm text-gray-600">Citas hoy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
