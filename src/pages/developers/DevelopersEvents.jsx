import React, { useMemo, useState } from 'react';
import {
    Search,
    RefreshCcw,
    Braces,
    Clock,
    RotateCcw,
    Copy,
    Plus,
    MoreHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FilterPill = ({ label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
            active
                ? "border-[#635bff] bg-[#635bff] text-white"
                : "border-dashed border-gray-300 bg-white text-[#4f5b76] hover:border-gray-400"
        )}
    >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-400">
            <Plus className="h-3 w-3" />
        </span>
        {label}
    </button>
);

const MockEvents = [
    {
        id: "evt_7Jk2sD",
        type: "payment_link.created",
        created: "2026-02-03 10:30:00",
        status: "success",
        resource: "plink_2s3d4f",
        deliveries: [
            {
                id: "whdl_1",
                status: "success",
                time: "2026-02-03 10:30:02",
                endpoint: "https://hooks.antillapay.com/webhooks",
                response: "200 OK"
            }
        ],
        payload: {
            id: "evt_7Jk2sD",
            object: "event",
            api_version: "2026-01-28.clover",
            created: 1765103400,
            data: {
                object: {
                    id: "plink_2s3d4f",
                    object: "payment_link",
                    active: true,
                    url: "https://buy.antillapay.com/plink_2s3d4f"
                }
            },
            type: "payment_link.created"
        }
    },
    {
        id: "evt_3Kj4mB",
        type: "payment_link.updated",
        created: "2026-02-03 09:15:22",
        status: "success",
        resource: "plink_2s3d4f",
        deliveries: [
            {
                id: "whdl_2",
                status: "success",
                time: "2026-02-03 09:15:24",
                endpoint: "https://hooks.antillapay.com/webhooks",
                response: "200 OK"
            }
        ],
        payload: {
            id: "evt_3Kj4mB",
            object: "event",
            api_version: "2026-01-28.clover",
            created: 1765098922,
            data: {
                object: {
                    id: "plink_2s3d4f",
                    object: "payment_link",
                    active: true,
                    metadata: {
                        source: "dashboard"
                    }
                }
            },
            type: "payment_link.updated"
        }
    },
    {
        id: "evt_2Lp5nA",
        type: "payment.failed",
        created: "2026-02-02 08:45:10",
        status: "failed",
        resource: "pay_9d8f7s",
        deliveries: [
            {
                id: "whdl_3",
                status: "failed",
                time: "2026-02-02 08:45:12",
                endpoint: "https://hooks.antillapay.com/webhooks",
                response: "500 ERR"
            }
        ],
        payload: {
            id: "evt_2Lp5nA",
            object: "event",
            api_version: "2026-01-28.clover",
            created: 1765010710,
            data: {
                object: {
                    id: "pay_9d8f7s",
                    object: "payment",
                    amount: 5000,
                    currency: "cup",
                    status: "failed",
                    failure_code: "insufficient_funds",
                    failure_message: "Saldo insuficiente."
                }
            },
            type: "payment.failed"
        }
    },
    {
        id: "evt_5Xy9zQ",
        type: "transfer.created",
        created: "2026-02-01 14:20:05",
        status: "success",
        resource: "tr_2s3d4f",
        deliveries: [
            {
                id: "whdl_4",
                status: "success",
                time: "2026-02-01 14:20:08",
                endpoint: "https://hooks.antillapay.com/webhooks",
                response: "200 OK"
            }
        ],
        payload: {
            id: "evt_5Xy9zQ",
            object: "event",
            api_version: "2026-01-28.clover",
            created: 1764925205,
            data: {
                object: {
                    id: "tr_2s3d4f",
                    object: "transfer",
                    amount: 8000,
                    currency: "cup",
                    status: "created"
                }
            },
            type: "transfer.created"
        }
    }
];

