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

interface FirebaseContextType {
  // Auth
  user: any
  loading: boolean
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<any>

  // Data
  negocios: Negocio[]
  profesionales: Profesional[]
  citas: Cita[]

  // Actions
  crearNegocio: (negocio: Omit<Negocio, "id" | "fechaCreacion">) => Promise<void>
  obtenerNegocioPorSlug: (slug: string) => Promise<Negocio | null>
  obtenerProfesionalesPorNegocio: (idNegocio: string) => Profesional[]
  agendarCita: (cita: Omit<Cita, "id" | "fechaCreacion">) => Promise<void>
  actualizarStatusNegocio: (idNegocio: string, status: Negocio["status"]) => Promise<void>
  obtenerEstadisticasGlobales: () => {
    totalNegocios: number
    totalProfesionales: number
    totalCitas: number
    citasHoy: number
  }
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined)

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const auth = useFirebaseAuth()
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [profesionales, setProfesionales] = useState<Profesional[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [negociosData, profesionalesData, citasData] = await Promise.all([
          negociosService.getAll(),
          profesionalesService.getAll(),
          citasService.getAll(),
        ])

        setNegocios(negociosData)
        setProfesionales(profesionalesData)
        setCitas(citasData)
        setDataLoaded(true)
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    if (!auth.loading) {
      loadData()
    }
  }, [auth.loading])

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

  const obtenerNegocioPorSlug = async (slug: string): Promise<Negocio | null> => {
    // Primero buscar en el estado local
    const negocioLocal = negocios.find((n) => n.slugURL === slug)
    if (negocioLocal) return negocioLocal

    // Si no está en local, buscar en Firebase
    try {
      return await negociosService.getBySlug(slug)
    } catch (error) {
      console.error("Error fetching negocio by slug:", error)
      return null
    }
  }

  const obtenerProfesionalesPorNegocio = (idNegocio: string): Profesional[] => {
    return profesionales.filter((prof) => prof.idNegocio === idNegocio)
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

  const actualizarStatusNegocio = async (idNegocio: string, status: Negocio["status"]) => {
    try {
      await negociosService.update(idNegocio, { status })
      setNegocios((prev) => prev.map((neg) => (neg.id === idNegocio ? { ...neg, status } : neg)))
    } catch (error) {
      console.error("Error updating negocio status:", error)
      throw error
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
    <FirebaseContext.Provider
      value={{
        // Auth
        user: auth.user,
        loading: auth.loading || !dataLoaded,
        login: auth.login,
        logout: auth.logout,

        // Data
        negocios,
        profesionales,
        citas,

        // Actions
        crearNegocio,
        obtenerNegocioPorSlug,
        obtenerProfesionalesPorNegocio,
        agendarCita,
        actualizarStatusNegocio,
        obtenerEstadisticasGlobales,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}
