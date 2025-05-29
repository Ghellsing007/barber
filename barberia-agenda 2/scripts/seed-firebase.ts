import { negociosService, profesionalesService } from "@/lib/firebase-service"

// Script para poblar Firebase con datos iniciales
export const seedFirebase = async () => {
  try {
    console.log("🌱 Iniciando seed de Firebase...")

    // Crear negocios
    const negocio1Id = await negociosService.create({
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
    })

    const negocio2Id = await negociosService.create({
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
    })

    // Crear profesionales
    await profesionalesService.create({
      idNegocio: negocio1Id,
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
    })

    await profesionalesService.create({
      idNegocio: negocio2Id,
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
    })

    console.log("✅ Seed completado exitosamente!")
  } catch (error) {
    console.error("❌ Error en seed:", error)
  }
}
