import React, { useMemo, useState } from 'react';
import {
    History,
    Search,
    User,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCcw,
    Copy,
    Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MockApiLogs = [
    { id: "req_1a9f", method: "POST", path: "/v1/payment_links", status: 201, time: "2026-02-03 10:30:00", latency: "240ms", ip: "203.0.113.4", env: "live" },
    { id: "req_2b7d", method: "GET", path: "/v1/payment_links", status: 200, time: "2026-02-03 10:29:15", latency: "120ms", ip: "203.0.113.4", env: "live" },
    { id: "req_3c2a", method: "POST", path: "/v1/payments", status: 402, time: "2026-02-03 10:25:00", latency: "310ms", ip: "198.51.100.2", env: "live" },
    { id: "req_4d9e", method: "POST", path: "/v1/payment_links", status: 201, time: "2026-02-03 09:10:00", latency: "280ms", ip: "203.0.113.4", env: "test" },
    { id: "req_5e1c", method: "GET", path: "/v1/events", status: 200, time: "2026-02-03 09:05:00", latency: "85ms", ip: "198.51.100.2", env: "test" },
];

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

export default function DevelopersLogs() {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedLog, setSelectedLog] = useState(null);

    const filteredApiLogs = useMemo(() => {
        const term = query.trim().toLowerCase();
        return MockApiLogs.filter((log) => {
            const matchesQuery = !term
                || log.path.toLowerCase().includes(term)
                || log.method.toLowerCase().includes(term)
                || log.id.toLowerCase().includes(term)
                || log.ip.toLowerCase().includes(term);
            const matchesStatus = statusFilter === "all"
                || (statusFilter === "success" && log.status < 400)
                || (statusFilter === "error" && log.status >= 400);
            return matchesQuery && matchesStatus;
        });
    }, [query, statusFilter]);

    const handleCopy = (value, label) => {
        if (navigator?.clipboard) {
            navigator.clipboard.writeText(value);
        }
        toast.success(`${label} copiado`);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-[24px] font-bold text-[#32325d] mb-2">Registros</h1>
                <p className="text-[14px] text-[#697386]">
                    Supervisa la actividad de tu integración y los cambios en la configuración de tu cuenta.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-gray-200">
                <button
                    className={cn(
                        "px-4 py-2.5 text-[14px] font-medium border-b-2 transition-colors flex items-center gap-2",
                        "border-[#635bff] text-[#635bff]"
                    )}
                >
                    <History className="w-4 h-4" />
                    Logs de API
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="relative w-full max-w-[420px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#aab2c4]" />
                        <Input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Buscar logs de API"
                            className="h-9 rounded-full border-gray-200 bg-white pl-10 text-[13px]"
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="border-gray-200 text-[#32325d] rounded-full"
                        onClick={() => toast.message("Registros actualizados")}
                    >
                        <RefreshCcw className="w-4 h-4 mr-2 text-gray-500" />
                        Actualizar
                    </Button>
                </div>

                <div className="relative mt-2 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <>
                            <FilterPill label="Todos" active={statusFilter === "all"} onClick={() => setStatusFilter("all")} />
                            <FilterPill label="Exitosos" active={statusFilter === "success"} onClick={() => setStatusFilter("success")} />
                            <FilterPill label="Errores" active={statusFilter === "error"} onClick={() => setStatusFilter("error")} />
                        </>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                        <>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead>Método</TableHead>
                                    <TableHead>Ruta</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>IP</TableHead>
                                    <TableHead>Latencia</TableHead>
                                    <TableHead className="text-right">Fecha</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredApiLogs.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelectedLog({ type: "api", data: log })}>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono bg-white">
                                                {log.method}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-[13px] text-[#32325d]">
                                            {log.path}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={cn(
                                                    "shadow-none",
                                                    log.status >= 200 && log.status < 300
                                                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                        : "bg-red-50 text-red-700 hover:bg-red-100"
                                                )}
                                            >
                                                {log.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-[13px] text-[#4f5b76]">
                                            {log.ip}
                                        </TableCell>
                                        <TableCell className="text-[13px] text-[#4f5b76]">
                                            {log.latency}
                                        </TableCell>
                                        <TableCell className="text-right text-[13px] text-[#697386]">
                                            {log.time}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredApiLogs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-[13px] text-[#9aa3b2] py-10">
                                            No hay registros que coincidan con tu búsqueda.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </>
                    </Table>
                </div>
            </div>

            <Sheet open={Boolean(selectedLog)} onOpenChange={(open) => !open && setSelectedLog(null)}>
                <SheetContent className="w-[400px] sm:w-[520px] overflow-y-auto">
                    {selectedLog?.type === "api" && (
                        <div className="space-y-6">
                            <SheetHeader>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "font-mono border-0",
                                            selectedLog.data.status < 400
                                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                                : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                                        )}
                                    >
                                        {selectedLog.data.status}
                                    </Badge>
                                    <span className="text-[12px] text-[#697386]">{selectedLog.data.time}</span>
                                </div>
                                <SheetTitle className="font-mono text-[18px] break-all">{selectedLog.data.method} {selectedLog.data.path}</SheetTitle>
                                <SheetDescription className="font-mono text-[12px]">
                                    ID: {selectedLog.data.id}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1 border-gray-200 rounded-full" onClick={() => handleCopy(selectedLog.data.id, "ID")}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copiar ID
                                </Button>
                                <Button size="sm" variant="outline" className="border-gray-200 rounded-full" onClick={() => handleCopy(selectedLog.data.path, "Ruta")}>
                                    Copiar ruta
                                </Button>
                            </div>

                            <div className="space-y-2 text-[13px] text-[#4f5b76]">
                                <div className="flex justify-between">
                                    <span>IP</span>
                                    <span className="font-mono text-[#32325d]">{selectedLog.data.ip}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Latencia</span>
                                    <span className="font-mono text-[#32325d]">{selectedLog.data.latency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Entorno</span>
                                    <span className="font-mono text-[#32325d]">{selectedLog.data.env}</span>
                                </div>
                            </div>
                        </div>
                    )}

                </SheetContent>
            </Sheet>
        </div>
    );
}
