import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, RefreshCcw, Copy, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const WEBHOOK_LOGS = [
    {
        id: 'whlog_1a9f',
        event: 'payin.completed',
        endpoint: 'https://hooks.cliente.com/webhooks',
        method: 'POST',
        status: 'success',
        statusCode: 200,
        time: '2026-02-05 16:12:03',
        response: '200 OK',
        attempts: 1,
        env: 'live',
        body: '{"event":"payin.completed","data":{"id":"payin_21sd","amount":2500,"currency":"CUP"}}'
    },
    {
        id: 'whlog_2b7d',
        event: 'transfer.received',
        endpoint: 'https://hooks.cliente.com/webhooks',
        method: 'POST',
        status: 'success',
        statusCode: 200,
        time: '2026-02-05 15:48:11',
        response: '200 OK',
        attempts: 1,
        env: 'live',
        body: '{"event":"transfer.received","data":{"id":"tr_9f2k","amount":8000,"currency":"CUP"}}'
    },
    {
        id: 'whlog_3c2a',
        event: 'payin.completed',
        endpoint: 'https://hooks.cliente.com/webhooks',
        method: 'POST',
        status: 'failed',
        statusCode: 500,
        time: '2026-02-05 14:02:55',
        response: '500 ERR',
        attempts: 3,
        env: 'test',
        body: '{"event":"payin.completed","data":{"id":"payin_1x2y","amount":1200,"currency":"CUP"}}'
    }
];

const EVENT_FILTERS = [
    { id: 'all', label: 'Todos' },
    { id: 'payin.completed', label: 'payin.completed' },
    { id: 'transfer.received', label: 'transfer.received' }
];

const STATUS_FILTERS = [
    { id: 'all', label: 'Todos' },
    { id: 'success', label: 'Exitosos' },
    { id: 'error', label: 'Errores' }
];

