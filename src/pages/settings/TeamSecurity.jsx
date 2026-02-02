import { useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Key, Mail, Phone, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TeamSecurity() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <div className="px-8 py-8">
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Configuración
          </button>
          <ChevronRight className="h-4 w-4 mx-2" />
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Seguridad</h1>
          <p className="text-sm text-gray-600">Gestiona la seguridad y autenticación de tu cuenta</p>
        </div>

        <div className="space-y-8 max-w-3xl">
          {/* Autenticación de dos factores */}
          <section className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Autenticación de dos factores
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Protege tu cuenta con un código de verificación enviado a tu correo electrónico cada vez que inicies sesión desde un dispositivo nuevo.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/activate-account', { state: { targetStep: 7 } })}
                >
                  Configurar
                </Button>
              </div>
            </div>
          </section>

          {/* Contraseña */}
          <section className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Key className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Contraseña
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Establece una contraseña segura para proteger tu cuenta.
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  Estado: <span className="text-gray-900">No configurada</span>
                </div>
                <Button variant="outline" size="sm">
                  Establecer contraseña
                </Button>
              </div>
            </div>
          </section>

          {/* Correo electrónico */}
          <section className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Correo electrónico
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Tu correo electrónico principal para notificaciones y recuperación de cuenta.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">clau200103am@gmail.com</p>
                      <p className="text-xs text-gray-500">Principal</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded">
                      Verificado
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Añadir correo secundario
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Teléfono de contacto */}
          <section className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Phone className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Teléfono de contacto
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Número de teléfono para contacto y verificación adicional.
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  No configurado
                </div>
                <Button variant="outline" size="sm">
                  Agregar número de teléfono
                </Button>
              </div>
            </div>
          </section>

          {/* Datos de la empresa */}
          <section className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Building2 className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Información de la empresa
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Datos fiscales y de verificación de tu empresa.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estructura empresarial:</span>
                    <span className="text-gray-900">No configurado</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">NIT:</span>
                    <span className="text-gray-900">No configurado</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nombre legal:</span>
                    <span className="text-gray-900">No configurado</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/activate-account')}
                >
                  Completar datos
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
