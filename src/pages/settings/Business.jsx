import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export default function Business() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account-data');
  const [copiedAccountId, setCopiedAccountId] = useState(false);
  const [minBalanceEnabled, setMinBalanceEnabled] = useState(false);
  const [minBalanceAmount, setMinBalanceAmount] = useState('0');
  const [minBalanceCurrency, setMinBalanceCurrency] = useState('USD');

  const tabs = [
    { id: 'account-data', label: 'Datos de la cuenta' },
    { id: 'company-data', label: 'Datos de la empresa' },
    { id: 'bank-accounts', label: 'Cuentas bancarias y divisas' },
    { id: 'tax-data', label: 'Datos fiscales' }
  ];

  const handleCopyAccountId = () => {
    navigator.clipboard.writeText('acct_1SwSXaGWDQetCMoN');
    setCopiedAccountId(true);
    setTimeout(() => setCopiedAccountId(false), 2000);
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Empresa</h1>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-3 text-sm font-medium transition-colors relative whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'account-data' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-6">Nombre de la cuenta</h2>
              <div className="max-w-md">
                <Input
                  value="Entorno de prueba de New business"
                  className="text-sm"
                  readOnly
                />
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-6">ID de la cuenta</h2>
              <div className="max-w-md">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 font-mono">
                    acct_1SwSXaGWDQetCMoN
                  </div>
                  <button
                    onClick={handleCopyAccountId}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Copiar ID"
                  >
                    {copiedAccountId ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-6">País</h2>
              <div className="max-w-md">
                <select
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                  defaultValue="US"
                >
                  <option value="CU">Cuba</option>
                  <option value="US">Estados Unidos</option>
                  <option value="MX">México</option>
                  <option value="ES">España</option>
                </select>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">Verificación por teléfono</h2>
              <p className="text-sm text-gray-600 mb-4">
                Debes verificar tu número de teléfono a través de un SMS para procesar pagos desde el Dashboard. Tu número no será visible públicamente.
              </p>
              <Button variant="outline" className="text-sm">
                Verificar ahora
              </Button>
            </section>
          </div>
        )}

        {activeTab === 'company-data' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-6">Información fiscal</h2>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2">Estructura de la empresa</Label>
                  <Input
                    value="MIPYME"
                    className="text-sm"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2">Número de identificación tributaria (NIT)</Label>
                  <Input
                    value="00-0000000"
                    className="text-sm font-mono"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2">Razón social de la empresa</Label>
                  <Input
                    value="New Business S.A."
                    className="text-sm"
                    readOnly
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-6">Dirección de la empresa</h2>
              <div className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-2">País</Label>
                    <Input value="Cuba" className="text-sm" readOnly />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-2">Provincia</Label>
                    <Input value="La Habana" className="text-sm" readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-2">Municipio</Label>
                    <Input value="Plaza de la Revolución" className="text-sm" readOnly />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-2">Código postal</Label>
                    <Input value="10400" className="text-sm" readOnly />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2">Dirección</Label>
                  <Input value="Calle 23 #456" className="text-sm" readOnly />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2">Sitio web de la empresa</Label>
                  <Input value="www.newbusiness.cu" className="text-sm" readOnly />
                </div>
              </div>
            </section>
          </div>
        )}

        
        {activeTab === 'bank-accounts' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-6">Cuentas bancarias</h2>
              <div className="max-w-2xl">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cuenta bancaria principal</p>
                      <p className="text-sm text-gray-600 mt-1">•••• •••• •••• 4242</p>
                      <p className="text-xs text-gray-500 mt-1">Routing: ••••••110</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      Verificada
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="mt-4 text-sm">
                  Añadir cuenta bancaria
                </Button>
              </div>
            </section>

            <section>
              <div className="max-w-3xl">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-5">
                    <h2 className="text-base font-semibold text-gray-900">Saldo mínimo</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Mantén un importe mínimo en tu saldo para que los fondos estén disponibles en caso de reembolsos, disputas y comisiones.
                    </p>
                  </div>

                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">
                    <div className="flex items-start gap-3">
                      <Switch
                        checked={minBalanceEnabled}
                        onCheckedChange={setMinBalanceEnabled}
                        className="data-[state=checked]:bg-indigo-600"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          Mantén un importe mínimo en tu saldo de pagos
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          AntillaPay ajustará tus transferencias de modo que puedas mantener un saldo mínimo.
                        </div>

                        {minBalanceEnabled && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border border-gray-200 bg-white rounded-md px-2 py-1.5">
                                <input
                                  value={minBalanceAmount}
                                  onChange={(e) => setMinBalanceAmount(e.target.value)}
                                  className="w-24 text-sm text-gray-900 outline-none bg-transparent"
                                  inputMode="decimal"
                                />
                                <div className="w-px h-5 bg-gray-200 mx-2" />
                                <select
                                  value={minBalanceCurrency}
                                  onChange={(e) => setMinBalanceCurrency(e.target.value)}
                                  className="text-sm text-gray-900 outline-none bg-transparent"
                                >
                                  <option value="USD">US$</option>
                                  <option value="EUR">EUR</option>
                                  <option value="CUP">CUP</option>
                                </select>
                              </div>
                            </div>

                            <button className="mt-2 text-xs text-gray-500 hover:text-gray-700">
                              + Añade otra divisa
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
                    <Button variant="outline" size="sm">
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-6">Divisas aceptadas</h2>
              <div className="max-w-2xl">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">USD</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">EUR</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">CUP</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'tax-data' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-6">Información tributaria</h2>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2">NIT</Label>
                  <Input value="00-0000000" className="text-sm font-mono" readOnly />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2">Razón social</Label>
                  <Input value="New Business S.A." className="text-sm" readOnly />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2">Tipo de empresa</Label>
                  <Input value="MIPYME" className="text-sm" readOnly />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-6">Representante legal</h2>
              <div className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-2">Nombre legal</Label>
                    <Input value="Juan" className="text-sm" readOnly />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-2">Apellido legal</Label>
                    <Input value="Pérez" className="text-sm" readOnly />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2">Correo electrónico</Label>
                  <Input value="juan.perez@newbusiness.cu" className="text-sm" readOnly />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2">Teléfono</Label>
                  <Input value="+53 5 1234 5678" className="text-sm" readOnly />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