export default function DevelopersLogs() {
    const [query, setQuery] = useState('');
    const [eventFilter, setEventFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedLog, setSelectedLog] = useState(null);
    const [eventMenuOpen, setEventMenuOpen] = useState(false);
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const eventMenuRef = useRef(null);
    const statusMenuRef = useRef(null);

    const filteredLogs = useMemo(() => {
        const term = query.trim().toLowerCase();
        return WEBHOOK_LOGS.filter((log) => {
            const matchesQuery = !term
                || log.endpoint.toLowerCase().includes(term)
                || log.event.toLowerCase().includes(term)
                || log.id.toLowerCase().includes(term);
            const matchesEvent = eventFilter === 'all' || log.event === eventFilter;
            const matchesStatus = statusFilter === 'all'
                || (statusFilter === 'success' && log.status === 'success')
                || (statusFilter === 'error' && log.status === 'failed');
            return matchesQuery && matchesEvent && matchesStatus;
        });
    }, [query, eventFilter, statusFilter]);

    const handleCopy = (value, label) => {
        if (navigator?.clipboard) {
            navigator.clipboard.writeText(value);
        }
        toast.success(`${label} copiado`);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (eventMenuRef.current && !eventMenuRef.current.contains(event.target)) {
                setEventMenuOpen(false);
            }
            if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
                setStatusMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-[24px] font-bold text-[#32325d] mb-2">Registros</h1>
                <p className="text-[14px] text-[#697386]">
                    Consulta las entregas recientes de webhooks y el estado de cada intento.
                </p>
            </div>

            <div className="space-y-4">
                <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="relative w-full max-w-[420px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#aab2c4]" />
                        <Input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Buscar por evento o endpoint"
                            className="h-9 rounded-lg border-gray-200 bg-white pl-10 text-[13px]"
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="border-gray-200 text-[#32325d] rounded-lg"
                        onClick={() => toast.message('Registros actualizados')}
                    >
                        <RefreshCcw className="w-4 h-4 mr-2 text-gray-500" />
                        Actualizar
                    </Button>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[11px] text-[#8a94a7] uppercase tracking-[0.2em]">Eventos</span>
                        <div ref={eventMenuRef} className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setEventMenuOpen((prev) => !prev);
                                    setStatusMenuOpen(false);
                                }}
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#4f5b76] hover:border-gray-400 transition-colors',
                                    eventMenuOpen && 'border-[#cbd5f5] bg-gray-50'
                                )}
                            >
                                <span className="flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 text-[11px] text-[#8792a2]">
                                    <Plus className="h-3 w-3" />
                                </span>
                                Eventos
                                <span className="text-[#635bff] text-[11px] font-semibold">
                                    {EVENT_FILTERS.find((item) => item.id === eventFilter)?.label}
                                </span>
                                <ChevronDown className="h-3.5 w-3.5 text-[#635bff]" />
                            </button>
                            {eventMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 w-[220px] rounded-xl border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
                                    {EVENT_FILTERS.map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => {
                                                setEventFilter(option.id);
                                                setEventMenuOpen(false);
                                            }}
                                            className={cn(
                                                'w-full px-4 py-2 text-left text-[13px] text-[#32325d] hover:bg-gray-50',
                                                eventFilter === option.id && 'text-[#635bff] font-semibold'
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[11px] text-[#8a94a7] uppercase tracking-[0.2em]">Estado</span>
                        <div ref={statusMenuRef} className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setStatusMenuOpen((prev) => !prev);
                                    setEventMenuOpen(false);
                                }}
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#4f5b76] hover:border-gray-400 transition-colors',
                                    statusMenuOpen && 'border-[#cbd5f5] bg-gray-50'
                                )}
                            >
                                <span className="flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 text-[11px] text-[#8792a2]">
                                    <Plus className="h-3 w-3" />
                                </span>
                                Estado
                                <span className="text-[#635bff] text-[11px] font-semibold">
                                    {STATUS_FILTERS.find((item) => item.id === statusFilter)?.label}
                                </span>
                                <ChevronDown className="h-3.5 w-3.5 text-[#635bff]" />
                            </button>
                            {statusMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 w-[200px] rounded-xl border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
                                    {STATUS_FILTERS.map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => {
                                                setStatusFilter(option.id);
                                                setStatusMenuOpen(false);
                                            }}
                                            className={cn(
                                                'w-full px-4 py-2 text-left text-[13px] text-[#32325d] hover:bg-gray-50',
                                                statusFilter === option.id && 'text-[#635bff] font-semibold'
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-1/5">Evento</TableHead>
                                <TableHead className="w-2/5">Endpoint</TableHead>
                                <TableHead className="w-1/5">Estado</TableHead>
                                <TableHead className="w-1/5">Método</TableHead>
                                <TableHead className="w-1/5 text-right">Fecha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map((log) => (
                                <TableRow
                                    key={log.id}
                                    className="hover:bg-gray-50/50 cursor-pointer"
                                    onClick={() => setSelectedLog(log)}
                                >
                                    <TableCell className="font-mono text-[13px] text-[#32325d]">
                                        {log.event}
                                    </TableCell>
                                    <TableCell className="font-mono text-[12px] text-[#4f5b76] truncate max-w-[260px]">
                                        {log.endpoint}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn(
                                                'shadow-none',
                                                log.status === 'success'
                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                                            )}
                                        >
                                            {log.statusCode}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono bg-white">
                                            {log.method}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-[13px] text-[#697386]">
                                        {log.time}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredLogs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-[13px] text-[#9aa3b2] py-10">
                                        No hay registros que coincidan con tu búsqueda.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Sheet open={Boolean(selectedLog)} onOpenChange={(open) => !open && setSelectedLog(null)}>
                <SheetContent className="w-[400px] sm:w-[520px] overflow-y-auto">
                    {selectedLog && (
                        <div className="space-y-6">
                            <SheetHeader>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'font-mono border-0',
                                            selectedLog.status === 'success'
                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                                                : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                                        )}
                                    >
                                        {selectedLog.statusCode}
                                    </Badge>
                                    <span className="text-[12px] text-[#697386]">{selectedLog.time}</span>
                                </div>
                                <SheetTitle className="font-mono text-[18px] break-all">
                                    {selectedLog.event}
                                </SheetTitle>
                                <SheetDescription className="font-mono text-[12px]">
                                    ID: {selectedLog.id}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 border-gray-200 rounded-lg"
                                    onClick={() => handleCopy(selectedLog.id, 'ID')}
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copiar ID
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 border-gray-200 rounded-lg"
                                    onClick={() => handleCopy(selectedLog.endpoint, 'Endpoint')}
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copiar endpoint
                                </Button>
                            </div>

                            <div className="space-y-2 text-[13px] text-[#4f5b76]">
                                <div className="flex justify-between">
                                    <span>Endpoint</span>
                                    <span className="font-mono text-[#32325d] truncate max-w-[260px]" title={selectedLog.endpoint}>
                                        {selectedLog.endpoint}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Método</span>
                                    <span className="font-mono text-[#32325d]">{selectedLog.method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Entorno</span>
                                    <span className="font-mono text-[#32325d]">{selectedLog.env}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Intentos</span>
                                    <span className="font-mono text-[#32325d]">{selectedLog.attempts}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Respuesta</span>
                                    <span className="font-mono text-[#32325d]">{selectedLog.response}</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[12px] text-[#8a94a7] uppercase tracking-[0.18em]">Body enviado</p>
                                <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-[12px] text-[#32325d] whitespace-pre-wrap">
                                    {selectedLog.body}
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
