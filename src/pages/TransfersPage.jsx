import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import TransferModal from "@/components/transfers/TransferModal";

const DEMO_TRANSFERS = [
    {
        id: "tr_001",
        email: "finance@caribetech.io",
        amount: 450.0,
        grossAmount: 455.0,
        netAmount: 450.0,
        currency: "USD",
        status: "completada",
        date: "2026-01-15T10:30:00Z",
        createdAt: "2026-01-14T12:10:00Z",
        executedAt: "2026-01-15T10:30:00Z",
        failedAt: null,
        destination: "Banco Metropolitano ****4567",
        failureReason: null
    },
    {
        id: "tr_002",
        email: "mariana@habanamarket.cu",
        amount: 120.5,
        grossAmount: 120.5,
        netAmount: 120.5,
        currency: "USD",
        status: "pendiente",
        date: "2026-01-20T14:45:00Z",
        createdAt: "2026-01-20T14:45:00Z",
        executedAt: null,
        failedAt: null,
        destination: "Banco de Crédito ****8821",
        failureReason: null
    },
    {
        id: "tr_003",
        email: "luis.alvarez@mail.com",
        amount: 890.0,
        grossAmount: 890.0,
        netAmount: 880.0,
        currency: "USD",
        status: "fallida",
        date: "2026-01-10T09:15:00Z",
        createdAt: "2026-01-09T16:40:00Z",
        executedAt: null,
        failedAt: "2026-01-10T09:15:00Z",
        destination: "Banco Metropolitano ****4567",
        failureReason: "Cuenta destino rechazada por el banco receptor."
    }
];

const TRANSFER_STATUS_STYLES = {
    completada: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pendiente: "bg-amber-50 text-amber-700 border-amber-200",
    fallida: "bg-rose-50 text-rose-700 border-rose-200"
};

const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const formatCurrency = (value, currency = "USD") => `${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})} ${currency}`;

const FilterPill = ({ label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
            active
                ? "border-[#635bff] bg-[#635bff] text-white"
                : "border-gray-300 bg-white text-[#4f5b76] hover:border-gray-400"
        )}
    >
        <span className="flex h-5 w-5 items-center justify-center rounded-lg border border-gray-400">
            <Plus className="h-3 w-3" />
        </span>
        {label}
    </button>
);

const TRANSFER_FILTERS = [
    { id: "created", label: "Fecha de Creación" },
    { id: "status", label: "Estado" }
];

