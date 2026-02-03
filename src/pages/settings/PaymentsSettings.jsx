import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, Globe, Shield, Zap, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function PaymentsSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('checkout');
  const [paymentMethodsFilter, setPaymentMethodsFilter] = useState('all');
  const [paymentMethodsSearch, setPaymentMethodsSearch] = useState('');

  const defaultPaymentMethods = [
    { name: 'Cartes Bancaires', type: 'Tarjetas', popularIn: 'Francia', enabled: true },
    { name: 'Tarjetas', type: 'Tarjetas', popularIn: 'Todas las regiones', enabled: true },
    { name: 'Tarjetas coreanas', type: 'Tarjetas', popularIn: 'Corea del Sur', enabled: false },
    { name: 'Alipay', type: 'Monedero digital', popularIn: 'China', enabled: false },
    { name: 'Amazon Pay', type: 'Monedero digital', popularIn: 'Todas las regiones', enabled: true },
    { name: 'Apple Pay', type: 'Monedero digital', popularIn: 'Todas las regiones', enabled: true },
    { name: 'Cash App Pay', type: 'Monedero digital', popularIn: 'Estados Unidos', enabled: true },
    { name: 'Google Pay', type: 'Monedero digital', popularIn: 'Todas las regiones', enabled: false },
    { name: 'Kakao Pay', type: 'Monedero digital', popularIn: 'Corea del Sur', enabled: true }
  ];

  const [paymentMethods, setPaymentMethods] = useState(() => {
    try {
      const raw = localStorage.getItem('antillapay.paymentMethods');
      if (!raw) return defaultPaymentMethods;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return defaultPaymentMethods;
      return parsed;
    } catch {
      return defaultPaymentMethods;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('antillapay.paymentMethods', JSON.stringify(paymentMethods));
    } catch {
      // ignore
    }
  }, [paymentMethods]);

  const togglePaymentMethod = (name) => {
    setPaymentMethods((prev) =>
      prev.map((m) => (m.name === name ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const paymentMethodCounts = useMemo(() => {
    const total = paymentMethods.length;
    const enabled = paymentMethods.filter((m) => m.enabled).length;
    const disabled = total - enabled;
    return { total, enabled, disabled };
  }, [paymentMethods]);

  const filteredPaymentMethods = useMemo(() => {
    const query = paymentMethodsSearch.trim().toLowerCase();
    let rows = paymentMethods;

    if (paymentMethodsFilter === 'enabled') rows = rows.filter((m) => m.enabled);
    if (paymentMethodsFilter === 'disabled') rows = rows.filter((m) => !m.enabled);

    if (!query) return rows;

    return rows.filter((m) => {
      const haystack = `${m.name} ${m.type}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [paymentMethods, paymentMethodsFilter, paymentMethodsSearch]);

  return (
    <div className="bg-white min-h-screen">
      <div className="px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Configuración
          </button>
          <ChevronRight className="h-4 w-4 mx-2" />
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Pagos</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('checkout')}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative whitespace-nowrap',
                activeTab === 'checkout' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Checkout y Payment Links
              {activeTab === 'checkout' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
            </button>
            <button
              onClick={() => setActiveTab('methods')}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative whitespace-nowrap',
                activeTab === 'methods' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Métodos de pago
              {activeTab === 'methods' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Checkout Tab Content */}
        {activeTab === 'checkout' && (
          <div className="max-w-4xl space-y-6">
            <div className="pb-4">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Personaliza las opciones</h2>
              <p className="text-sm text-gray-600">
                Esta configuración se aplica a las páginas de pagos que crees con AntillaPay Checkout y Payment Links.
              </p>
            </div>

            <div className="space-y-1">
              {/* Información pública */}
              <div className="py-4 border-b border-gray-100">
                <div className="flex items-start gap-6">
                  <div className="min-w-64">
                    <p className="text-sm font-medium text-gray-900">Información pública</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Ve a{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/activate-account', { state: { targetStep: 5 } })}
                        className="text-indigo-600 hover:text-indigo-700 underline"
                      >
                        Datos públicos
                      </button>{' '}
                      para actualizar el nombre de tu empresa y la descripción del cargo en el extracto bancario.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Methods Tab Content */}
        {activeTab === 'methods' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Métodos de pago</h2>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm font-medium text-amber-900">Métodos de pago por definir</p>
              <p className="mt-1 text-xs text-amber-800">
                Estos métodos se ajustarán según lo que AntillaPay ofrezca de forma nativa y las integraciones de terceros disponibles.
              </p>
            </div>

            <div className="relative w-full max-w-[420px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab2c4]" />
              <Input
                value={paymentMethodsSearch}
                onChange={(event) => setPaymentMethodsSearch(event.target.value)}
                placeholder="Buscar métodos"
                className="h-9 rounded-full border-gray-200 bg-white pl-10 text-[13px]"
              />
            </div>

            {/* Filter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setPaymentMethodsFilter('all')}
                className={cn(
                  'p-4 rounded-lg border text-left transition-colors',
                  paymentMethodsFilter === 'all' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
                )}
              >
                <p className={cn('text-xs font-medium mb-1', paymentMethodsFilter === 'all' ? 'text-indigo-600' : 'text-gray-600')}>
                  Todo
                </p>
                <p className="text-2xl font-semibold text-gray-900">{paymentMethodCounts.total}</p>
              </button>
              <button
                onClick={() => setPaymentMethodsFilter('enabled')}
                className={cn(
                  'p-4 rounded-lg border text-left transition-colors',
                  paymentMethodsFilter === 'enabled' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
                )}
              >
                <p className={cn('text-xs font-medium mb-1', paymentMethodsFilter === 'enabled' ? 'text-indigo-600' : 'text-gray-600')}>
                  Habilitado
                </p>
                <p className="text-2xl font-semibold text-gray-900">{paymentMethodCounts.enabled}</p>
              </button>
              <button
                onClick={() => setPaymentMethodsFilter('disabled')}
                className={cn(
                  'p-4 rounded-lg border text-left transition-colors',
                  paymentMethodsFilter === 'disabled' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
                )}
              >
                <p className={cn('text-xs font-medium mb-1', paymentMethodsFilter === 'disabled' ? 'text-indigo-600' : 'text-gray-600')}>
                  Deshabilitado
                </p>
                <p className="text-2xl font-semibold text-gray-900">{paymentMethodCounts.disabled}</p>
              </button>
            </div>

            {/* Payment Methods Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Método de pago</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPaymentMethods.map((method, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{method.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{method.type}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={method.enabled ? 'default' : 'secondary'}
                          className={method.enabled ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                        >
                          {method.enabled ? 'Habilitado' : 'Deshabilitado'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Switch
                          id={`payment-method-${method.name}`}
                          checked={method.enabled}
                          onCheckedChange={() => togglePaymentMethod(method.name)}
                          className="data-[state=checked]:bg-indigo-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
