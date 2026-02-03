import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export default function Communication() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cuenta');
  
  const [accountPrefs, setAccountPrefs] = useState({
    unusualActivity: false,
    securityAlerts: false,
    companyInfoUpdates: true,
    teamMemberChanges: true
  });

  const [transactionsPrefs, setTransactionsPrefs] = useState({
    paymentsErrors: true,
    paymentsNewPaymentMethod: true,
    balancesNegative: true,
    balancesIssuingChanges: false,
    transfersInitiated: true,
    transfersCompleted: true,
    customersNewCustomers: true
  });

  const [apiPrefs, setApiPrefs] = useState({
    apiKeyChanges: true,
    apiIntegrationErrors: true,
    webhookEventGenerationErrors: true,
    webhookFailures: true
  });

  const handleAccountToggle = (key) => {
    setAccountPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTransactionsToggle = (key) => {
    setTransactionsPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApiToggle = (key) => {
    setApiPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'cuenta', label: 'Cuenta' },
    { id: 'transacciones', label: 'Transacciones y saldos' },
    { id: 'api', label: 'API' }
  ];

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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Preferencias de comunicación</h1>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="max-w-[920px] border-b border-gray-200">
            <div className="flex gap-10">
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
        </div>

        {/* Content */}
        {activeTab === 'cuenta' && (
          <div className="space-y-12">
            {/* Riesgo y cumplimiento de la normativa de las cuentas */}
            <section>
              <div className="max-w-[640px]">
                <div className="grid grid-cols-[1fr_72px] gap-1 items-end pb-3 border-b border-gray-200 mb-3">
                  <h2 className="text-base font-semibold text-gray-900">Riesgo y cumplimiento de la normativa de las cuentas</h2>
                  <div className="text-xs font-medium text-gray-700 text-right leading-tight">Correo electrónico</div>
                </div>

                <div className="space-y-2">

                <NotificationRow
                  label="Actividad inusual en tu cuenta"
                  emailChecked={accountPrefs.unusualActivity}
                  onEmailChange={() => handleAccountToggle('unusualActivity')}
                />
                
                <NotificationRow
                  label="Alertas relacionadas con la seguridad"
                  emailChecked={accountPrefs.securityAlerts}
                  onEmailChange={() => handleAccountToggle('securityAlerts')}
                />
                </div>
              </div>
            </section>

            {/* Actualizaciones de la cuenta */}
            <section>
              <div className="max-w-[640px]">
                <div className="grid grid-cols-[1fr_72px] gap-1 items-end pb-3 border-b border-gray-200 mb-3">
                  <h2 className="text-base font-semibold text-gray-900">Actualizaciones de la cuenta</h2>
                  <div className="text-xs font-medium text-gray-700 text-right leading-tight">Correo electrónico</div>
                </div>

                <div className="space-y-2">

                <NotificationRow
                  label="Actualizaciones en la información de la empresa"
                  emailChecked={accountPrefs.companyInfoUpdates}
                  onEmailChange={() => handleAccountToggle('companyInfoUpdates')}
                />
                </div>
              </div>
            </section>

            {/* Gestión de equipos */}
            <section>
              <div className="max-w-[640px]">
                <div className="grid grid-cols-[1fr_72px] gap-1 items-end pb-3 border-b border-gray-200 mb-3">
                  <h2 className="text-base font-semibold text-gray-900">Gestión de equipos</h2>
                  <div className="text-xs font-medium text-gray-700 text-right leading-tight">Correo electrónico</div>
                </div>

                <div className="space-y-2">

                <NotificationRow
                  label="Cambios de miembros del equipo en tu cuenta"
                  emailChecked={accountPrefs.teamMemberChanges}
                  onEmailChange={() => handleAccountToggle('teamMemberChanges')}
                />
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'transacciones' && (
          <div className="space-y-12">
            {/* Pagos */}
            <section>
              <div className="max-w-[640px]">
                <div className="grid grid-cols-[1fr_72px] gap-1 items-end pb-3 border-b border-gray-200 mb-3">
                  <h2 className="text-base font-semibold text-gray-900">Pagos</h2>
                  <div className="text-xs font-medium text-gray-700 text-right leading-tight">Correo electrónico</div>
                </div>

                <div className="space-y-2">
                  <NotificationRow
                    label="Errores en los pagos"
                    emailChecked={transactionsPrefs.paymentsErrors}
                    onEmailChange={() => handleTransactionsToggle('paymentsErrors')}
                  />
                  <NotificationRow
                    label="Nuevo método de pago añadido o configurado"
                    emailChecked={transactionsPrefs.paymentsNewPaymentMethod}
                    onEmailChange={() => handleTransactionsToggle('paymentsNewPaymentMethod')}
                  />
                </div>
              </div>
            </section>

            {/* Saldos */}
            <section>
              <div className="max-w-[640px]">
                <div className="grid grid-cols-[1fr_72px] gap-1 items-end pb-3 border-b border-gray-200 mb-3">
                  <h2 className="text-base font-semibold text-gray-900">Saldos</h2>
                  <div className="text-xs font-medium text-gray-700 text-right leading-tight">Correo electrónico</div>
                </div>

                <div className="space-y-2">
                  <NotificationRow
                    label="Saldo negativo de la cuenta"
                    emailChecked={transactionsPrefs.balancesNegative}
                    onEmailChange={() => handleTransactionsToggle('balancesNegative')}
                  />
                  <NotificationRow
                    label="Cambios en el saldo de Issuing"
                    emailChecked={transactionsPrefs.balancesIssuingChanges}
                    onEmailChange={() => handleTransactionsToggle('balancesIssuingChanges')}
                  />
                </div>
              </div>
            </section>

            {/* Transferencias */}
            <section>
              <div className="max-w-[640px]">
                <div className="grid grid-cols-[1fr_72px] gap-1 items-end pb-3 border-b border-gray-200 mb-3">
                  <h2 className="text-base font-semibold text-gray-900">Transferencias</h2>
                  <div className="text-xs font-medium text-gray-700 text-right leading-tight">Correo electrónico</div>
                </div>

                <div className="space-y-2">
                  <NotificationRow
                    label="Transferencias iniciadas"
                    emailChecked={transactionsPrefs.transfersInitiated}
                    onEmailChange={() => handleTransactionsToggle('transfersInitiated')}
                  />
                  <NotificationRow
                    label="Transferencias completadas"
                    emailChecked={transactionsPrefs.transfersCompleted}
                    onEmailChange={() => handleTransactionsToggle('transfersCompleted')}
                  />
                </div>
              </div>
            </section>

            {/* Clientes */}
            <section>
              <div className="max-w-[640px]">
                <div className="grid grid-cols-[1fr_72px] gap-1 items-end pb-3 border-b border-gray-200 mb-3">
                  <h2 className="text-base font-semibold text-gray-900">Clientes</h2>
                  <div className="text-xs font-medium text-gray-700 text-right leading-tight">Correo electrónico</div>
                </div>

                <div className="space-y-2">
                  <NotificationRow
                    label="Nuevos clientes añadidos a la cuenta"
                    emailChecked={transactionsPrefs.customersNewCustomers}
                    onEmailChange={() => handleTransactionsToggle('customersNewCustomers')}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-12">
            <section>
              <div className="max-w-[640px]">
                <div className="grid grid-cols-[1fr_72px] gap-1 items-end pb-3 border-b border-gray-200 mb-3">
                  <h2 className="text-base font-semibold text-gray-900">API</h2>
                  <div className="text-xs font-medium text-gray-700 text-right leading-tight">Correo electrónico</div>
                </div>

                <div className="space-y-2">
                  <NotificationRow
                    label="Cambios en las claves API"
                    emailChecked={apiPrefs.apiKeyChanges}
                    onEmailChange={() => handleApiToggle('apiKeyChanges')}
                  />
                  <NotificationRow
                    label="Errores de integración de la API"
                    emailChecked={apiPrefs.apiIntegrationErrors}
                    onEmailChange={() => handleApiToggle('apiIntegrationErrors')}
                  />
                  <NotificationRow
                    label="Errores en la generación de eventos webhook"
                    emailChecked={apiPrefs.webhookEventGenerationErrors}
                    onEmailChange={() => handleApiToggle('webhookEventGenerationErrors')}
                  />
                  <NotificationRow
                    label="Fallos de webhook"
                    emailChecked={apiPrefs.webhookFailures}
                    onEmailChange={() => handleApiToggle('webhookFailures')}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

 
      </div>
    </div>
  );
}

const NotificationRow = ({ label, emailChecked, onEmailChange }) => (
  <div className="grid grid-cols-[1fr_72px] gap-1 items-center">
    <span className="text-sm text-gray-900">{label}</span>
    <div className="flex justify-end">
      <Checkbox
        checked={emailChecked}
        onCheckedChange={onEmailChange}
        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
      />
    </div>
  </div>
);
