import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const DEMO_CUSTOMERS = [
    {
        id: "cus_001",
        name: "Mariana Perez",
        email: "mariana@habanamarket.cu",
        createdAt: "2026-01-18",
        type: "Empresa",
        balance: 1240.5,
        status: "Activo"
    },
    {
        id: "cus_002",
        name: "Luis Alvarez",
        email: "luis.alvarez@mail.com",
        createdAt: "2026-01-12",
        type: "Individual",
        balance: 0,
        status: "Nuevo"
    },
    {
        id: "cus_003",
        name: "Caribe Tech Solutions",
        email: "finance@caribetech.io",
        createdAt: "2025-12-28",
        type: "Empresa",
        balance: 560.75,
        status: "Activo"
    },
    {
        id: "cus_004",
        name: "Ariana Nunez",
        email: "ariana.nunez@correo.cu",
        createdAt: "2026-01-05",
        type: "Individual",
        balance: 89.25,
        status: "Moroso"
    },
    {
        id: "cus_005",
        name: "Vega Logistics",
        email: "billing@vegalogistics.com",
        createdAt: "2025-12-15",
        type: "Empresa",
        balance: 2100,
        status: "Activo"
    },
    {
        id: "cus_006",
        name: "Sofia Gomez",
        email: "sofia.gomez@outlook.com",
        createdAt: "2026-01-20",
        type: "Individual",
        balance: 35.9,
        status: "Activo"
    }
];

const DEMO_PAYMENTS = [
    {
        id: "pay_20260120_001",
        email: "sofia.gomez@outlook.com",
        createdAt: "2026-01-20T14:18:00Z",
        amount: 35.9,
        currency: "USD",
        status: "Completado",
        method: "Tarjeta",
        reference: "pm_9f2d31",
        origin: "Payment Link · Suscripción Enero"
    },
    {
        id: "pay_20260118_004",
        email: "mariana@habanamarket.cu",
        createdAt: "2026-01-18T16:05:00Z",
        amount: 240.5,
        currency: "USD",
        status: "Completado",
        method: "Transferencia",
        reference: "pm_3ab1c0",
        origin: "Payment Link · Orden 1042"
    },
    {
        id: "pay_20260111_002",
        email: "luis.alvarez@mail.com",
        createdAt: "2026-01-11T11:22:00Z",
        amount: 58.0,
        currency: "USD",
        status: "Fallido",
        method: "Tarjeta",
        reference: "pm_55d2aa",
        origin: "Payment Link · Plan Básico"
    },
    {
        id: "pay_20260104_006",
        email: "ariana.nunez@correo.cu",
        createdAt: "2026-01-04T09:40:00Z",
        amount: 89.25,
        currency: "USD",
        status: "Reembolsado",
        method: "Tarjeta",
        reference: "pm_1c7b42",
        origin: "Payment Link · Curso Intro"
    },
    {
        id: "pay_20251227_003",
        email: "finance@caribetech.io",
        createdAt: "2025-12-27T19:10:00Z",
        amount: 560.75,
        currency: "USD",
        status: "Completado",
        method: "Transferencia",
        reference: "pm_7ed3b1",
        origin: "Payment Link · Servicio B2B"
    },
    {
        id: "pay_20251214_007",
        email: "billing@vegalogistics.com",
        createdAt: "2025-12-14T13:30:00Z",
        amount: 2100,
        currency: "USD",
        status: "Completado",
        method: "Transferencia",
        reference: "pm_88a9f0",
        origin: "Payment Link · Contrato Logístico"
    }
];

const PAYMENT_STATUS_STYLES = {
    Completado: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Fallido: "bg-rose-50 text-rose-700 border-rose-200",
    Reembolsado: "bg-slate-50 text-slate-700 border-slate-200"
};

const formatDate = (value) => new Date(value).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
});

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
                : "border-dashed border-gray-300 bg-white text-[#4f5b76] hover:border-gray-400"
        )}
    >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-400">
            <Plus className="h-3 w-3" />
        </span>
        {label}
    </button>
);

