import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Sparkles } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const QUICKSTART_CARDS = [
    {
        id: 'quickstart',
        title: 'Guía de inicio rápido',
        description: 'Descubre cómo configurar e implementar un webhook para escuchar eventos de AntillaPay.',
        cta: 'Consulta el inicio rápido',
        path: '/dashboard/developers/docs'
    },
    {
        id: 'docs',
        title: 'Recibe eventos en tu punto de conexión de webhooks',
        description: 'Escucha eventos de tu cuenta para activar reacciones automáticas.',
        cta: 'Consulta la documentación',
        path: '/dashboard/developers/docs'
    }
];

const WEBHOOK_OPTIONS = [
    {
        id: 'payin.completed',
        description: 'Se activa cuando un pago entrante queda completado.'
    },
    {
        id: 'transfer.received',
        description: 'Se activa cuando una transferencia es recibida.'
    }
];

const DEFAULT_CONFIG = {
    endpoint: '',
    method: 'POST',
    body: ''
};

export default function DevelopersWebhooks() {
    const navigate = useNavigate();
    const initialConfigState = useMemo(
        () => Object.fromEntries(WEBHOOK_OPTIONS.map((option) => [option.id, { ...DEFAULT_CONFIG }])),
        []
    );

    const [enabledWebhooks, setEnabledWebhooks] = useState(
        () => Object.fromEntries(WEBHOOK_OPTIONS.map((option) => [option.id, false]))
    );
    const [configs, setConfigs] = useState(initialConfigState);

    const handleToggleWebhook = (id, value) => {
        setEnabledWebhooks((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleConfigChange = (id, field, value) => {
        setConfigs((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-[24px] font-bold text-[#32325d]">Webhooks</h1>
                    <p className="text-[14px] text-[#697386]">
                        Configura qué eventos quieres recibir en AntillaPay.
                    </p>
                </div>
            </div>

            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-[#eef2ff] text-[#635bff]">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-semibold text-[#1f2a44]">
                                Activa reacciones en tu integración con eventos de AntillaPay
                            </h2>
                            <p className="text-[13px] text-[#6b7280] mt-1 max-w-2xl">
                                Selecciona los eventos que quieres escuchar y completa la configuración del webhook.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {QUICKSTART_CARDS.map((card) => (
                        <div key={card.id} className="rounded-2xl border border-[#f0f2f7] bg-[#f9fafc] p-4">
                            <h3 className="text-[14px] font-semibold text-[#1f2a44]">{card.title}</h3>
                            <p className="text-[12px] text-[#6b7280] mt-1">{card.description}</p>
                            <button
                                type="button"
                                onClick={() => navigate(card.path)}
                                className="mt-3 inline-flex items-center gap-1 text-[12px] text-[#635bff] font-semibold"
                            >
                                {card.cta} <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div>
                    <h2 className="text-[16px] font-semibold text-[#1f2a44]">Eventos disponibles</h2>
                    <p className="text-[13px] text-[#6b7280] mt-1">
                        Activa cada webhook con el selector de la derecha para configurar su endpoint.
                    </p>
                </div>

                <div className="mt-6 space-y-4">
                    {WEBHOOK_OPTIONS.map((option) => {
                        const isEnabled = enabledWebhooks[option.id];
                        const config = configs[option.id];

                        return (
                            <div key={option.id} className="space-y-3">
                                <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-[#f9fafc] px-4 py-3">
                                    <div>
                                        <p className="font-mono text-[13px] font-semibold text-[#32325d]">
                                            {option.id}
                                        </p>
                                        <p className="text-[12px] text-[#6b7280] mt-1">{option.description}</p>
                                    </div>
                                    <Checkbox
                                        checked={isEnabled}
                                        onCheckedChange={(value) => handleToggleWebhook(option.id, Boolean(value))}
                                    />
                                </div>

                                {isEnabled && (
                                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:max-w-3xl">
                                        <h3 className="text-[13px] font-semibold text-[#1f2a44]">Configuración del webhook</h3>
                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                            <div className="md:col-span-2">
                                                <label className="text-[12px] text-[#8a94a7]">Endpoint</label>
                                                <Input
                                                    value={config.endpoint}
                                                    onChange={(event) => handleConfigChange(option.id, 'endpoint', event.target.value)}
                                                    placeholder="https://tu-dominio.com/webhooks"
                                                    className="mt-2 border-gray-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[12px] text-[#8a94a7]">Method</label>
                                                <Select
                                                    value={config.method}
                                                    onValueChange={(value) => handleConfigChange(option.id, 'method', value)}
                                                >
                                                    <SelectTrigger className="mt-2 h-10 rounded-lg border-gray-200">
                                                        <SelectValue placeholder="Selecciona" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="POST">POST</SelectItem>
                                                        <SelectItem value="PUT">PUT</SelectItem>
                                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                                        <SelectItem value="GET">GET</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[12px] text-[#8a94a7]">Body</label>
                                                <Textarea
                                                    value={config.body}
                                                    onChange={(event) => handleConfigChange(option.id, 'body', event.target.value)}
                                                    placeholder='{"event":"{{event.id}}","data":{{event.data}}}'
                                                    className="mt-2 min-h-[120px] border-gray-200 font-mono text-[12px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
