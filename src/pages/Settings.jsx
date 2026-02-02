import { useNavigate } from 'react-router-dom';
import { User, Mail, Building2, Shield, FileText, Receipt, CreditCard, Link2, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Settings() {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: 'Configuración personal',
      items: [
        {
          icon: User,
          title: 'Datos personales',
          description: 'Información de contacto, contraseña, métodos de autenticación y sesiones activas.',
          path: '/dashboard/settings/personal-data'
        },
        {
          icon: Mail,
          title: 'Preferencias de comunicación',
          description: 'Personaliza los correos, los SMS y las notificaciones push que recibas.',
          path: '/dashboard/settings/communication'
        }
      ]
    },
    {
      title: 'Ajustes de la cuenta',
      items: [
        {
          icon: Building2,
          title: 'Empresa',
          description: 'Datos de la cuenta, estado de la cuenta, información pública, transferencias, entidad jurídica, domicilios personalizados y mucho más.',
          path: '/dashboard/settings/business'
        },
        {
          icon: Shield,
          title: 'Seguridad',
          description: 'Autenticación de dos factores, contraseña, correo electrónico, teléfono y datos de la empresa.',
          path: '/dashboard/settings/team-security'
        },
              ]
    },
    {
      title: 'Configuración del producto',
      items: [
        {
          icon: Receipt,
          title: 'Facturación',
          description: 'Suscripciones, facturas, presupuestos y portal de clientes.',
          path: '/dashboard/settings/billing'
        },
        {
          icon: CreditCard,
          title: 'Pagos',
          description: 'Proceso de compra, métodos de pago, conversión de divisas y más.',
          path: '/dashboard/settings/payments'
        },
              ]
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Configuración</h1>
        </div>

        <div className="space-y-12">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={itemIndex}
                      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
                      onClick={() => handleNavigate(item.path)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <Icon className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium text-indigo-600 mb-2">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
