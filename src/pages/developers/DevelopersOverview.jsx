import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Zap,
    Link2,
    CheckCircle2,
    XCircle,
    Activity,
    ArrowRight,
    Terminal,
    RefreshCw,
    BookOpen,
    KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const QUICK_ACTIONS = [
    {
        id: 'payment-link-fixed',
        title: 'Payment Link',
        description: 'Crea enlaces de pago con monto fijo o productos.',
        icon: Link2,
        path: '/dashboard/payment-links/create'
    },
    {
        id: 'docs',
        title: 'Documentación',
        description: 'Explora la guía técnica de AntillaPay.',
        icon: BookOpen,
        path: '/dashboard/developers/docs'
    },
    {
        id: 'api-keys',
        title: 'Claves de API',
        description: 'Gestiona credenciales de prueba y live.',
        icon: KeyRound,
        path: '/dashboard/developers/keys'
    }
];

const MOCK_EVENTS = [
    { id: 'evt_demo_1', type: 'payment.succeeded', created: 'Hace 2 min', status: 'success' },
    { id: 'evt_demo_2', type: 'payment_intent.created', created: 'Hace 5 min', status: 'success' },
    { id: 'evt_demo_3', type: 'charge.failed', created: 'Hace 15 min', status: 'failed' },
    { id: 'evt_demo_4', type: 'transfermovil.approved', created: 'Hace 1 hora', status: 'success' },
    { id: 'evt_demo_5', type: 'enzona.payment.updated', created: 'Hace 2 horas', status: 'success' }
];

const MOCK_WEBHOOKS = [
    { id: 'wh_1', endpoint: 'https://antillapay.app/webhooks/transfer', status: 'success', created: 'Hace 2 min' },
    { id: 'wh_2', endpoint: 'https://antillapay.app/webhooks/charge', status: 'success', created: 'Hace 5 min' },
    { id: 'wh_3', endpoint: 'https://antillapay.app/webhooks/fallback', status: 'failed', created: 'Hace 15 min' }
];

export default function DevelopersOverview() {
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-[24px] font-bold text-[#32325d]">Desarrolladores</h1>
                <p className="text-[14px] text-[#697386]">
                    Administra tus claves de API, webhooks y herramientas de desarrollo de AntillaPay.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[14px] font-bold text-[#32325d] uppercase tracking-wider">Estado de Integración</h3>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 px-2.5 py-0.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Conectado
                        </Badge>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[13px] text-[#4f5b76]">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <Terminal className="w-4 h-4 text-[#635bff]" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-[#32325d]">Modo Demo</div>
                                <div className="text-[12px] text-[#697386]">Claves de prueba activas</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-[13px] text-[#4f5b76]">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <Activity className="w-4 h-4 text-[#635bff]" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-[#32325d]">Última actividad</div>
                                <div className="text-[12px] text-[#697386]">Hace 2 minutos</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-[14px] font-bold text-[#32325d] uppercase tracking-wider mb-4">Acciones rápidas</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {QUICK_ACTIONS.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Button
                                    key={action.id}
                                    variant="outline"
                                    className="h-auto p-4 flex flex-col items-start gap-2 border-gray-200 hover:border-[#635bff] hover:bg-[#635bff]/5 transition-all group"
                                    onClick={() => navigate(action.path)}
                                >
                                    <div className="p-2 bg-[#635bff]/10 rounded-lg group-hover:bg-[#635bff] transition-colors">
                                        <Icon className="w-5 h-5 text-[#635bff] group-hover:text-white" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-[#32325d]">{action.title}</div>
                                        <div className="text-[12px] text-[#697386] mt-1">{action.description}</div>
                                    </div>
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[#8898aa]" />
                            <h3 className="text-[14px] font-bold text-[#32325d]">Últimos eventos</h3>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[12px] h-8 text-[#635bff]"
                            onClick={() => navigate('/dashboard/developers/events')}
                        >
                            Ver todos
                        </Button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {MOCK_EVENTS.map((evt) => (
                            <div
                                key={evt.id}
                                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate('/dashboard/developers/events')}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') navigate('/dashboard/developers/events');
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={cn(
                                            'mt-0.5 w-2 h-2 rounded-full',
                                            evt.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                                        )}
                                    />
                                    <div>
                                        <div className="text-[13px] font-medium text-[#32325d] font-mono group-hover:text-[#635bff] transition-colors">
                                            {evt.type}
                                        </div>
                                        <div className="text-[11px] text-[#697386] flex items-center gap-2">
                                            <span>{evt.id}</span>
                                            <span>•</span>
                                            <span>{evt.created}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-4 h-4 text-[#aab2c4]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#8898aa]" />
                            <h3 className="text-[14px] font-bold text-[#32325d]">Entregas de webhooks</h3>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[12px] h-8 text-[#635bff]"
                            onClick={() => navigate('/dashboard/developers/webhooks')}
                        >
                            Ver historial
                        </Button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {MOCK_WEBHOOKS.map((hook) => (
                            <div
                                key={hook.id}
                                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate('/dashboard/developers/webhooks')}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') navigate('/dashboard/developers/webhooks');
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    {hook.status === 'success' ? (
                                        <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                    ) : (
                                        <div className="p-1.5 bg-red-100 text-red-600 rounded">
                                            <XCircle className="w-3.5 h-3.5" />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <div className="text-[13px] font-medium text-[#32325d] truncate max-w-[200px] md:max-w-[280px]">
                                            {hook.endpoint}
                                        </div>
                                        <div className="text-[11px] text-[#697386] flex items-center gap-2">
                                            <span>{hook.id}</span>
                                            <span>•</span>
                                            <span>{hook.created}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {hook.status === 'failed' && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 text-[#635bff]"
                                            title="Reintentar"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                navigate('/dashboard/developers/webhooks');
                                            }}
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