export default function DevelopersEvents() {
    const [events, setEvents] = useState(MockEvents);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleEventClick = (event) => {
        setSelectedEventId(event.id);
        setIsSheetOpen(true);
    };

    const selectedEvent = useMemo(
        () => events.find((event) => event.id === selectedEventId) || null,
        [events, selectedEventId]
    );

    const filteredEvents = useMemo(() => {
        const term = query.trim().toLowerCase();
        return events.filter((event) => {
            const matchesQuery = !term
                || event.type.toLowerCase().includes(term)
                || event.id.toLowerCase().includes(term)
                || event.resource.toLowerCase().includes(term);
            const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
            return matchesQuery && matchesStatus;
        });
    }, [events, query, statusFilter]);

    const handleCopyId = () => {
        if (!selectedEvent) return;
        if (navigator?.clipboard) {
            navigator.clipboard.writeText(selectedEvent.id);
        }
        toast.success("ID copiado");
    };

    const formatTimestamp = (date = new Date()) => {
        const pad = (value) => String(value).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const handleResend = () => {
        if (!selectedEvent) return;
        const newDelivery = {
            id: `whdl_${Math.random().toString(36).slice(2, 7)}`,
            status: "success",
            time: formatTimestamp(new Date()),
            endpoint: "https://hooks.antillapay.com/webhooks",
            response: "200 OK"
        };
        setEvents((prev) =>
            prev.map((event) =>
                event.id === selectedEvent.id
                    ? { ...event, deliveries: [newDelivery, ...(event.deliveries || [])], status: "success" }
                    : event
            )
        );
        toast.success("Evento reenviado");
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 h-full flex flex-col">
            {/* Header */}
            <div>
                <h1 className="text-[24px] font-bold text-[#32325d] mb-2">Eventos</h1>
                <p className="text-[14px] text-[#697386]">
                    Explora los eventos generados por tu cuenta de AntillaPay en tiempo real.
                </p>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative w-full max-w-[420px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#aab2c4]" />
                    <Input
                        placeholder="Buscar eventos"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="h-9 rounded-full border-gray-200 bg-white pl-10 text-[13px]"
                    />
                </div>
                <Button
                    variant="outline"
                    className="border-gray-200 text-[#32325d] rounded-full"
                    onClick={() => toast.message("Eventos actualizados")}
                >
                    <RefreshCcw className="w-4 h-4 mr-2 text-gray-500" />
                    Actualizar
                </Button>
            </div>

            <div className="relative mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <FilterPill label="Todos" active={statusFilter === "all"} onClick={() => setStatusFilter("all")} />
                    <FilterPill label="Exitosos" active={statusFilter === "success"} onClick={() => setStatusFilter("success")} />
                    <FilterPill label="Fallidos" active={statusFilter === "failed"} onClick={() => setStatusFilter("failed")} />
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[30%]">Tipo</TableHead>
                            <TableHead>Recurso</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead className="w-[56px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEvents.map((evt) => (
                            <TableRow
                                key={evt.id}
                                className="cursor-pointer hover:bg-gray-50/80"
                                onClick={() => handleEventClick(evt)}
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            evt.status === "success" ? "bg-emerald-500" : "bg-red-500"
                                        )} />
                                        <span className="font-mono text-[13px] font-medium text-[#32325d]">
                                            {evt.type}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-[13px] text-[#4f5b76]">
                                    <Badge variant="secondary" className="font-mono text-[11px] bg-gray-100 text-gray-600 hover:bg-gray-200">
                                        {evt.resource}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-[13px] text-[#4f5b76]">
                                    {evt.created}
                                </TableCell>
                                <TableCell className="font-mono text-[11px] text-[#697386]">
                                    {evt.id}
                                </TableCell>
                                <TableCell className="text-right pl-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-500"
                                                onClick={(event) => event.stopPropagation()}
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            <DropdownMenuItem onSelect={() => handleEventClick(evt)}>
                                                Ver detalles
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredEvents.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-[13px] text-[#9aa3b2] py-10">
                                    No hay eventos que coincidan con tu búsqueda.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Detail Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                    {selectedEvent && (
                        <div className="space-y-6">
                            <SheetHeader>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "font-mono border-0",
                                            selectedEvent.status === "success"
                                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                                : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                                        )}
                                    >
                                        {selectedEvent.status === "success" ? "200 OK" : "500 ERR"}
                                    </Badge>
                                    <span className="text-[12px] text-[#697386]">{selectedEvent.created}</span>
                                </div>
                                <SheetTitle className="font-mono text-[18px] break-all">{selectedEvent.type}</SheetTitle>
                                <SheetDescription className="font-mono text-[12px]">
                                    ID: {selectedEvent.id}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1 border-gray-200 rounded-full" onClick={handleResend}>
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reenviar evento
                                </Button>
                                <Button size="sm" variant="outline" className="border-gray-200 rounded-full" onClick={handleCopyId}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copiar ID
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[13px] font-bold text-[#32325d] mb-2 flex items-center gap-2">
                                        <Braces className="w-4 h-4 text-[#635bff]" />
                                        Payload del Evento
                                    </h4>
                                    <div className="bg-slate-950 rounded-lg p-4 font-mono text-[12px] text-slate-300 overflow-x-auto border border-slate-800">
                                        <pre>{JSON.stringify(selectedEvent.payload, null, 2)}</pre>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[13px] font-bold text-[#32325d] mb-2 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#635bff]" />
                                        Intentos de Entrega
                                    </h4>
                                    <div className="space-y-2">
                                        {(selectedEvent.deliveries || []).map((delivery) => (
                                            <div key={delivery.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-[12px] text-[#697386] flex items-center justify-between">
                                                <div>
                                                    <div className="font-mono text-[12px] text-[#32325d]">{delivery.endpoint}</div>
                                                    <div className="text-[11px] text-[#8a94a7]">{delivery.time}</div>
                                                </div>
                                                <Badge variant="outline" className={cn(
                                                    "border-0",
                                                    delivery.status === "success"
                                                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                                        : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                                                )}>
                                                    {delivery.response}
                                                </Badge>
                                            </div>
                                        ))}
                                        {(selectedEvent.deliveries || []).length === 0 && (
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-[12px] text-[#697386]">
                                                Este evento aún no tiene entregas registradas.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
