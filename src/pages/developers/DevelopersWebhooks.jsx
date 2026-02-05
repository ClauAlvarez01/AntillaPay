import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MoreHorizontal,
    XCircle,
    ExternalLink,
    ChevronDown,
    ChevronRight,
    Search,
    Info,
    ArrowRight,
    ArrowLeft,
    Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const API_VERSIONS = [
    '2026-01-28.clover',
    '2025-06-30.basil'
];

const EVENT_GROUPS = [
    {
        id: 'payment_link',
        title: 'Payment Link',
        events: [
            {
                id: 'payment_link.created',
                description: 'Occurs when a payment link is created.'
            },
            {
                id: 'payment_link.updated',
                description: 'Occurs when a payment link is updated.'
            }
        ]
    },
    {
        id: 'account',
        title: 'Account',
        events: [
            {
                id: 'account.external_account.created',
                description: 'Occurs whenever an external account is created.'
            },
            {
                id: 'account.external_account.deleted',
                description: 'Occurs whenever an external account is deleted.'
            },
            {
                id: 'account.external_account.updated',
                description: 'Occurs whenever an external account is updated.'
            },
            {
                id: 'account.updated',
                description: 'Occurs whenever an account status or property has changed.'
            }
        ]
    },
    {
        id: 'transfer',
        title: 'Transfer',
        events: [
            {
                id: 'transfer.created',
                description: 'Occurs whenever a transfer is created.'
            },
            {
                id: 'transfer.reversed',
                description: 'Occurs whenever a transfer is reversed, including partial reversals.'
            },
            {
                id: 'transfer.updated',
                description: "Occurs whenever a transfer's description or metadata is updated."
            }
        ]
    },
    {
        id: 'account_link_v2',
        title: 'Account Link',
        tag: 'v2',
        events: [
            {
                id: 'v2.core.account_link.returned',
                description: 'Occurs when the generated AccountLink is completed.'
            }
        ]
    },
    {
        id: 'account_person_v2',
        title: 'Account Person',
        tag: 'v2',
        events: [
            {
                id: 'v2.core.account_person.created',
                description: 'Occurs when a Person is created.'
            },
            {
                id: 'v2.core.account_person.deleted',
                description: 'Occurs when a Person is deleted.'
            },
            {
                id: 'v2.core.account_person.updated',
                description: 'Occurs when a Person is updated.'
            }
        ]
    },
    {
        id: 'account_v2',
        title: 'Account',
        tag: 'v2',
        events: [
            {
                id: 'v2.core.account.closed',
                description: 'This event occurs when an account is closed.'
            },
            {
                id: 'v2.core.account.created',
                description: 'Occurs when an Account is created.'
            },
            {
                id: 'v2.core.account.updated',
                description: 'Occurs when an Account is updated.'
            },
            {
                id: 'v2.core.account[configuration.customer].capability_status_updated',
                description: "Occurs when the status of an Account's customer configuration capability is updated."
            },
            {
                id: 'v2.core.account[configuration.customer].updated',
                description: "Occurs when an Account's customer configuration is updated."
            },
            {
                id: 'v2.core.account[configuration.merchant].capability_status_updated',
                description: "Occurs when the status of an Account's merchant configuration capability is updated."
            },
            {
                id: 'v2.core.account[configuration.merchant].updated',
                description: "Occurs when an Account's merchant configuration is updated."
            },
            {
                id: 'v2.core.account[configuration.recipient].capability_status_updated',
                description: "Occurs when the status of an Account's recipient configuration capability is updated."
            },
            {
                id: 'v2.core.account[configuration.recipient].updated',
                description: "Occurs when a Recipient's configuration is updated."
            },
            {
                id: 'v2.core.account[defaults].updated',
                description: 'This event occurs when account defaults are created or updated.'
            },
            {
                id: 'v2.core.account[future_requirements].updated',
                description: "Occurs when an Account's future requirements are updated."
            },
            {
                id: 'v2.core.account[identity].updated',
                description: 'Occurs when an Identity is updated.'
            },
            {
                id: 'v2.core.account[requirements].updated',
                description: "Occurs when an Account's requirements are updated."
            }
        ]
    }
];

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

