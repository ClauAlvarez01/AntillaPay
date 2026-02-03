import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Receipt, ImageIcon, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BillingSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    sequentialNumbering: true,
    includePDFLinks: true,
    taxRoundingInvoice: true,
    paymentConditions: '30',
    includePaymentLink: true,
    saveClientPayment: true,
    autoInvoicing: true,
    emailInvoices: true,
    taxCalculation: true
  });

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Facturas</h1>
          <p className="text-sm text-gray-600">Apariencia, notificaciones de clientes, métodos de pago y plantillas.</p>
        </div>


        <div className="max-w-3xl">
          {/* General Settings */}
          <div className="space-y-6">
            {/* Información de la empresa */}
            <div className="py-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Información de la empresa</h3>
                  <p className="text-sm text-gray-600">
                    Cambia los datos de contacto que aparecen en tus facturas y recibos en{' '}
                    <button 
                      onClick={() => navigate('/dashboard/settings/business')}
                      className="text-indigo-600 hover:text-indigo-700 underline"
                    >
                      Configuración empresarial
                    </button>.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Numeración de facturas */}
            <div className="py-4 border-b border-gray-100">
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Numeración de facturas</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="sequentialClient" 
                        name="numbering"
                        checked={settings.sequentialNumbering}
                        onChange={() => setSettings({...settings, sequentialNumbering: true})}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" 
                      />
                      <Label htmlFor="sequentialClient" className="text-sm text-gray-900">
                        En secuencia para cada cliente
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="allAccount" 
                        name="numbering"
                        checked={!settings.sequentialNumbering}
                        onChange={() => setSettings({...settings, sequentialNumbering: false})}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" 
                      />
                      <Label htmlFor="allAccount" className="text-sm text-gray-900">
                        De manera secuencial en toda la cuenta
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Facturas en PDF */}
            <div className="py-4 border-b border-gray-100">
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Facturas en PDF</h3>
                  <div className="flex items-start gap-3">
                    <Switch
                      id="includePDFLinks"
                      checked={settings.includePDFLinks}
                      onCheckedChange={() => handleToggle('includePDFLinks')}
                      className="data-[state=checked]:bg-indigo-600"
                    />
                    <div>
                      <Label htmlFor="includePDFLinks" className="text-sm text-gray-900 block mb-1">
                        Incluir enlaces y archivos adjuntos de PDF en correos electrónicos de facturas y en la página de pagos
                      </Label>
                      <p className="text-xs text-gray-500">
                        Los clientes pueden hacer clic en estos enlaces para descargar archivos PDF de facturas, recibos y notas de crédito.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Condiciones de pago */}
            <div className="py-4">
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Condiciones de pago predeterminadas</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-700 mb-2">Vencimiento del pago</p>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          value={settings.paymentConditions}
                          onChange={(e) => setSettings({...settings, paymentConditions: e.target.value})}
                          className="w-20" 
                        />
                        <span className="text-sm text-gray-600">días</span>
                        <span className="text-sm text-gray-600">después del envío de la factura</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-700 mb-3">Página de pagos</p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Switch
                            id="includePaymentLink"
                            checked={settings.includePaymentLink}
                            onCheckedChange={() => handleToggle('includePaymentLink')}
                            className="data-[state=checked]:bg-indigo-600"
                          />
                          <div>
                            <Label htmlFor="includePaymentLink" className="text-sm text-gray-900 block mb-1">
                              Incluye un enlace a una página de pago en el correo electrónico de la factura
                            </Label>
                            <p className="text-xs text-gray-500">
                              Los clientes pueden usar este enlace para pagar, descargar y ver el estado de su factura.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Switch
                            id="saveClientPayment"
                            checked={settings.saveClientPayment}
                            onCheckedChange={() => handleToggle('saveClientPayment')}
                            className="data-[state=checked]:bg-indigo-600"
                          />
                          <div>
                            <Label htmlFor="saveClientPayment" className="text-sm text-gray-900 block mb-1">
                              Guarda la información de pago del cliente
                            </Label>
                            <p className="text-xs text-gray-500">
                              Cuando estén habilitados, los métodos de pago empleados para las facturas puntuales se guardarán para utilizarlos más adelante.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
