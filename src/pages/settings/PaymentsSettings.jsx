import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Globe, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function PaymentsSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    creditCards: true,
    debitCards: true,
    bankTransfers: true,
    digitalWallets: true,
    autoCurrencyConversion: true,
    savePaymentMethods: true,
    instantPayouts: false
  });

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const paymentMethods = [
    { name: 'Visa', enabled: true, fee: '2.9% + $0.30' },
    { name: 'Mastercard', enabled: true, fee: '2.9% + $0.30' },
    { name: 'American Express', enabled: true, fee: '3.5% + $0.30' },
    { name: 'PayPal', enabled: false, fee: '3.4% + $0.30' },
    { name: 'Apple Pay', enabled: true, fee: '2.9% + $0.30' },
    { name: 'Google Pay', enabled: true, fee: '2.9% + $0.30' }
  ];

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

        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Pagos</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
                Métodos de pago aceptados
              </CardTitle>
              <CardDescription>
                Selecciona qué métodos de pago quieres aceptar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{method.name}</p>
                        <p className="text-xs text-gray-500">Comisión: {method.fee}</p>
                      </div>
                    </div>
                    <Badge variant={method.enabled ? 'default' : 'secondary'}>
                      {method.enabled ? 'Habilitado' : 'Deshabilitado'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-indigo-600" />
                Conversión de divisas
              </CardTitle>
              <CardDescription>
                Configuración para pagos internacionales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoCurrencyConversion">Conversión automática de divisas</Label>
                  <p className="text-sm text-gray-500">Convierte automáticamente pagos a tu moneda base</p>
                </div>
                <Switch
                  id="autoCurrencyConversion"
                  checked={settings.autoCurrencyConversion}
                  onCheckedChange={() => handleToggle('autoCurrencyConversion')}
                />
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 font-medium mb-1">Moneda base: USD</p>
                <p className="text-xs text-blue-700">Todos los pagos se convertirán a dólares estadounidenses</p>
                <Button variant="outline" size="sm" className="mt-3">Cambiar moneda base</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-indigo-600" />
                Seguridad y verificación
              </CardTitle>
              <CardDescription>
                Opciones de seguridad para transacciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="savePaymentMethods">Guardar métodos de pago</Label>
                  <p className="text-sm text-gray-500">Permite a los clientes guardar tarjetas para futuros pagos</p>
                </div>
                <Switch
                  id="savePaymentMethods"
                  checked={settings.savePaymentMethods}
                  onCheckedChange={() => handleToggle('savePaymentMethods')}
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm mb-2">3D Secure</p>
                <p className="text-xs text-gray-500 mb-3">
                  Autenticación adicional para tarjetas que lo requieran
                </p>
                <Badge variant="default" className="bg-green-600">Habilitado por defecto</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-indigo-600" />
                Proceso de compra
              </CardTitle>
              <CardDescription>
                Optimiza la experiencia de pago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm mb-2">Checkout optimizado</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Formulario de pago optimizado para conversión
                  </p>
                  <Button variant="outline" size="sm">Personalizar</Button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm mb-2">Payment Links</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Enlaces de pago sin necesidad de integración
                  </p>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transferencias y pagos</CardTitle>
              <CardDescription>
                Configuración de pagos a tu cuenta bancaria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="instantPayouts">Pagos instantáneos</Label>
                  <p className="text-sm text-gray-500">Recibe fondos en minutos (comisión adicional)</p>
                </div>
                <Switch
                  id="instantPayouts"
                  checked={settings.instantPayouts}
                  onCheckedChange={() => handleToggle('instantPayouts')}
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm mb-1">Frecuencia de transferencias</p>
                <p className="text-xs text-gray-500 mb-3">Diaria (automática)</p>
                <Button variant="outline" size="sm">Cambiar frecuencia</Button>
              </div>
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
