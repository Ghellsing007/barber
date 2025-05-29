import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/components/providers/app-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Agendly - Agenda tu cita",
  description: "Plataforma inteligente para agendar citas en barberías y salones",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  )
}
