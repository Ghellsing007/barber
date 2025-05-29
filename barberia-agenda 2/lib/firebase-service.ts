import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

// Tipos de datos
export interface Negocio {
  id?: string
  nombre: string
  slugURL: string
  emailPropietario: string
  status: "activo" | "inactivo" | "suspendido"
  plan: "basico" | "premium" | "enterprise"
  descripcion: string
  direccion: string
  telefono: string
  colores: {
    primario: string
    secundario: string
  }
  fechaCreacion: Timestamp | string
}

export interface Profesional {
  id?: string
  idNegocio: string
  nombre: string
  email: string
  especialidad: string
  foto: string
  horariosDisponibles: string[]
  servicios: Servicio[]
  ubicacion: string
}

export interface Servicio {
  id: string
  nombre: string
  duracion: number
  precio: number
}

export interface Cita {
  id?: string
  idNegocio: string
  idProfesional: string
  fecha: string
  hora: string
  estado: "confirmada" | "cancelada" | "completada"
  nombreCliente: string
  telefono?: string
  servicio: Servicio
  fechaCreacion: Timestamp | string
}

// Servicios para Negocios
export const negociosService = {
  // Obtener todos los negocios
  async getAll(): Promise<Negocio[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "negocios"))
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Negocio,
      )
    } catch (error) {
      console.error("Error fetching negocios:", error)
      // Retornar datos mock si Firebase falla
      return [
        {
          id: "1",
          nombre: "Barbería El Clásico",
          slugURL: "barberia-el-clasico",
          emailPropietario: "carlos@barberia.com",
          status: "activo",
          plan: "premium",
          descripcion: "La mejor barbería tradicional de la ciudad",
          direccion: "Av. Principal 123, Centro",
          telefono: "+1234567890",
          colores: {
            primario: "#1f2937",
            secundario: "#3b82f6",
          },
          fechaCreacion: "2024-01-15",
        },
        {
          id: "2",
          nombre: "Salón Elegance",
          slugURL: "salon-elegance",
          emailPropietario: "ana@salon.com",
          status: "activo",
          plan: "basico",
          descripcion: "Estilismo y colorimetría profesional",
          direccion: "Calle Bella 456, Zona Norte",
          telefono: "+1234567891",
          colores: {
            primario: "#ec4899",
            secundario: "#8b5cf6",
          },
          fechaCreacion: "2024-02-01",
        },
      ]
    }
  },

  // Obtener negocio por slug
  async getBySlug(slug: string): Promise<Negocio | null> {
    try {
      const q = query(collection(db, "negocios"), where("slugURL", "==", slug))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) return null

      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as Negocio
    } catch (error) {
      console.error("Error fetching negocio by slug:", error)
      return null
    }
  },

  // Crear nuevo negocio
  async create(negocio: Omit<Negocio, "id" | "fechaCreacion">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "negocios"), {
        ...negocio,
        fechaCreacion: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating negocio:", error)
      throw error
    }
  },

  // Actualizar negocio
  async update(id: string, data: Partial<Negocio>): Promise<void> {
    try {
      const docRef = doc(db, "negocios", id)
      await updateDoc(docRef, data)
    } catch (error) {
      console.error("Error updating negocio:", error)
      throw error
    }
  },

  // Eliminar negocio
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "negocios", id))
    } catch (error) {
      console.error("Error deleting negocio:", error)
      throw error
    }
  },
}

