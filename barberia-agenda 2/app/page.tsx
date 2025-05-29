import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scissors, Clock, Building2, Zap, Shield } from "lucide-react"
import Link from "next/link"

export default function LandingAgendly() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Agendly</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/admin">
                <Button>Panel Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            La plataforma SaaS para <span className="text-blue-600">gestionar tu salón o barbería</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crea tu página personalizada, gestiona citas en tiempo real y haz crecer tu negocio con Agendly. Todo en una
            sola plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin/negocios/nuevo">
              <Button size="lg" className="text-lg px-8 py-4">
                Crear Mi Negocio
              </Button>
            </Link>
            <Link href="/barberia-el-clasico">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">¿Por qué elegir Agendly?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tu Página Personalizada</h3>
                <p className="text-gray-600">
                  Cada negocio tiene su propia URL y diseño personalizado para sus clientes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Gestión en Tiempo Real</h3>
                <p className="text-gray-600">Horarios, servicios y citas actualizados automáticamente</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Seguro y Confiable</h3>
                <p className="text-gray-600">Plataforma segura con respaldos automáticos y soporte 24/7</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Negocios que confían en Agendly</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/barberia-el-clasico">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Barbería El Clásico</h3>
                  <p className="text-gray-600 mb-4">La mejor barbería tradicional de la ciudad</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Abierto ahora</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/salon-elegance">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Salón Elegance</h3>
                  <p className="text-gray-600 mb-4">Estilismo y colorimetría profesional</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Abierto ahora</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/modern-cuts">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-60">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Modern Cuts</h3>
                  <p className="text-gray-600 mb-4">Cortes modernos y tendencias urbanas</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Temporalmente cerrado</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para digitalizar tu negocio?</h2>
          <p className="text-xl text-blue-100 mb-8">Únete a cientos de negocios que ya confían en Agendly</p>
          <Link href="/admin/negocios/nuevo">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Comenzar Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Scissors className="h-6 w-6" />
            <span className="text-xl font-bold">Agendly</span>
          </div>
          <p className="text-gray-400">© 2024 Agendly. La plataforma SaaS para salones y barberías.</p>
        </div>
      </footer>
    </div>
  )
}