const INITIAL_ENDPOINT = {
    id: 'we_antillapay_default',
    name: 'Endpoint administrado por AntillaPay',
    url: 'https://hooks.antillapay.com/webhooks',
    status: 'enabled',
    events: ['payment_link.created', 'payment_link.updated'],
    version: '2026-01-28.clover',
    mode: 'live'
};

const INITIAL_DELIVERIES = [
    {
        id: 'evt_1',
        endpoint: 'https://hooks.antillapay.com/webhooks',
        type: 'payment_link.created',
        status: 'success',
        time: '2026-02-02 10:30:00',
        response: '200 OK'
    },
    {
        id: 'evt_2',
        endpoint: 'https://hooks.antillapay.com/webhooks',
        type: 'transfer.updated',
        status: 'success',
        time: '2026-02-02 10:28:15',
        response: '200 OK'
    },
    {
        id: 'evt_3',
        endpoint: 'https://hooks.antillapay.com/webhooks',
        type: 'account.updated',
        status: 'failed',
        time: '2026-02-02 09:15:00',
        response: '500 ERR'
    }
];

export default function DevelopersWebhooks() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('endpoints');
    const [endpoint, setEndpoint] = useState(INITIAL_ENDPOINT);
    const [deliveries] = useState(INITIAL_DELIVERIES);
    const [isConfigView, setIsConfigView] = useState(false);
    const [eventSearch, setEventSearch] = useState('');
    const [eventTab, setEventTab] = useState('all');
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState(() => EVENT_GROUPS.map((group) => group.id));
    const [apiVersion, setApiVersion] = useState(INITIAL_ENDPOINT.version);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [deliveryDetails, setDeliveryDetails] = useState(null);

    const allEventIds = useMemo(() => EVENT_GROUPS.flatMap((group) => group.events.map((event) => event.id)), []);

    const totalSelected = selectedEvents.length;
    const allSelected = totalSelected === allEventIds.length && allEventIds.length > 0;

    const filteredGroups = useMemo(() => {
        const term = eventSearch.trim().toLowerCase();
        const applyFilter = (event) => {
            if (!term) return true;
            return event.id.toLowerCase().includes(term) || event.description.toLowerCase().includes(term);
        };

        if (eventTab === 'selected') {
            return EVENT_GROUPS.map((group) => {
                const events = group.events.filter((event) => selectedEvents.includes(event.id)).filter(applyFilter);
                return { ...group, events };
            }).filter((group) => group.events.length > 0);
        }

        return EVENT_GROUPS.map((group) => {
            const events = group.events.filter(applyFilter);
            return { ...group, events };
        }).filter((group) => group.events.length > 0);
    }, [eventSearch, eventTab, selectedEvents]);

    const toggleEvent = (eventId) => {
        setSelectedEvents((prev) =>
            prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
        );
    };

    const toggleGroup = (groupIds, value) => {
        setSelectedEvents((prev) => {
            if (value) {
                const next = new Set(prev);
                groupIds.forEach((id) => next.add(id));
                return Array.from(next);
            }
            return prev.filter((id) => !groupIds.includes(id));
        });
    };

    const toggleAll = (value) => {
        if (value) {
            setSelectedEvents(allEventIds);
        } else {
            setSelectedEvents([]);
        }
    };

    const toggleGroupExpand = (groupId) => {
        setExpandedGroups((prev) =>
            prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
        );
    };

    const openEventView = () => {
        const currentEvents = endpoint.events.includes('*') ? allEventIds : endpoint.events;
        setSelectedEvents(currentEvents);
        setEventSearch('');
        setEventTab('all');
        setExpandedGroups(EVENT_GROUPS.map((group) => group.id));
        setIsConfigView(true);
    };

    const handleSaveEvents = () => {
        if (totalSelected === 0) {
            toast.error('Selecciona al menos un evento para continuar');
            return;
        }
        const nextEvents = totalSelected === allEventIds.length ? ['*'] : selectedEvents;
        setEndpoint((prev) => ({
            ...prev,
            events: nextEvents,
            version: apiVersion
        }));
        toast.success('Eventos actualizados');
        setIsConfigView(false);
    };

    const handleToggleStatus = () => {
        setEndpoint((prev) => ({
            ...prev,
            status: prev.status === 'enabled' ? 'disabled' : 'enabled'
        }));
        toast.message(endpoint.status === 'enabled' ? 'Endpoint deshabilitado' : 'Endpoint habilitado');
    };

    const selectedSummary = totalSelected === 0
        ? 'Ningún evento seleccionado'
        : totalSelected === allEventIds.length
            ? 'Todos los eventos'
            : `${totalSelected} eventos`;

    if (isConfigView) {
        return (
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-wrap items-center gap-4">
                    <Button variant="ghost" className="text-[#635bff]" onClick={() => setIsConfigView(false)}>
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </Button>
                    <div>
                        <h1 className="text-[22px] font-bold text-[#32325d]">Elegir eventos</h1>
                        <p className="text-[13px] text-[#697386]">Selecciona los eventos que AntillaPay enviará.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[12px] text-[#8a94a7] uppercase tracking-[0.2em]">Eventos de</p>
                                    <div className="mt-3 rounded-2xl border border-[#635bff] bg-[#f5f4ff] p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-[#1f2a44]">Tu cuenta</p>
                                                <p className="text-[12px] text-[#6b7280]">Recibe eventos de los recursos de esta cuenta.</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-[#635bff]" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[12px] text-[#8a94a7] uppercase tracking-[0.2em]">Versión de API</label>
                                    <select
                                        value={apiVersion}
                                        onChange={(event) => setApiVersion(event.target.value)}
                                        className="mt-2 w-full md:w-[260px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#32325d]"
                                    >
                                        {API_VERSIONS.map((version) => (
                                            <option key={version} value={version}>{version}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-5 space-y-5">
                            <div className="flex items-center gap-6 border-b border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setEventTab('all')}
                                    className={cn(
                                        'py-2 text-[13px] font-semibold border-b-2',
                                        eventTab === 'all' ? 'border-[#635bff] text-[#635bff]' : 'border-transparent text-[#7b869a]'
                                    )}
                                >
                                    Todos los eventos
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEventTab('selected')}
                                    className={cn(
                                        'py-2 text-[13px] font-semibold border-b-2 flex items-center gap-2',
                                        eventTab === 'selected' ? 'border-[#635bff] text-[#635bff]' : 'border-transparent text-[#7b869a]'
                                    )}
                                >
                                    Eventos elegidos
                                    <span className="rounded-full bg-gray-100 text-[11px] px-2 py-0.5 text-[#4b5563]">
                                        {totalSelected}
                                    </span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Buscar evento por nombre o descripción..."
                                        value={eventSearch}
                                        onChange={(event) => setEventSearch(event.target.value)}
                                        className="pl-9 bg-white border-gray-200"
                                    />
                                </div>

                                <div className="flex items-center gap-3 text-[13px] text-[#4f5b76]">
                                    <Checkbox
                                        checked={allSelected ? true : totalSelected > 0 ? 'indeterminate' : false}
                                        onCheckedChange={(value) => toggleAll(Boolean(value))}
                                    />
                                    <span className="font-semibold text-[#1f2a44]">Selecciona todo</span>
                                    <Info className="w-4 h-4 text-[#a0a7b8]" />
                                </div>

                                <div className="max-h-[360px] overflow-y-auto pr-2 space-y-4">
                                    {filteredGroups.map((group) => {
                                        const groupIds = group.events.map((event) => event.id);
                                        const selectedCount = groupIds.filter((id) => selectedEvents.includes(id)).length;
                                        const groupAll = selectedCount === groupIds.length && groupIds.length > 0;
                                        const groupIndeterminate = selectedCount > 0 && !groupAll;
                                        const isExpanded = expandedGroups.includes(group.id);

                                        return (
                                            <div key={group.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleGroupExpand(group.id)}
                                                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-left"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {isExpanded ? (
                                                            <ChevronDown className="w-4 h-4 text-[#6b7280]" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4 text-[#6b7280]" />
                                                        )}
                                                        <span className="font-semibold text-[#32325d]">{group.title}</span>
                                                        {group.tag && (
                                                            <Badge variant="secondary" className="text-[10px]">{group.tag}</Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-[12px] text-[#7b869a]">{group.events.length} eventos</span>
                                                </button>
                                                {isExpanded && (
                                                    <div className="px-4 py-3 space-y-3">
                                                        <div className="flex items-center gap-3 text-[13px] text-[#4f5b76]">
                                                            <Checkbox
                                                                checked={groupAll ? true : groupIndeterminate ? 'indeterminate' : false}
                                                                onCheckedChange={(value) => toggleGroup(groupIds, Boolean(value))}
                                                            />
                                                            <span className="font-semibold text-[#1f2a44]">Elegir todos los eventos de {group.title}</span>
                                                        </div>
                                                        {group.events.map((event) => (
                                                            <div key={event.id} className="flex items-start gap-3">
                                                                <Checkbox
                                                                    checked={selectedEvents.includes(event.id)}
                                                                    onCheckedChange={() => toggleEvent(event.id)}
                                                                />
                                                                <div>
                                                                    <p className="font-mono text-[13px] font-semibold text-[#1f2a44]">{event.id}</p>
                                                                    <p className="text-[12px] text-[#6b7280]">{event.description}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {filteredGroups.length === 0 && (
                                        <div className="text-center text-[12px] text-[#9aa3b2] py-6">
                                            No hay eventos que coincidan con tu búsqueda.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-[#f9fafc] p-4">
                                <p className="text-[12px] text-[#8a94a7] uppercase tracking-[0.2em]">Resumen</p>
                                <div className="mt-3 text-[13px] text-[#4f5b76] space-y-2">
                                    <div className="flex justify-between">
                                        <span>Eventos de</span>
                                        <span className="font-semibold text-[#1f2a44]">Tu cuenta</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Versión de API</span>
                                        <span className="font-semibold text-[#1f2a44]">{apiVersion}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Escuchando a</span>
                                        <span className="font-semibold text-[#1f2a44]">{selectedSummary}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setIsConfigView(false)}
                                className="text-[13px] text-[#635bff] font-semibold"
                            >
                                Cancelar
                            </button>
                            <Button className="bg-[#635bff] hover:bg-[#5851e0]" onClick={handleSaveEvents}>
                                Guardar selección
                            </Button>
                        </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-[24px] font-bold text-[#32325d]">Webhooks</h1>
                    <p className="text-[14px] text-[#697386]">
                        Configura qué eventos quieres recibir en AntillaPay.
                    </p>
                </div>
                <Button className="bg-[#635bff] hover:bg-[#5851e0] text-white" onClick={openEventView}>
                    Configurar eventos
                </Button>
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
                                Para el MVP, AntillaPay envía los eventos a un endpoint administrado por la plataforma.
                                Aquí puedes elegir qué eventos deseas recibir.
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

            <section className="space-y-4">
                <div className="flex items-center border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('endpoints')}
                        className={cn(
                            'px-4 py-2.5 text-[14px] font-medium border-b-2 transition-colors',
                            activeTab === 'endpoints'
                                ? 'border-[#635bff] text-[#635bff]'
                                : 'border-transparent text-[#697386] hover:text-[#32325d]'
                        )}
                    >
                        Endpoint
                    </button>
                    <button
                        onClick={() => setActiveTab('deliveries')}
                        className={cn(
                            'px-4 py-2.5 text-[14px] font-medium border-b-2 transition-colors',
                            activeTab === 'deliveries'
                                ? 'border-[#635bff] text-[#635bff]'
                                : 'border-transparent text-[#697386] hover:text-[#32325d]'
                        )}
                    >
                        Entregas recientes
                    </button>
                </div>

                {activeTab === 'endpoints' && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead>Endpoint</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Eventos</TableHead>
                                    <TableHead>Versión</TableHead>
                                    <TableHead>Modo</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-[#32325d]">{endpoint.name}</span>
                                            <span className="text-[11px] text-[#697386] font-mono truncate max-w-[260px]">{endpoint.url}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                'border-0',
                                                endpoint.status === 'enabled'
                                                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                                                    : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20'
                                            )}
                                        >
                                            {endpoint.status === 'enabled' ? 'Habilitado' : 'Deshabilitado'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {endpoint.events.includes('*') ? (
                                            <Badge variant="secondary">Todos los eventos</Badge>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {endpoint.events.slice(0, 2).map((event) => (
                                                    <Badge key={event} variant="outline" className="font-mono text-[10px] bg-gray-50">
                                                        {event}
                                                    </Badge>
                                                ))}
                                                {endpoint.events.length > 2 && (
                                                    <Badge variant="outline" className="text-[10px] bg-gray-50">
                                                        +{endpoint.events.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-[13px] text-[#4f5b76]">{endpoint.version}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="uppercase text-[10px]">
                                            {endpoint.mode}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className={endpoint.status === 'enabled' ? 'text-red-600' : undefined}
                                                    onClick={handleToggleStatus}
                                                >
                                                    {endpoint.status === 'enabled' ? 'Deshabilitar' : 'Activar'}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                )}

                {activeTab === 'deliveries' && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Evento</TableHead>
                                    <TableHead>Endpoint</TableHead>
                                    <TableHead>Fecha</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deliveries.map((delivery) => (
                                    <TableRow key={delivery.id}>
                                        <TableCell>
                                            {delivery.status === 'success' && (
                                                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 shadow-none">200 OK</Badge>
                                            )}
                                            {delivery.status === 'failed' && (
                                                <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 shadow-none">500 Err</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-mono text-[13px] font-medium text-[#32325d]">{delivery.type}</div>
                                            <div className="text-[11px] text-[#697386]">{delivery.id}</div>
                                        </TableCell>
                                        <TableCell className="text-[13px] text-[#4f5b76] max-w-[200px] truncate" title={delivery.endpoint}>
                                            {delivery.endpoint}
                                        </TableCell>
                                        <TableCell className="text-[13px] text-[#4f5b76]">{delivery.time}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </section>

            <Dialog open={detailsOpen} onOpenChange={(open) => setDetailsOpen(open)}>
                <DialogContent className="w-[95%] sm:max-w-[520px] rounded-2xl p-0 border border-gray-200 [&>button]:hidden">
                    <div>
                        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-[16px] font-semibold text-[#1f2a44]">Detalle del endpoint</h3>
                                <p className="text-[12px] text-[#6b7280] mt-1">{endpoint.name}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDetailsOpen(false)}
                                className="text-[#9aa3b2] hover:text-[#4b5563]"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-3">
                            <div>
                                <p className="text-[12px] text-[#8a94a7]">URL</p>
                                <p className="text-[13px] text-[#1f2a44] font-mono">{endpoint.url}</p>
                            </div>
                            <div>
                                <p className="text-[12px] text-[#8a94a7]">Eventos</p>
                                <p className="text-[13px] text-[#1f2a44]">
                                    {endpoint.events.includes('*') ? 'Todos los eventos' : endpoint.events.join(', ')}
                                </p>
                            </div>
                            <div>
                                <p className="text-[12px] text-[#8a94a7]">Modo</p>
                                <p className="text-[13px] text-[#1f2a44] uppercase">{endpoint.mode}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(deliveryDetails)} onOpenChange={(open) => !open && setDeliveryDetails(null)}>
                <DialogContent className="w-[95%] sm:max-w-[520px] rounded-2xl p-0 border border-gray-200 [&>button]:hidden">
                    {deliveryDetails && (
                        <div>
                            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                                <div>
                                    <h3 className="text-[16px] font-semibold text-[#1f2a44]">Entrega del webhook</h3>
                                    <p className="text-[12px] text-[#6b7280] mt-1">{deliveryDetails.type}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setDeliveryDetails(null)}
                                    className="text-[#9aa3b2] hover:text-[#4b5563]"
                                >
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="px-6 py-5 space-y-3">
                                <div>
                                    <p className="text-[12px] text-[#8a94a7]">Endpoint</p>
                                    <p className="text-[13px] text-[#1f2a44] font-mono">{deliveryDetails.endpoint}</p>
                                </div>
                                <div>
                                    <p className="text-[12px] text-[#8a94a7]">Respuesta</p>
                                    <p className="text-[13px] text-[#1f2a44]">{deliveryDetails.response}</p>
                                </div>
                                <div>
                                    <p className="text-[12px] text-[#8a94a7]">Fecha</p>
                                    <p className="text-[13px] text-[#1f2a44]">{deliveryDetails.time}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