// Servicios para Profesionales
export const profesionalesService = {
  // Obtener todos los profesionales
  async getAll(): Promise<Profesional[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "profesionales"))
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Profesional,
      )
    } catch (error) {
      console.error("Error fetching profesionales:", error)
      // Retornar datos mock si Firebase falla
      return [
        {
          id: "1",
          idNegocio: "1",
          nombre: "Carlos Mendoza",
          email: "carlos@barberia.com",
          especialidad: "Barbero Clásico",
          foto: "/placeholder.svg?height=200&width=200",
          horariosDisponibles: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
          servicios: [
            { id: "1", nombre: "Corte Clásico", duracion: 45, precio: 25 },
            { id: "2", nombre: "Barba", duracion: 30, precio: 15 },
            { id: "3", nombre: "Corte + Barba", duracion: 60, precio: 35 },
          ],
          ubicacion: "Centro",
        },
        {
          id: "2",
          idNegocio: "2",
          nombre: "Ana García",
          email: "ana@salon.com",
          especialidad: "Estilista & Colorista",
          foto: "/placeholder.svg?height=200&width=200",
          horariosDisponibles: ["10:00", "11:30", "13:00", "15:30", "17:00"],
          servicios: [
            { id: "4", nombre: "Corte Mujer", duracion: 60, precio: 40 },
            { id: "5", nombre: "Tinte", duracion: 120, precio: 80 },
            { id: "6", nombre: "Mechas", duracion: 180, precio: 120 },
          ],
          ubicacion: "Zona Norte",
        },
      ]
    }
  },

  // Obtener profesionales por negocio
  async getByNegocio(idNegocio: string): Promise<Profesional[]> {
    try {
      const q = query(collection(db, "profesionales"), where("idNegocio", "==", idNegocio))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Profesional,
      )
    } catch (error) {
      console.error("Error fetching profesionales by negocio:", error)
      return []
    }
  },

  // Obtener profesional por ID
  async getById(id: string): Promise<Profesional | null> {
    try {
      const docRef = doc(db, "profesionales", id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) return null

      return { id: docSnap.id, ...docSnap.data() } as Profesional
    } catch (error) {
      console.error("Error fetching profesional by ID:", error)
      return null
    }
  },

  // Crear profesional
  async create(profesional: Omit<Profesional, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "profesionales"), profesional)
      return docRef.id
    } catch (error) {
      console.error("Error creating profesional:", error)
      throw error
    }
  },

  // Actualizar profesional
  async update(id: string, data: Partial<Profesional>): Promise<void> {
    try {
      const docRef = doc(db, "profesionales", id)
      await updateDoc(docRef, data)
    } catch (error) {
      console.error("Error updating profesional:", error)
      throw error
    }
  },
}

// Servicios para Citas
export const citasService = {
  // Obtener todas las citas
  async getAll(): Promise<Cita[]> {
    try {
      const q = query(collection(db, "citas"), orderBy("fechaCreacion", "desc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Cita,
      )
    } catch (error) {
      console.error("Error fetching citas:", error)
      return []
    }
  },

  // Obtener citas por profesional
  async getByProfesional(idProfesional: string): Promise<Cita[]> {
    try {
      const q = query(
        collection(db, "citas"),
        where("idProfesional", "==", idProfesional),
        orderBy("fechaCreacion", "desc"),
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Cita,
      )
    } catch (error) {
      console.error("Error fetching citas by profesional:", error)
      return []
    }
  },

  // Obtener citas por negocio
  async getByNegocio(idNegocio: string): Promise<Cita[]> {
    try {
      const q = query(collection(db, "citas"), where("idNegocio", "==", idNegocio), orderBy("fechaCreacion", "desc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Cita,
      )
    } catch (error) {
      console.error("Error fetching citas by negocio:", error)
      return []
    }
  },

  // Crear nueva cita
  async create(cita: Omit<Cita, "id" | "fechaCreacion">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "citas"), {
        ...cita,
        fechaCreacion: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating cita:", error)
      throw error
    }
  },

  // Actualizar cita
  async update(id: string, data: Partial<Cita>): Promise<void> {
    try {
      const docRef = doc(db, "citas", id)
      await updateDoc(docRef, data)
    } catch (error) {
      console.error("Error updating cita:", error)
      throw error
    }
  },

  // Eliminar cita
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "citas", id))
    } catch (error) {
      console.error("Error deleting cita:", error)
      throw error
    }
  },
}

// Función para escuchar cambios en tiempo real
export const subscribeToCollection = (collectionName: string, callback: (data: any[]) => void, conditions?: any[]) => {
  let q = collection(db, collectionName)

  if (conditions) {
    // Aplicar condiciones de filtro si se proporcionan
    q = query(q, ...conditions) as any
  }

  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(data)
  })
}
