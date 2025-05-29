"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useFirebaseAuth } from "@/hooks/use-firebase-auth"
import {
  negociosService,
  profesionalesService,
  citasService,
  type Negocio,
  type Profesional,
  type Cita,
} from "@/lib/firebase-service"

interface Usuario {
  id: string
  nombre: string
  email: string
  rol: "cliente" | "profesional" | "admin"
  idNegocio?: string
}

interface AppContextType {
  usuario: Usuario | null
  negocios: Negocio[]
  profesionales: Profesional[]
  citas: Cita[]
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  agendarCita: (cita: Omit<Cita, "id" | "fechaCreacion">) => Promise<void>
  actualizarHorarios: (idProfesional: string, horarios: string[]) => void
  obtenerCitasProfesional: (idProfesional: string) => Cita[]
  obtenerNegocioPorSlug: (slug: string) => Negocio | undefined
  obtenerProfesionalesPorNegocio: (idNegocio: string) => Profesional[]
  crearNegocio: (negocio: Omit<Negocio, "id" | "fechaCreacion">) => Promise<void>
  actualizarStatusNegocio: (idNegocio: string, status: Negocio["status"]) => Promise<void>
  obtenerEstadisticasGlobales: () => {
    totalNegocios: number
    totalProfesionales: number
    totalCitas: number
    citasHoy: number
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const auth = useFirebaseAuth()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [profesionales, setProfesionales] = useState<Profesional[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar datos iniciales cuando el usuario esté autenticado
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [negociosData, profesionalesData, citasData] = await Promise.all([
          negociosService.getAll(),
          profesionalesService.getAll(),
          citasService.getAll(),
        ])

        setNegocios(negociosData)
        setProfesionales(profesionalesData)
        setCitas(citasData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!auth.loading) {
      loadData()
    }
  }, [auth.loading])

  // Manejar cambios en la autenticación
  useEffect(() => {
    if (auth.user) {
      // Determinar el rol del usuario basado en el email
      let rol: "admin" | "profesional" = "profesional"
      if (auth.user.email === "admin@agendly.com") {
        rol = "admin"
      }

      // Buscar el profesional correspondiente
      const profesional = profesionales.find((p) => p.email === auth.user?.email)

      setUsuario({
        id: profesional?.id || auth.user.uid,
        nombre: profesional?.nombre || "Usuario",
        email: auth.user.email || "",
        rol,
        idNegocio: profesional?.idNegocio,
      })
    } else {
      setUsuario(null)
    }
  }, [auth.user, profesionales])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await auth.login(email, password)
      return result.success
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await auth.logout()
      setUsuario(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const agendarCita = async (nuevaCita: Omit<Cita, "id" | "fechaCreacion">) => {
    try {
      const id = await citasService.create(nuevaCita)
      const citaCompleta = { ...nuevaCita, id } as Cita
      setCitas((prev) => [...prev, citaCompleta])
    } catch (error) {
      console.error("Error creating cita:", error)
      throw error
    }
  }

  const actualizarHorarios = async (idProfesional: string, horarios: string[]) => {
    try {
      await profesionalesService.update(idProfesional, { horariosDisponibles: horarios })
      setProfesionales((prev) =>
        prev.map((prof) => (prof.id === idProfesional ? { ...prof, horariosDisponibles: horarios } : prof)),
      )
    } catch (error) {
      console.error("Error updating horarios:", error)
    }
  }

  const obtenerCitasProfesional = (idProfesional: string): Cita[] => {
    return citas.filter((cita) => cita.idProfesional === idProfesional)
  }

  const obtenerNegocioPorSlug = (slug: string): Negocio | undefined => {
    return negocios.find((negocio) => negocio.slugURL === slug)
  }

  const obtenerProfesionalesPorNegocio = (idNegocio: string): Profesional[] => {
    return profesionales.filter((prof) => prof.idNegocio === idNegocio)
  }

  const crearNegocio = async (nuevoNegocio: Omit<Negocio, "id" | "fechaCreacion">) => {
    try {
      const id = await negociosService.create(nuevoNegocio)
      const negocioCompleto = { ...nuevoNegocio, id } as Negocio
      setNegocios((prev) => [...prev, negocioCompleto])
    } catch (error) {
      console.error("Error creating negocio:", error)
      throw error
    }
  }

  const actualizarStatusNegocio = async (idNegocio: string, status: Negocio["status"]) => {
    try {
      await negociosService.update(idNegocio, { status })
      setNegocios((prev) => prev.map((neg) => (neg.id === idNegocio ? { ...neg, status } : neg)))
    } catch (error) {
      console.error("Error updating negocio status:", error)
    }
  }

  const obtenerEstadisticasGlobales = () => {
    const hoy = new Date().toISOString().split("T")[0]
    return {
      totalNegocios: negocios.length,
      totalProfesionales: profesionales.length,
      totalCitas: citas.length,
      citasHoy: citas.filter((cita) => cita.fecha === hoy).length,
    }
  }

  return (
    <AppContext.Provider
      value={{
        usuario,
        negocios,
        profesionales,
        citas,
        loading: loading || auth.loading,
        login,
        logout,
        agendarCita,
        actualizarHorarios,
        obtenerCitasProfesional,
        obtenerNegocioPorSlug,
        obtenerProfesionalesPorNegocio,
        crearNegocio,
        actualizarStatusNegocio,
        obtenerEstadisticasGlobales,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