export default function TransfersPage() {
    const [transfers, setTransfers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [chipFilters, setChipFilters] = useState(() => ({
        created: false,
        status: false
    }));
    const [statusFilter, setStatusFilter] = useState("all");
    const [createdDate, setCreatedDate] = useState(undefined);
    const [isCreatedCalendarOpen, setIsCreatedCalendarOpen] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);

    const loadTransfersFromStorage = () => {
        if (typeof window === "undefined") return;

        const storedTransfers = window.localStorage.getItem("antillapay_transfers");
        if (storedTransfers) {
            const parsed = JSON.parse(storedTransfers);
            const emailsById = new Map(DEMO_TRANSFERS.map((transfer) => [transfer.id, transfer.email]));
            const normalized = (Array.isArray(parsed) ? parsed : []).map((transfer) => {
                if (!transfer || typeof transfer !== "object") return transfer;
                if (transfer.email) return transfer;
                const fallback = emailsById.get(transfer.id);
                return {
                    ...transfer,
                    email: fallback || `user+${String(transfer.id || "transfer")}@example.com`
                };
            });
            window.localStorage.setItem("antillapay_transfers", JSON.stringify(normalized));
            setTransfers(normalized);
        } else {
            window.localStorage.setItem("antillapay_transfers", JSON.stringify(DEMO_TRANSFERS));
            setTransfers(DEMO_TRANSFERS);
        }
    };

    useEffect(() => {
        loadTransfersFromStorage();
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleTransfersUpdated = () => {
            loadTransfersFromStorage();
        };

        window.addEventListener("antillapay_transfers_updated", handleTransfersUpdated);
        return () => {
            window.removeEventListener("antillapay_transfers_updated", handleTransfersUpdated);
        };
    }, []);

    const availableStatuses = useMemo(() => {
        const statuses = new Set();
        transfers.forEach((transfer) => {
            if (transfer?.status) {
                statuses.add(transfer.status);
            }
        });
        return Array.from(statuses).sort((a, b) => String(a).localeCompare(String(b), "es"));
    }, [transfers]);

    const filteredTransfers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const selectedDate = createdDate ? new Date(createdDate) : null;
        if (selectedDate) selectedDate.setHours(0, 0, 0, 0);

        return transfers
            .filter((transfer) => {
                const matchesQuery = !query
                    || String(transfer.id || "").toLowerCase().includes(query)
                    || String(transfer.email || "").toLowerCase().includes(query)
                    || String(transfer.destination || "").toLowerCase().includes(query);

                const matchesStatus = statusFilter === "all" || transfer.status === statusFilter;

                return matchesQuery && matchesStatus;
            })
            .filter((transfer) => {
                if (!chipFilters.created || !selectedDate) return true;
                const createdAtDate = new Date(transfer.createdAt || transfer.date || "");
                if (Number.isNaN(createdAtDate.getTime())) return false;
                const createdAtStart = new Date(createdAtDate);
                createdAtStart.setHours(0, 0, 0, 0);
                return createdAtStart.getTime() === selectedDate.getTime();
            })
            .sort((a, b) => new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime());
    }, [chipFilters.created, searchQuery, statusFilter, createdDate, transfers]);

    const handleToggleFilter = (filterId) => {
        if (filterId === "created") {
            setChipFilters((prev) => {
                const nextValue = !prev[filterId];
                if (!nextValue) {
                    setCreatedDate(undefined);
                    setIsCreatedCalendarOpen(false);
                } else {
                    setIsCreatedCalendarOpen(true);
                }
                return {
                    ...prev,
                    [filterId]: nextValue
                };
            });
            return;
        }
        setChipFilters((prev) => ({
            ...prev,
            [filterId]: !prev[filterId]
        }));
        if (filterId === "status") {
            setStatusFilter("all");
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-[28px] font-bold text-[#32325d]">Transferencias</h1>
                <button
                    type="button"
                    onClick={() => setShowTransferModal(true)}
                    className="bg-[#635bff] hover:bg-[#5851e0] text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    Crear transferencia
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-lg bg-white/20 text-[11px] font-semibold">
                        N
                    </span>
                </button>
            </div>

            <div className="space-y-6">
                <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full max-w-[520px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab2c4]" />
                        <Input
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Buscar por cliente o ID"
                            className="h-9 rounded-lg border-gray-200 bg-white pl-10 text-[13px]"
                        />
                    </div>
                </div>

                <div className="relative">
                    <div className="flex flex-wrap items-center gap-2">
                        {TRANSFER_FILTERS.map((filter) => (
                            <FilterPill
                                key={filter.id}
                                label={filter.label}
                                active={chipFilters[filter.id]}
                                onClick={() => handleToggleFilter(filter.id)}
                            />
                        ))}
                        {chipFilters.created && createdDate && (
                            <span className="text-[12px] font-semibold text-[#635bff] ml-1">
                                {new Date(createdDate).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </span>
                        )}

                        {chipFilters.status && (
                            <div className="min-w-[200px]">
                                <Select value={statusFilter === "all" ? "" : statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="h-8 rounded-lg border-gray-200 bg-white text-[12px] [&>svg]:text-[#635bff]">
                                        <SelectValue placeholder="Seleccione Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableStatuses.map((status) => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {isCreatedCalendarOpen && (
                        <div className="absolute left-0 top-full mt-2 z-20">
                            <Calendar
                                mode="single"
                                selected={createdDate}
                                onSelect={(date) => {
                                    setCreatedDate(date);
                                    if (date) {
                                        setIsCreatedCalendarOpen(false);
                                    }
                                }}
                                className="rounded-2xl border border-gray-200 bg-white shadow-xl"
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-[13px] text-[#697386]">
                        Mostrando {filteredTransfers.length} transferencias de salida
                    </div>
                </div>

                {filteredTransfers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-[#8792a2]">
                        No se encontraron transferencias de salida con los filtros actuales.
                    </div>
                ) : (
                    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/60">
                                        <TableHead className="px-6 py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Cliente</TableHead>
                                        <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Fecha</TableHead>
                                        <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Importe</TableHead>
                                        <TableHead className="pr-6 py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransfers.map((transfer) => (
                                        <TableRow key={transfer.id} className="border-b border-gray-100 last:border-b-0">
                                            <TableCell className="px-6 py-4">
                                                <div className="text-[13px] font-semibold text-[#32325d]">{transfer.email}</div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-[13px] text-[#4f5b76]">
                                                {formatDate(transfer.date)}
                                            </TableCell>
                                            <TableCell className="py-4 text-[13px] font-semibold text-[#32325d]">
                                                {formatCurrency(transfer.amount, transfer.currency || "USD")}
                                            </TableCell>
                                            <TableCell className="pr-6 py-4">
                                                <span
                                                    className={cn(
                                                        "inline-flex rounded-lg border px-2 py-0.5 text-[11px] font-semibold",
                                                        TRANSFER_STATUS_STYLES[transfer.status] || "bg-gray-50 text-gray-600 border-gray-200"
                                                    )}
                                                >
                                                    {transfer.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </div>

            <TransferModal
                open={showTransferModal}
                onOpenChange={setShowTransferModal}
            />
        </div>
    );
}