const FILTERS = [
    { id: "status", label: "Estado" },
    { id: "method", label: "Método" }
];

export default function TransactionsPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("pagos");
    const [payments, setPayments] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [chipFilters, setChipFilters] = useState(() => ({
        status: false,
        method: false
    }));
    const [statusFilter, setStatusFilter] = useState("all");
    const [methodFilter, setMethodFilter] = useState("all");
    const [exportStep, setExportStep] = useState(null);
    const [exportFormat, setExportFormat] = useState("csv");
    const [exportTimezone, setExportTimezone] = useState("GMT-5");
    const [exportRange, setExportRange] = useState("Hoy");
    const [exportCustomStart, setExportCustomStart] = useState("");
    const [exportCustomEnd, setExportCustomEnd] = useState("");
    const [exportCsvContent, setExportCsvContent] = useState("");
    const [exportFilename, setExportFilename] = useState("");
    const [exportMimeType, setExportMimeType] = useState("text/csv;charset=utf-8;");
    const exportTimerRef = useRef(null);

    const exportRangeOptions = [
        "Hoy",
        "Mes en curso",
        "Últimos 7 días",
        "Últimas 4 semanas",
        "Último mes",
        "Todos",
        "Personalizado"
    ];

    const exportColumns = [
        "Cliente",
        "Correo del cliente",
        "ID del cliente",
        "Fecha",
        "Importe",
        "Moneda",
        "Estado",
        "Método",
        "Referencia",
        "Origen"
    ];

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedPayments = window.localStorage.getItem("antillapay_payments");
        if (storedPayments) {
            setPayments(JSON.parse(storedPayments));
        } else {
            window.localStorage.setItem("antillapay_payments", JSON.stringify(DEMO_PAYMENTS));
            setPayments(DEMO_PAYMENTS);
        }

        const storedCustomers = window.localStorage.getItem("antillapay_customers");
        if (storedCustomers) {
            setCustomers(JSON.parse(storedCustomers));
        } else {
            window.localStorage.setItem("antillapay_customers", JSON.stringify(DEMO_CUSTOMERS));
            setCustomers(DEMO_CUSTOMERS);
        }
    }, []);

    const customersByEmail = useMemo(() => {
        const map = new Map();
        customers.forEach((customer) => {
            if (customer?.email) {
                map.set(String(customer.email).toLowerCase(), customer);
            }
        });
        return map;
    }, [customers]);

    const DAY_MS = 24 * 60 * 60 * 1000;

    const getTimezoneOffsetMinutes = (timezone) => (timezone === "UTC" ? 0 : -300);
    const getNowPartsForTimezone = (timezone) => {
        const offsetMinutes = getTimezoneOffsetMinutes(timezone);
        const now = new Date();
        const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
        const tzMs = utcMs + offsetMinutes * 60000;
        const tzDate = new Date(tzMs);
        return {
            year: tzDate.getUTCFullYear(),
            month: tzDate.getUTCMonth(),
            day: tzDate.getUTCDate(),
            hour: tzDate.getUTCHours(),
            minute: tzDate.getUTCMinutes(),
            second: tzDate.getUTCSeconds(),
            ms: tzDate.getUTCMilliseconds()
        };
    };
    const toUtcMsFromTimezone = (year, month, day, hour = 0, minute = 0, second = 0, ms = 0, timezone) => {
        const offsetMinutes = getTimezoneOffsetMinutes(timezone);
        return Date.UTC(year, month, day, hour, minute, second, ms) - offsetMinutes * 60000;
    };
    const parseDateInput = (value) => {
        const [year, month, day] = value.split("-").map(Number);
        return { year, month: month - 1, day };
    };
    const getTodayInputValue = (timezone) => {
        const parts = getNowPartsForTimezone(timezone);
        const month = String(parts.month + 1).padStart(2, "0");
        const day = String(parts.day).padStart(2, "0");
        return `${parts.year}-${month}-${day}`;
    };
    const getExportRangeBounds = () => {
        const nowParts = getNowPartsForTimezone(exportTimezone);
        const todayStartUtcMs = toUtcMsFromTimezone(nowParts.year, nowParts.month, nowParts.day, 0, 0, 0, 0, exportTimezone);
        const nowUtcMs = Date.now();

        switch (exportRange) {
            case "Hoy":
                return { startUtcMs: todayStartUtcMs, endUtcMs: nowUtcMs };
            case "Mes en curso":
                return {
                    startUtcMs: toUtcMsFromTimezone(nowParts.year, nowParts.month, 1, 0, 0, 0, 0, exportTimezone),
                    endUtcMs: nowUtcMs
                };
            case "Últimos 7 días":
                return { startUtcMs: todayStartUtcMs - 6 * DAY_MS, endUtcMs: nowUtcMs };
            case "Últimas 4 semanas":
                return { startUtcMs: todayStartUtcMs - 27 * DAY_MS, endUtcMs: nowUtcMs };
            case "Último mes": {
                let year = nowParts.year;
                let month = nowParts.month - 1;
                if (month < 0) {
                    month = 11;
                    year -= 1;
                }
                const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
                return {
                    startUtcMs: toUtcMsFromTimezone(year, month, 1, 0, 0, 0, 0, exportTimezone),
                    endUtcMs: toUtcMsFromTimezone(year, month, lastDay, 23, 59, 59, 999, exportTimezone)
                };
            }
            case "Todos":
                return { startUtcMs: null, endUtcMs: null };
            case "Personalizado": {
                if (!exportCustomStart || !exportCustomEnd) {
                    return { startUtcMs: null, endUtcMs: null, isInvalid: true };
                }
                const startParts = parseDateInput(exportCustomStart);
                const endParts = parseDateInput(exportCustomEnd);
                let startUtcMs = toUtcMsFromTimezone(startParts.year, startParts.month, startParts.day, 0, 0, 0, 0, exportTimezone);
                let endUtcMs = toUtcMsFromTimezone(endParts.year, endParts.month, endParts.day, 23, 59, 59, 999, exportTimezone);
                const nowUtcMsLimit = Date.now();
                if (endUtcMs > nowUtcMsLimit) {
                    endUtcMs = nowUtcMsLimit;
                }
                if (startUtcMs > endUtcMs) {
                    return { startUtcMs: null, endUtcMs: null, isInvalid: true };
                }
                return { startUtcMs, endUtcMs };
            }
            default:
                return { startUtcMs: null, endUtcMs: null };
        }
    };
    const getExportRangeLabel = (option) => {
        const nowParts = getNowPartsForTimezone(exportTimezone);
        const shiftDays = (parts, days) => {
            const baseMs = Date.UTC(parts.year, parts.month, parts.day) + days * DAY_MS;
            const date = new Date(baseMs);
            return { year: date.getUTCFullYear(), month: date.getUTCMonth(), day: date.getUTCDate() };
        };

        switch (option) {
            case "Hoy":
                return "Hoy";
            case "Mes en curso":
                return `${nowParts.month + 1}/${nowParts.year}`;
            case "Últimos 7 días":
                return "Últimos 7 días";
            case "Últimas 4 semanas":
                return "Últimas 4 semanas";
            case "Último mes":
                const lastMonth = shiftDays(nowParts, -30);
                return `${lastMonth.month + 1}/${lastMonth.year}`;
            case "Todos":
                return "Siempre";
            case "Personalizado": {
                if (!exportCustomStart || !exportCustomEnd) {
                    return "Selecciona fechas";
                }
                const startParts = parseDateInput(exportCustomStart);
                const endParts = parseDateInput(exportCustomEnd);
                const startFormatted = `${startParts.day}/${startParts.month + 1}/${startParts.year}`;
                const endFormatted = `${endParts.day}/${endParts.month + 1}/${endParts.year}`;
                return `${startFormatted} - ${endFormatted}`;
            }
            default:
                return "--";
        }
    };
    const buildSpreadsheetHtml = (headers, rows) => {
        const escapeHtml = (value) => String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
        const headerRow = `<tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>`;
        const bodyRows = rows.map((row) =>
            `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
        ).join("");
        return `<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body><table>${headerRow}${bodyRows}</table></body></html>`;
    };
    const downloadFile = (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };
    const resetExportFlow = () => {
        if (exportTimerRef.current) {
            clearTimeout(exportTimerRef.current);
            exportTimerRef.current = null;
        }
        setExportStep(null);
        setExportCsvContent("");
        setExportFilename("");
        setExportMimeType("text/csv;charset=utf-8;");
    };
    const openExportModal = () => {
        if (exportTimerRef.current) {
            clearTimeout(exportTimerRef.current);
            exportTimerRef.current = null;
        }
        setExportFormat("csv");
        setExportTimezone("GMT-5");
        setExportRange("Hoy");
        setExportCustomStart("");
        setExportCustomEnd("");
        setExportStep("form");
    };
    const handleExport = () => {
        const { startUtcMs, endUtcMs, isInvalid } = getExportRangeBounds();
        if (isInvalid) return;
        setExportStep("loading");
        if (exportTimerRef.current) {
            clearTimeout(exportTimerRef.current);
        }
        exportTimerRef.current = setTimeout(() => {
            const isInRange = (dateValue) => {
                if (startUtcMs == null || endUtcMs == null) return true;
                const date = new Date(dateValue || "");
                if (Number.isNaN(date.getTime())) return false;
                const dateMs = date.getTime();
                return dateMs >= startUtcMs && dateMs <= endUtcMs;
            };
            let csvContent = "";
            let mimeType = "text/csv;charset=utf-8;";
            let rowsCount = 0;

            const paymentRows = filteredPayments.filter((payment) => isInRange(payment.createdAt));
            rowsCount = paymentRows.length;
            if (rowsCount > 0) {
                const header = exportColumns.join(",");
                const body = paymentRows.map((payment) => {
                    const createdAt = new Date(payment.createdAt || "");
                    const createdAtValue = Number.isNaN(createdAt.getTime()) ? "" : createdAt.toISOString();
                    return [
                        payment.customer?.name || "",
                        payment.email || "",
                        payment.customer?.id || "",
                        createdAtValue,
                        payment.amount || "",
                        payment.currency || "",
                        payment.status || "",
                        payment.method || "",
                        payment.reference || "",
                        payment.origin || ""
                    ].map((v) => {
                        const safeValue = v === null || v === undefined ? "" : String(v);
                        if (/[",\n]/.test(safeValue)) {
                            return `"${safeValue.replace(/"/g, "\"\"")}"`;
                        }
                        return safeValue;
                    }).join(",");
                }).join("\n");
                csvContent = `${header}\n${body}`;

                if (exportFormat === "xlsx") {
                    const rows = paymentRows.map((payment) => [
                        payment.customer?.name || "",
                        payment.email || "",
                        payment.customer?.id || "",
                        new Date(payment.createdAt || "").toISOString(),
                        payment.amount || "",
                        payment.currency || "",
                        payment.status || "",
                        payment.method || "",
                        payment.reference || "",
                        payment.origin || ""
                    ]);
                    csvContent = buildSpreadsheetHtml(exportColumns, rows);
                    mimeType = "application/vnd.ms-excel";
                }
            }

            if (rowsCount === 0) {
                setExportStep("empty");
                return;
            }

            const nowParts = getNowPartsForTimezone(exportTimezone);
            const fileDate = `${nowParts.year}-${String(nowParts.month + 1).padStart(2, "0")}-${String(nowParts.day).padStart(2, "0")}`;
            const extension = exportFormat === "xlsx" ? "xlsx" : "csv";
            const filename = `pagos-${fileDate}.${extension}`;
            setExportCsvContent(csvContent);
            setExportFilename(filename);
            setExportMimeType(mimeType);
            setExportStep("success");
            downloadFile(csvContent, filename, mimeType);
        }, 1200);
    };
    const handleExportDownload = () => {
        if (!exportCsvContent) return;
        downloadFile(exportCsvContent, exportFilename || "export.csv", exportMimeType);
    };
    const cancelExportLoading = () => {
        resetExportFlow();
    };

    useEffect(() => {
        if (!exportCustomStart && !exportCustomEnd) return;
        const todayValue = getTodayInputValue(exportTimezone);
        if (exportCustomEnd && exportCustomEnd > todayValue) {
            setExportCustomEnd(todayValue);
        }
        if (exportCustomStart && exportCustomStart > todayValue) {
            setExportCustomStart(todayValue);
        }
    }, [exportTimezone, exportCustomStart, exportCustomEnd]);

    useEffect(() => {
        return () => {
            if (exportTimerRef.current) {
                clearTimeout(exportTimerRef.current);
            }
        };
    }, []);

    const isCustomExportRange = exportRange === "Personalizado";
    const isExportReady = !isCustomExportRange || (exportCustomStart && exportCustomEnd);

    const paymentsWithCustomer = useMemo(() => {
        return payments
            .map((payment) => {
                const emailKey = payment?.email ? String(payment.email).toLowerCase() : "";
                const customer = emailKey ? customersByEmail.get(emailKey) : null;
                return {
                    ...payment,
                    customer
                };
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [customersByEmail, payments]);

    const availableMethods = useMemo(() => {
        const methods = new Set();
        paymentsWithCustomer.forEach((payment) => {
            if (payment?.method) {
                methods.add(payment.method);
            }
        });
        return Array.from(methods).sort((a, b) => String(a).localeCompare(String(b), "es"));
    }, [paymentsWithCustomer]);

    const availableStatuses = useMemo(() => {
        const statuses = new Set();
        paymentsWithCustomer.forEach((payment) => {
            if (payment?.status) {
                statuses.add(payment.status);
            }
        });
        return Array.from(statuses).sort((a, b) => String(a).localeCompare(String(b), "es"));
    }, [paymentsWithCustomer]);

    const handleToggleFilter = (filterId) => {
        setChipFilters((prev) => ({
            ...prev,
            [filterId]: !prev[filterId]
        }));
        if (filterId === "status") {
            setStatusFilter("all");
        }
        if (filterId === "method") {
            setMethodFilter("all");
        }
    };

    const filteredPayments = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return paymentsWithCustomer.filter((payment) => {
            if (chipFilters.status && statusFilter !== "all" && payment.status !== statusFilter) {
                return false;
            }
            if (chipFilters.method && methodFilter !== "all" && payment.method !== methodFilter) {
                return false;
            }

            if (!query) {
                return true;
            }

            const customerName = payment.customer?.name ? String(payment.customer.name).toLowerCase() : "";
            const customerId = payment.customer?.id ? String(payment.customer.id).toLowerCase() : "";
            const email = payment.email ? String(payment.email).toLowerCase() : "";
            const paymentId = payment.id ? String(payment.id).toLowerCase() : "";
            const reference = payment.reference ? String(payment.reference).toLowerCase() : "";
            const origin = payment.origin ? String(payment.origin).toLowerCase() : "";

            return (
                customerName.includes(query) ||
                customerId.includes(query) ||
                email.includes(query) ||
                paymentId.includes(query) ||
                reference.includes(query) ||
                origin.includes(query)
            );
        });
    }, [chipFilters.method, chipFilters.status, methodFilter, paymentsWithCustomer, searchQuery, statusFilter]);

    return (
        <div className="w-full space-y-6">
            <div className="space-y-4">
                <h1 className="text-[28px] font-bold text-[#32325d]">Transacciones</h1>

                <div className="flex items-center gap-6 border-b border-gray-100">
                    <button
                        type="button"
                        onClick={() => setActiveTab("pagos")}
                        className={cn(
                            "pb-3 text-[13px] font-semibold transition-colors",
                            activeTab === "pagos"
                                ? "text-[#635bff] border-b-2 border-[#635bff]"
                                : "text-[#697386] hover:text-[#32325d]"
                        )}
                    >
                        Pagos
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("transferencias")}
                        className={cn(
                            "pb-3 text-[13px] font-semibold transition-colors",
                            activeTab === "transferencias"
                                ? "text-[#635bff] border-b-2 border-[#635bff]"
                                : "text-[#697386] hover:text-[#32325d]"
                        )}
                    >
                        Transferencias
                    </button>
                </div>
            </div>

            {activeTab === "pagos" ? (
                <div className="space-y-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full max-w-[520px]">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab2c4]" />
                            <Input
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Buscar por cliente, email, ID de pago, referencia u origen"
                                className="h-9 rounded-full border-gray-200 bg-white pl-10 text-[13px]"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {FILTERS.map((filter) => (
                            <FilterPill
                                key={filter.id}
                                label={filter.label}
                                active={chipFilters[filter.id]}
                                onClick={() => handleToggleFilter(filter.id)}
                            />
                        ))}
                        {chipFilters.status && (
                            <div className="min-w-[180px]">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="h-8 rounded-full border-gray-200 bg-white text-[12px] [&>svg]:text-[#635bff]">
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los estados</SelectItem>
                                        {availableStatuses.map((status) => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {chipFilters.method && (
                            <div className="min-w-[180px]">
                                <Select value={methodFilter} onValueChange={setMethodFilter}>
                                    <SelectTrigger className="h-8 rounded-full border-gray-200 bg-white text-[12px] [&>svg]:text-[#635bff]">
                                        <SelectValue placeholder="Método" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los métodos</SelectItem>
                                        {availableMethods.map((method) => (
                                            <SelectItem key={method} value={method}>{method}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-[13px] text-[#697386]">
                            Mostrando {filteredPayments.length} pagos
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!filteredPayments.length}
                                onClick={openExportModal}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                            >
                                <Upload className="w-4 h-4 text-[#8792a2]" />
                                Exportar
                            </Button>
                        </div>
                    </div>

                    {filteredPayments.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-[#8792a2]">
                            No se encontraron pagos con los filtros actuales.
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/60">
                                        <TableHead className="px-6 py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Cliente</TableHead>
                                        <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Fecha</TableHead>
                                        <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Importe</TableHead>
                                        <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Moneda</TableHead>
                                        <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Estado</TableHead>
                                        <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Método</TableHead>
                                        <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Referencia</TableHead>
                                        <TableHead className="pr-6 py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Origen</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPayments.map((payment) => {
                                        const customerLabel = payment.customer?.name || payment.email || "—";
                                        const customerId = payment.customer?.id;

                                        return (
                                            <TableRow
                                                key={payment.id}
                                                className="border-b border-gray-100 last:border-b-0"
                                            >
                                                <TableCell className="px-6 py-4">
                                                    <div className="space-y-0.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (!customerId) return;
                                                                navigate(`/dashboard/customers/${customerId}`, { state: { customer: payment.customer } });
                                                            }}
                                                            className={cn(
                                                                "text-left text-[13px] font-semibold",
                                                                customerId
                                                                    ? "text-[#32325d] hover:text-[#635bff]"
                                                                    : "text-[#32325d]"
                                                            )}
                                                        >
                                                            {customerLabel}
                                                        </button>
                                                        <div className="text-[12px] text-[#8792a2]">{payment.email}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 text-[13px] text-[#4f5b76]">
                                                    {formatDate(payment.createdAt)}
                                                </TableCell>
                                                <TableCell className="py-4 text-[13px] font-semibold text-[#32325d]">
                                                    {formatCurrency(payment.amount, payment.currency)}
                                                </TableCell>
                                                <TableCell className="py-4 text-[13px] text-[#4f5b76]">
                                                    {payment.currency}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <span
                                                        className={cn(
                                                            "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                                                            PAYMENT_STATUS_STYLES[payment.status] || "bg-gray-50 text-gray-600 border-gray-200"
                                                        )}
                                                    >
                                                        {payment.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 text-[13px] text-[#4f5b76]">
                                                    {payment.method}
                                                </TableCell>
                                                <TableCell className="py-4 text-[13px] text-[#4f5b76]">
                                                    {payment.reference}
                                                </TableCell>
                                                <TableCell className="pr-6 py-4 text-[13px] text-[#4f5b76]">
                                                    {payment.origin}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-[#8792a2]">
                    Esta pestaña se configurará a continuación.
                </div>
            )}
            {exportStep && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4">
                    {exportStep === "form" && (
                        <div className="w-full max-w-[600px] rounded-2xl bg-white shadow-2xl border border-gray-200">
                            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-[18px] font-semibold text-[#1a1f36]">Exportar pagos</h3>
                                <button
                                    type="button"
                                    onClick={resetExportFlow}
                                    className="rounded-xl border border-transparent p-1.5 text-[#9ca3af] hover:text-[#4b5563]"
                                    aria-label="Cerrar"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="px-6 py-5 space-y-6">
                                <div>
                                    <div className="text-[13px] font-semibold text-[#32325d] mb-2">Formato</div>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="export-format"
                                                value="csv"
                                                checked={exportFormat === "csv"}
                                                onChange={(event) => setExportFormat(event.target.value)}
                                                className="w-4 h-4 text-[#635bff] border-gray-300 focus:ring-[#93c5fd]"
                                            />
                                            <span className="text-[12px] text-[#4f5b76]">CSV</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="export-format"
                                                value="xlsx"
                                                checked={exportFormat === "xlsx"}
                                                onChange={(event) => setExportFormat(event.target.value)}
                                                className="w-4 h-4 text-[#635bff] border-gray-300 focus:ring-[#93c5fd]"
                                            />
                                            <span className="text-[12px] text-[#4f5b76]">Excel (.xlsx)</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[13px] font-semibold text-[#32325d] mb-2">Zona horaria</div>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="export-timezone"
                                                value="GMT-5"
                                                checked={exportTimezone === "GMT-5"}
                                                onChange={(event) => setExportTimezone(event.target.value)}
                                                className="w-4 h-4 text-[#635bff] border-gray-300 focus:ring-[#93c5fd]"
                                            />
                                            <span className="text-[12px] text-[#4f5b76]">GMT-5 (UTC-05:00)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="export-timezone"
                                                value="UTC"
                                                checked={exportTimezone === "UTC"}
                                                onChange={(event) => setExportTimezone(event.target.value)}
                                                className="w-4 h-4 text-[#635bff] border-gray-300 focus:ring-[#93c5fd]"
                                            />
                                            <span className="text-[12px] text-[#4f5b76]">UTC</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[13px] font-semibold text-[#32325d] mb-3">Intervalo de fechas</div>
                                    <div className="space-y-2">
                                        {exportRangeOptions.map((option) => (
                                            <label
                                                key={option}
                                                className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-50 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="export-range"
                                                        value={option}
                                                        checked={exportRange === option}
                                                        onChange={(event) => setExportRange(event.target.value)}
                                                        className="w-4 h-4 text-[#635bff] border-gray-300 focus:ring-[#93c5fd]"
                                                    />
                                                    <span className="text-[13px] text-[#32325d]">{option}</span>
                                                </div>
                                                <span className="text-[12px] text-[#6b7280]">{getExportRangeLabel(option)}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {isCustomExportRange && (
                                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[11px] text-[#6b7280]">Inicio</label>
                                                <input
                                                    type="date"
                                                    value={exportCustomStart}
                                                    max={exportCustomEnd || getTodayInputValue(exportTimezone)}
                                                    onChange={(event) => {
                                                        const nextValue = event.target.value;
                                                        setExportCustomStart(nextValue);
                                                        if (exportCustomEnd && nextValue && nextValue > exportCustomEnd) {
                                                            setExportCustomEnd(nextValue);
                                                        }
                                                    }}
                                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] text-[#6b7280]">Final</label>
                                                <input
                                                    type="date"
                                                    value={exportCustomEnd}
                                                    min={exportCustomStart}
                                                    max={getTodayInputValue(exportTimezone)}
                                                    onChange={(event) => {
                                                        const nextValue = event.target.value;
                                                        setExportCustomEnd(nextValue);
                                                        if (exportCustomStart && nextValue && nextValue < exportCustomStart) {
                                                            setExportCustomStart(nextValue);
                                                        }
                                                    }}
                                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="text-[13px] font-semibold text-[#32325d] mb-2">Columnas</div>
                                    <p className="text-[12px] text-[#6b7280]">{exportColumns.join(", ")}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={resetExportFlow}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-[13px] font-semibold text-[#374151] hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    disabled={!isExportReady}
                                    onClick={handleExport}
                                    className={`rounded-lg px-4 py-2 text-[13px] font-semibold text-white ${isExportReady
                                        ? "bg-[#635bff] hover:bg-[#5851e0]"
                                        : "bg-[#c4c7ff] cursor-not-allowed"
                                        }`}
                                >
                                    Exportar
                                </button>
                            </div>
                        </div>
                    )}

                    {exportStep === "loading" && (
                        <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl border border-gray-200">
                            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-[18px] font-semibold text-[#1a1f36]">Exportar</h3>
                                <button
                                    type="button"
                                    onClick={cancelExportLoading}
                                    className="rounded-xl border border-transparent p-1.5 text-[#9ca3af] hover:text-[#4b5563]"
                                    aria-label="Cerrar"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="px-6 py-10 flex flex-col items-center gap-4">
                                <div className="w-8 h-8 border-2 border-gray-200 border-t-[#635bff] rounded-full animate-spin" />
                                <p className="text-[14px] text-[#6b7280]">Preparando exportación...</p>
                            </div>
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={cancelExportLoading}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-[13px] font-semibold text-[#374151] hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {exportStep === "empty" && (
                        <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl border border-gray-200">
                            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-[18px] font-semibold text-[#1a1f36]">Exportar</h3>
                                <button
                                    type="button"
                                    onClick={resetExportFlow}
                                    className="rounded-xl border border-transparent p-1.5 text-[#9ca3af] hover:text-[#4b5563]"
                                    aria-label="Cerrar"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="px-6 py-6">
                                <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                                    No hemos podido encontrar ningún dato para export según lo que has seleccionado.
                                    Ajusta los filtros y vuelve a intentarlo.
                                </p>
                            </div>
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={resetExportFlow}
                                    className="rounded-lg bg-[#635bff] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#5851e0]"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}

                    {exportStep === "success" && (
                        <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl border border-gray-200">
                            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-[18px] font-semibold text-[#1a1f36]">Exportar</h3>
                                <button
                                    type="button"
                                    onClick={resetExportFlow}
                                    className="rounded-xl border border-transparent p-1.5 text-[#9ca3af] hover:text-[#4b5563]"
                                    aria-label="Cerrar"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="px-6 py-6">
                                <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                                    Tu export ha finalizado. Si no ves el archivo,{" "}
                                    <button
                                        type="button"
                                        onClick={handleExportDownload}
                                        className="text-[#635bff] font-medium hover:underline"
                                    >
                                        puedes intentar descargarlo nuevamente
                                    </button>
                                    .
                                </p>
                            </div>
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={resetExportFlow}
                                    className="rounded-lg bg-[#635bff] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#5851e0]"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
