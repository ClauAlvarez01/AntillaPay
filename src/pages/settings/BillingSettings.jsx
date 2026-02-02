import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Receipt, CreditCard, FileText, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function BillingSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    autoInvoicing: true,
    emailInvoices: true,
    taxCalculation: true,
    recurringBilling: true
  });

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/dashboard/settings')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver a Configuración
        </Button>

        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Facturación</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-indigo-600" />
                Configuración de facturas
              </CardTitle>
              <CardDescription>
                Personaliza cómo se generan y envían las facturas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoInvoicing">Facturación automática</Label>
                  <p className="text-sm text-gray-500">Genera facturas automáticamente al completar pagos</p>
                </div>
                <Switch
                  id="autoInvoicing"
                  checked={settings.autoInvoicing}
                  onCheckedChange={() => handleToggle('autoInvoicing')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailInvoices">Enviar facturas por email</Label>
                  <p className="text-sm text-gray-500">Envía automáticamente las facturas a los clientes</p>
                </div>
                <Switch
                  id="emailInvoices"
                  checked={settings.emailInvoices}
                  onCheckedChange={() => handleToggle('emailInvoices')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="taxCalculation">Cálculo automático de impuestos</Label>
                  <p className="text-sm text-gray-500">Calcula IVA y otros impuestos automáticamente</p>
                </div>
                <Switch
                  id="taxCalculation"
                  checked={settings.taxCalculation}
                  onCheckedChange={() => handleToggle('taxCalculation')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
                Suscripciones
              </CardTitle>
              <CardDescription>
                Gestiona la configuración de facturación recurrente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="recurringBilling">Facturación recurrente</Label>
                  <p className="text-sm text-gray-500">Habilita cobros automáticos para suscripciones</p>
                </div>
                <Switch
                  id="recurringBilling"
                  checked={settings.recurringBilling}
                  onCheckedChange={() => handleToggle('recurringBilling')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gracePeriod">Período de gracia (días)</Label>
                <Input
                  id="gracePeriod"
                  type="number"
                  placeholder="3"
                  className="max-w-xs"
                />
                <p className="text-xs text-gray-500">Días antes de cancelar una suscripción por falta de pago</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retryAttempts">Intentos de reintento</Label>
                <Input
                  id="retryAttempts"
                  type="number"
                  placeholder="3"
                  className="max-w-xs"
                />
                <p className="text-xs text-gray-500">Número de intentos de cobro antes de marcar como fallido</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                Presupuestos
              </CardTitle>
              <CardDescription>
                Configuración para la creación de presupuestos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quoteValidity">Validez de presupuestos (días)</Label>
                <Input
                  id="quoteValidity"
                  type="number"
                  placeholder="30"
                  className="max-w-xs"
                />
                <p className="text-xs text-gray-500">Días que un presupuesto permanece válido</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quotePrefix">Prefijo de presupuestos</Label>
                <Input
                  id="quotePrefix"
                  type="text"
                  placeholder="QUOTE-"
                  className="max-w-xs"
                />
                <p className="text-xs text-gray-500">Prefijo para los números de presupuesto</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-indigo-600" />
                Portal de clientes
              </CardTitle>
              <CardDescription>
                Configuración del portal de autoservicio para clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Permite a tus clientes gestionar sus suscripciones, ver facturas y actualizar métodos de pago.
              </p>
              <Button variant="outline">Configurar portal de clientes</Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>Guardar configuración</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
