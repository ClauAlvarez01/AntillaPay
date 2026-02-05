import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";

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

const DEMO_TRANSFER_CHARGES = [
    {
        id: "paytr_20260122_001",
        email: "sofia.gomez@outlook.com",
        createdAt: "2026-01-22T11:05:00Z",
        amount: 49.9,
        currency: "USD",
        status: "Completado",
        method: "Transferencia",
        reference: "trch_1a2b3c",
        origin: "Transferencia · Factura 1001"
    },
    {
        id: "paytr_20260119_002",
        email: "mariana@habanamarket.cu",
        createdAt: "2026-01-19T08:55:00Z",
        amount: 180,
        currency: "USD",
        status: "Completado",
        method: "Transferencia",
        reference: "trch_4d5e6f",
        origin: "Transferencia · Orden 1049"
    },
    {
        id: "paytr_20260108_003",
        email: "luis.alvarez@mail.com",
        createdAt: "2026-01-08T17:20:00Z",
        amount: 75,
        currency: "USD",
        status: "Fallido",
        method: "Transferencia",
        reference: "trch_7g8h9i",
        origin: "Transferencia · Intento 1"
    }
];

const PAYMENT_STATUS_STYLES = {
    Completado: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Fallido: "bg-rose-50 text-rose-700 border-rose-200",
    Reembolsado: "bg-slate-50 text-slate-700 border-slate-200"
};

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
    { id: "created", label: "Fecha de Creación" },
    { id: "status", label: "Estado" }
];

const TRANSFER_FILTERS = [
    { id: "created", label: "Fecha de Creación" },
    { id: "status", label: "Estado" }
];

export default function TransactionsPage() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("cobros_banco");
    const [payments, setPayments] = useState([]);
    const [transferCharges, setTransferCharges] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [transfers, setTransfers] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [chipFilters, setChipFilters] = useState(() => ({
        created: false,
        status: false
    }));
    const [statusFilter, setStatusFilter] = useState("all");
    const [createdDate, setCreatedDate] = useState(undefined);
    const [isCreatedCalendarOpen, setIsCreatedCalendarOpen] = useState(false);

    const [transferSearchQuery, setTransferSearchQuery] = useState("");
    const [transferChipFilters, setTransferChipFilters] = useState(() => ({
        created: false,
        status: false
    }));
    const [transferStatusFilter, setTransferStatusFilter] = useState("all");
    const [transferCreatedDate, setTransferCreatedDate] = useState(undefined);
    const [isTransferCreatedCalendarOpen, setIsTransferCreatedCalendarOpen] = useState(false);

    const [selectedTransfer, setSelectedTransfer] = useState(null);
    const [isTransferDetailModalOpen, setIsTransferDetailModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewMessage, setReviewMessage] = useState("");

    const [exportStep, setExportStep] = useState(null);
    const [exportType, setExportType] = useState("payments");
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

    const exportColumnsByType = {
        payments: [
            "Cliente",
            "Correo del cliente",
            "ID del cliente",
            "Fecha",
            "Importe",
            "Moneda",
            "Estado"
        ],
        transferCharges: [
            "Cliente",
            "Correo del cliente",
            "ID del cliente",
            "Fecha",
            "Importe",
            "Moneda",
            "Estado"
        ],
        transfers: [
            "Fecha",
            "Importe",
            "Estado",
            "Correo"
        ]
    };

    const exportColumns = exportColumnsByType[exportType] || exportColumnsByType.payments;

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
            day: tzDate.getUTCDate()
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
                const startUtcMs = toUtcMsFromTimezone(startParts.year, startParts.month, startParts.day, 0, 0, 0, 0, exportTimezone);
                const endUtcMs = toUtcMsFromTimezone(endParts.year, endParts.month, endParts.day, 23, 59, 59, 999, exportTimezone);
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
        switch (option) {
            case "Todos":
                return "Siempre";
            case "Personalizado":
                return exportCustomStart && exportCustomEnd ? "Personalizado" : "Selecciona fechas";
            default:
                return option;
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

    const openTransferDetails = (transfer) => {
        setSelectedTransfer(transfer);
        setIsTransferDetailModalOpen(true);
    };

    const handleCopyTransferId = async (transfer) => {
        if (!transfer?.id) return;
        const text = transfer.id;

        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
    };

    const getStatusTone = (status) => {
        if (status === "pendiente" || status === "procesando") return "pendiente";
        if (status === "fallida") return "fallida";
        return "completada";
    };

    const getStatusLabel = (status) => {
        const labels = {
            completada: "Completada",
            pendiente: "Pendiente",
            procesando: "Procesando",
            fallida: "Fallida"
        };
        return labels[status] || status;
    };

    const buildTransferReceiptPdf = (transfer) => {
        const safe = (value) => String(value ?? "").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\\/g, "\\\\");
        const lines = [
            "%PDF-1.3",
            "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
            "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
            "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
            "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj"
        ];

        const textLines = [
            "AntillaPay - Comprobante de transferencia",
            `ID de payout: ${transfer?.id || "--"}`,
            `Estado: ${transfer?.status || "--"}`,
            `Fecha: ${transfer?.date ? new Date(transfer.date).toISOString() : "--"}`,
            `Importe: ${transfer?.amount ?? "--"} ${transfer?.currency || "USD"}`,
            `Cuenta destino: ${transfer?.destination || "--"}`
        ];

        let contentStream = "BT\n/F1 12 Tf\n72 740 Td\n";
        textLines.forEach((line, idx) => {
            if (idx === 0) {
                contentStream += `(${safe(line)}) Tj\n`;
                contentStream += "0 -24 Td\n";
                return;
            }
            contentStream += `(${safe(line)}) Tj\n`;
            contentStream += "0 -18 Td\n";
        });
        contentStream += "ET";

        const streamBytes = new TextEncoder().encode(contentStream).length;
        const contentObj = `4 0 obj << /Length ${streamBytes} >> stream\n${contentStream}\nendstream endobj`;
        lines.splice(4, 0, contentObj);

        let offset = 0;
        const offsets = [];
        const fullParts = [];
        lines.forEach((part) => {
            offsets.push(offset);
            fullParts.push(part + "\n");
            offset += new TextEncoder().encode(part + "\n").length;
        });

        const xrefStart = offset;
        const xref = [
            "xref",
            "0 6",
            "0000000000 65535 f ",
            ...offsets.map((value) => String(value).padStart(10, "0") + " 00000 n ")
        ].join("\n");
        const trailer = [
            "trailer << /Size 6 /Root 1 0 R >>",
            "startxref",
            String(xrefStart),
            "%%EOF"
        ].join("\n");

        return fullParts.join("") + xref + "\n" + trailer;
    };

    const handleDownloadTransferReceipt = (transfer) => {
        if (!transfer) return;
        const pdfContent = buildTransferReceiptPdf(transfer);
        const blob = new Blob([pdfContent], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `comprobante-${transfer.id || "transfer"}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const openReviewRequest = (transfer) => {
        setSelectedTransfer(transfer);
        setReviewMessage("");
        setIsReviewModalOpen(true);
    };

    const handleSendReviewRequest = () => {
        setIsReviewModalOpen(false);
        setReviewMessage("");
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
    const openExportModal = (type = "payments") => {
        if (exportTimerRef.current) {
            clearTimeout(exportTimerRef.current);
            exportTimerRef.current = null;
        }
        setExportType(type);
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

            const escapeCsv = (v) => {
                const safeValue = v === null || v === undefined ? "" : String(v);
                if (/[",\n]/.test(safeValue)) {
                    return `"${safeValue.replace(/"/g, "\"\"")}"`;
                }
                return safeValue;
            };

            let rowsCount = 0;
            let content = "";
            let mimeType = "text/csv;charset=utf-8;";
            let filenamePrefix = "export";

            if (exportType === "transfers") {
                const transferRows = filteredTransfers.filter((transfer) => isInRange(transfer.date || transfer.createdAt));
                rowsCount = transferRows.length;
                filenamePrefix = "transferencias";

                if (rowsCount === 0) {
                    setExportStep("empty");
                    return;
                }

                if (exportFormat === "xlsx") {
                    const rows = transferRows.map((transfer) => [
                        new Date(transfer.date || transfer.createdAt || "").toISOString(),
                        transfer.amount ?? "",
                        transfer.status || "",
                        transfer.email || ""
                    ]);
                    content = buildSpreadsheetHtml(exportColumns, rows);
                    mimeType = "application/vnd.ms-excel";
                } else {
                    const header = exportColumns.map(escapeCsv).join(",");
                    const body = transferRows.map((transfer) => [
                        new Date(transfer.date || transfer.createdAt || "").toISOString(),
                        transfer.amount ?? "",
                        transfer.status || "",
                        transfer.email || ""
                    ].map(escapeCsv).join(",")).join("\n");
                    content = `${header}\n${body}`;
                }
            } else if (exportType === "transferCharges") {
                const paymentRows = filteredTransferCharges.filter((payment) => isInRange(payment.createdAt));
                rowsCount = paymentRows.length;
                filenamePrefix = "cobros-transferencias";

                if (rowsCount === 0) {
                    setExportStep("empty");
                    return;
                }

                if (exportFormat === "xlsx") {
                    const rows = paymentRows.map((payment) => [
                        payment.customer?.name || "",
                        payment.email || "",
                        payment.customer?.id || "",
                        new Date(payment.createdAt || "").toISOString(),
                        payment.amount ?? "",
                        payment.currency || "",
                        payment.status || ""
                    ]);
                    content = buildSpreadsheetHtml(exportColumns, rows);
                    mimeType = "application/vnd.ms-excel";
                } else {
                    const header = exportColumns.map(escapeCsv).join(",");
                    const body = paymentRows.map((payment) => [
                        payment.customer?.name || "",
                        payment.email || "",
                        payment.customer?.id || "",
                        new Date(payment.createdAt || "").toISOString(),
                        payment.amount ?? "",
                        payment.currency || "",
                        payment.status || ""
                    ].map(escapeCsv).join(",")).join("\n");
                    content = `${header}\n${body}`;
                }
            } else {
                const paymentRows = filteredPayments.filter((payment) => isInRange(payment.createdAt));
                rowsCount = paymentRows.length;
                filenamePrefix = "cobros-cuenta-bancaria";

                if (rowsCount === 0) {
                    setExportStep("empty");
                    return;
                }

                if (exportFormat === "xlsx") {
                    const rows = paymentRows.map((payment) => [
                        payment.customer?.name || "",
                        payment.email || "",
                        payment.customer?.id || "",
                        new Date(payment.createdAt || "").toISOString(),
                        payment.amount ?? "",
                        payment.currency || "",
                        payment.status || ""
                    ]);
                    content = buildSpreadsheetHtml(exportColumns, rows);
                    mimeType = "application/vnd.ms-excel";
                } else {
                    const header = exportColumns.map(escapeCsv).join(",");
                    const body = paymentRows.map((payment) => [
                        payment.customer?.name || "",
                        payment.email || "",
                        payment.customer?.id || "",
                        new Date(payment.createdAt || "").toISOString(),
                        payment.amount ?? "",
                        payment.currency || "",
                        payment.status || ""
                    ].map(escapeCsv).join(",")).join("\n");
                    content = `${header}\n${body}`;
                }
            }

            const nowParts = getNowPartsForTimezone(exportTimezone);
            const fileDate = `${nowParts.year}-${String(nowParts.month + 1).padStart(2, "0")}-${String(nowParts.day).padStart(2, "0")}`;
            const extension = exportFormat === "xlsx" ? "xlsx" : "csv";
            const filename = `${filenamePrefix}-${fileDate}.${extension}`;

            setExportCsvContent(content);
            setExportFilename(filename);
            setExportMimeType(mimeType);
            setExportStep("success");
            downloadFile(content, filename, mimeType);
        }, 900);
    };
    const handleExportDownload = () => {
        if (!exportCsvContent) return;
        downloadFile(exportCsvContent, exportFilename || "export.csv", exportMimeType);
    };
    const cancelExportLoading = () => {
        resetExportFlow();
    };

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
        return () => {
            if (exportTimerRef.current) {
                clearTimeout(exportTimerRef.current);
            }
        };
    }, []);

    const isCustomExportRange = exportRange === "Personalizado";
    const isExportReady = !isCustomExportRange || (exportCustomStart && exportCustomEnd);

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

    const handleToggleTransferFilter = (filterId) => {
        if (filterId === "created") {
            setTransferChipFilters((prev) => {
                const nextValue = !prev[filterId];
                if (!nextValue) {
                    setTransferCreatedDate(undefined);
                    setIsTransferCreatedCalendarOpen(false);
                } else {
                    setIsTransferCreatedCalendarOpen(true);
                }
                return {
                    ...prev,
                    [filterId]: nextValue
                };
            });
            return;
        }
        setTransferChipFilters((prev) => ({
            ...prev,
            [filterId]: !prev[filterId]
        }));
        if (filterId === "status") {
            setTransferStatusFilter("all");
        }
    };

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedPayments = window.localStorage.getItem("antillapay_payments");
        if (storedPayments) {
            setPayments(JSON.parse(storedPayments));
        } else {
            window.localStorage.setItem("antillapay_payments", JSON.stringify(DEMO_PAYMENTS));
            setPayments(DEMO_PAYMENTS);
        }

        const storedTransferCharges = window.localStorage.getItem("antillapay_transfer_charges");
        if (storedTransferCharges) {
            setTransferCharges(JSON.parse(storedTransferCharges));
        } else {
            window.localStorage.setItem("antillapay_transfer_charges", JSON.stringify(DEMO_TRANSFER_CHARGES));
            setTransferCharges(DEMO_TRANSFER_CHARGES);
        }

        const storedCustomers = window.localStorage.getItem("antillapay_customers");
        if (storedCustomers) {
            setCustomers(JSON.parse(storedCustomers));
        } else {
            window.localStorage.setItem("antillapay_customers", JSON.stringify(DEMO_CUSTOMERS));
            setCustomers(DEMO_CUSTOMERS);
        }

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

    const customersByEmail = useMemo(() => {
        const map = new Map();
        customers.forEach((customer) => {
            if (customer?.email) {
                map.set(String(customer.email).toLowerCase(), customer);
            }
        });
        return map;
    }, [customers]);

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

    const transferChargesWithCustomer = useMemo(() => {
        return transferCharges
            .map((payment) => {
                const emailKey = payment?.email ? String(payment.email).toLowerCase() : "";
                const customer = emailKey ? customersByEmail.get(emailKey) : null;
                return {
                    ...payment,
                    customer
                };
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [customersByEmail, transferCharges]);

    const availableStatuses = useMemo(() => {
        const statuses = new Set();
        paymentsWithCustomer.forEach((payment) => {
            if (payment?.status) {
                statuses.add(payment.status);
            }
        });
        return Array.from(statuses).sort((a, b) => String(a).localeCompare(String(b), "es"));
    }, [paymentsWithCustomer]);

    const availableTransferChargeStatuses = useMemo(() => {
        const statuses = new Set();
        transferChargesWithCustomer.forEach((payment) => {
            if (payment?.status) {
                statuses.add(payment.status);
            }
        });
        return Array.from(statuses).sort((a, b) => String(a).localeCompare(String(b), "es"));
    }, [transferChargesWithCustomer]);

    const availableTransferStatuses = useMemo(() => {
        const statuses = new Set();
        transfers.forEach((transfer) => {
            if (transfer?.status) {
                statuses.add(transfer.status);
            }
        });
        return Array.from(statuses).sort((a, b) => String(a).localeCompare(String(b), "es"));
    }, [transfers]);

    const filteredPayments = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const selectedDate = createdDate ? new Date(createdDate) : null;
        if (selectedDate) selectedDate.setHours(0, 0, 0, 0);

        return paymentsWithCustomer
            .filter((payment) => {
                if (chipFilters.status && statusFilter !== "all" && payment.status !== statusFilter) {
                    return false;
                }

                if (!query) {
                    return true;
                }

                const customerName = payment.customer?.name ? String(payment.customer.name).toLowerCase() : "";
                const customerId = payment.customer?.id ? String(payment.customer.id).toLowerCase() : "";
                const email = payment.email ? String(payment.email).toLowerCase() : "";
                const paymentId = payment.id ? String(payment.id).toLowerCase() : "";

                return (
                    customerName.includes(query) ||
                    customerId.includes(query) ||
                    email.includes(query) ||
                    paymentId.includes(query)
                );
            })
            .filter((payment) => {
                if (!chipFilters.created || !selectedDate) {
                    return true;
                }
                const createdAt = new Date(payment.createdAt);
                if (Number.isNaN(createdAt.getTime())) return false;
                const createdAtStart = new Date(createdAt);
                createdAtStart.setHours(0, 0, 0, 0);
                return createdAtStart.getTime() === selectedDate.getTime();
            });
    }, [chipFilters.created, chipFilters.status, createdDate, paymentsWithCustomer, searchQuery, statusFilter]);

    const filteredTransferCharges = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const selectedDate = createdDate ? new Date(createdDate) : null;
        if (selectedDate) selectedDate.setHours(0, 0, 0, 0);

        return transferChargesWithCustomer
            .filter((payment) => {
                if (chipFilters.status && statusFilter !== "all" && payment.status !== statusFilter) {
                    return false;
                }

                if (!query) {
                    return true;
                }

                const customerName = payment.customer?.name ? String(payment.customer.name).toLowerCase() : "";
                const customerId = payment.customer?.id ? String(payment.customer.id).toLowerCase() : "";
                const email = payment.email ? String(payment.email).toLowerCase() : "";
                const paymentId = payment.id ? String(payment.id).toLowerCase() : "";

                return (
                    customerName.includes(query) ||
                    customerId.includes(query) ||
                    email.includes(query) ||
                    paymentId.includes(query)
                );
            })
            .filter((payment) => {
                if (!chipFilters.created || !selectedDate) {
                    return true;
                }
                const createdAt = new Date(payment.createdAt);
                if (Number.isNaN(createdAt.getTime())) return false;
                const createdAtStart = new Date(createdAt);
                createdAtStart.setHours(0, 0, 0, 0);
                return createdAtStart.getTime() === selectedDate.getTime();
            });
    }, [chipFilters.created, chipFilters.status, createdDate, searchQuery, statusFilter, transferChargesWithCustomer]);

    const filteredTransfers = useMemo(() => {
        const query = transferSearchQuery.trim().toLowerCase();
        const selectedDate = transferCreatedDate ? new Date(transferCreatedDate) : null;
        if (selectedDate) selectedDate.setHours(0, 0, 0, 0);

        return transfers
            .filter((transfer) => {
                const matchesQuery = !query
                    || String(transfer.id || "").toLowerCase().includes(query)
                    || String(transfer.destination || "").toLowerCase().includes(query);

                const matchesStatus = transferStatusFilter === "all" || transfer.status === transferStatusFilter;

                return matchesQuery && matchesStatus;
            })
            .filter((transfer) => {
                if (!transferChipFilters.created || !selectedDate) {
                    return true;
                }
                const createdAt = new Date(transfer.createdAt || transfer.date);
                if (Number.isNaN(createdAt.getTime())) return false;
                const createdAtStart = new Date(createdAt);
                createdAtStart.setHours(0, 0, 0, 0);
                return createdAtStart.getTime() === selectedDate.getTime();
            })
            .sort((a, b) => new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime());
    }, [transferChipFilters.created, transferSearchQuery, transferStatusFilter, transferCreatedDate, transfers]);

    return (
        <div className="w-full space-y-6">
            <div className="space-y-4">
                <h1 className="text-[28px] font-bold text-[#32325d]">Transacciones</h1>

                <div className="flex items-center gap-6 border-b border-gray-100">
                    <button
                        type="button"
                        onClick={() => setActiveTab("cobros_banco")}
                        className={cn(
                            "pb-3 text-[13px] font-semibold transition-colors",
                            activeTab === "cobros_banco"
                                ? "text-[#635bff] border-b-2 border-[#635bff]"
                                : "text-[#697386] hover:text-[#32325d]"
                        )}
                    >
                        Cobros por cuenta bancaria
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("cobros_transferencias")}
                        className={cn(
                            "pb-3 text-[13px] font-semibold transition-colors",
                            activeTab === "cobros_transferencias"
                                ? "text-[#635bff] border-b-2 border-[#635bff]"
                                : "text-[#697386] hover:text-[#32325d]"
                        )}
                    >
                        Cobros por transferencia
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("transferencias_salida")}
                        className={cn(
                            "pb-3 text-[13px] font-semibold transition-colors",
                            activeTab === "transferencias_salida"
                                ? "text-[#635bff] border-b-2 border-[#635bff]"
                                : "text-[#697386] hover:text-[#32325d]"
                        )}
                    >
                        Transferencias de salida
                    </button>
                </div>
            </div>

            {activeTab !== "transferencias_salida" ? (
                <>
                    <div className="space-y-6">
                        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="relative w-full max-w-[520px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab2c4]" />
                                <Input
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Buscar por cliente, email o ID"
                                    className="h-9 rounded-full border-gray-200 bg-white pl-10 text-[13px]"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex flex-wrap items-center gap-2">
                                {FILTERS.map((filter) => (
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
                                    <div className="min-w-[180px]">
                                        <Select value={statusFilter === "all" ? "" : statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="h-8 rounded-full border-gray-200 bg-white text-[12px] [&>svg]:text-[#635bff]">
                                                <SelectValue placeholder="Seleccione Estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(activeTab === "cobros_transferencias" ? availableTransferChargeStatuses : availableStatuses).map((status) => (
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
                                Mostrando {activeTab === "cobros_transferencias" ? filteredTransferCharges.length : filteredPayments.length} cobros
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={activeTab === "cobros_transferencias" ? !filteredTransferCharges.length : !filteredPayments.length}
                                    onClick={() => openExportModal(activeTab === "cobros_transferencias" ? "transferCharges" : "payments")}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                                >
                                    <Upload className="w-4 h-4 text-[#8792a2]" />
                                    Exportar
                                </Button>
                            </div>
                        </div>

                        {(activeTab === "cobros_transferencias" ? filteredTransferCharges.length : filteredPayments.length) === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-[#8792a2]">
                                No se encontraron cobros con los filtros actuales.
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
                                                <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Moneda</TableHead>
                                                <TableHead className="pr-6 py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Estado</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(activeTab === "cobros_transferencias" ? filteredTransferCharges : filteredPayments).map((payment) => {
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
                                                        <TableCell className="pr-6 py-4">
                                                            <span
                                                                className={cn(
                                                                    "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                                                                    PAYMENT_STATUS_STYLES[payment.status] || "bg-gray-50 text-gray-600 border-gray-200"
                                                                )}
                                                            >
                                                                {payment.status}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="space-y-6">
                        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="relative w-full max-w-[520px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab2c4]" />
                                <Input
                                    value={transferSearchQuery}
                                    onChange={(event) => setTransferSearchQuery(event.target.value)}
                                    placeholder="Buscar por cliente o ID"
                                    className="h-9 rounded-full border-gray-200 bg-white pl-10 text-[13px]"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex flex-wrap items-center gap-2">
                                {TRANSFER_FILTERS.map((filter) => (
                                    <FilterPill
                                        key={filter.id}
                                        label={filter.label}
                                        active={transferChipFilters[filter.id]}
                                        onClick={() => handleToggleTransferFilter(filter.id)}
                                    />
                                ))}
                                {transferChipFilters.created && transferCreatedDate && (
                                    <span className="text-[12px] font-semibold text-[#635bff] ml-1">
                                        {new Date(transferCreatedDate).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </span>
                                )}

                                {transferChipFilters.status && (
                                    <div className="min-w-[200px]">
                                        <Select value={transferStatusFilter === "all" ? "" : transferStatusFilter} onValueChange={setTransferStatusFilter}>
                                            <SelectTrigger className="h-8 rounded-full border-gray-200 bg-white text-[12px] [&>svg]:text-[#635bff]">
                                                <SelectValue placeholder="Seleccione Estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableTransferStatuses.map((status) => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                            </div>

                            {isTransferCreatedCalendarOpen && (
                                <div className="absolute left-0 top-full mt-2 z-20">
                                    <Calendar
                                        mode="single"
                                        selected={transferCreatedDate}
                                        onSelect={(date) => {
                                            setTransferCreatedDate(date);
                                            if (date) {
                                                setIsTransferCreatedCalendarOpen(false);
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
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={!filteredTransfers.length}
                                    onClick={() => openExportModal("transfers")}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                                >
                                    <Upload className="w-4 h-4 text-[#8792a2]" />
                                    Exportar
                                </Button>
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
                                                                "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold",
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
                </>
            )}
            <Dialog open={isTransferDetailModalOpen} onOpenChange={setIsTransferDetailModalOpen}>
                <DialogContent className="w-[95%] sm:max-w-[560px] rounded-3xl p-0 max-h-[85vh] overflow-y-auto border-none shadow-2xl [&>button]:hidden">
                    {selectedTransfer && (
                        <div className="p-8 space-y-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-[20px] font-bold text-[#32325d]">Detalle del payout</h2>
                                    <p className="text-[13px] text-[#8792a2]">Consulta el estado y trazabilidad del payout.</p>
                                </div>
                                <button onClick={() => setIsTransferDetailModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">ID del payout</span>
                                        <div className="text-[14px] font-semibold text-[#32325d]">{selectedTransfer.id}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Estado</span>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "w-fit text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full",
                                                TRANSFER_STATUS_STYLES[selectedTransfer.status] || "bg-gray-50 text-gray-600 border-gray-200"
                                            )}
                                        >
                                            {getStatusLabel(selectedTransfer.status)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Fecha de Creación</span>
                                        <div className="text-[14px] text-[#32325d]">{formatDate(selectedTransfer.createdAt)}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Ejecucion</span>
                                        <div className="text-[14px] text-[#32325d]">{formatDate(selectedTransfer.executedAt)}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Fallo</span>
                                        <div className="text-[14px] text-[#32325d]">{formatDate(selectedTransfer.failedAt)}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Monto bruto</span>
                                        <div className="text-[16px] font-semibold text-[#32325d]">
                                            {formatCurrency(selectedTransfer.grossAmount ?? selectedTransfer.amount, selectedTransfer.currency || "USD")}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Monto neto</span>
                                        <div className="text-[16px] font-semibold text-[#32325d]">
                                            {formatCurrency(selectedTransfer.netAmount ?? selectedTransfer.amount, selectedTransfer.currency || "USD")}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Cuenta destino</span>
                                    <div className="text-[14px] text-[#32325d]">{selectedTransfer.destination}</div>
                                </div>

                                {getStatusTone(selectedTransfer.status) === "fallida" && (
                                    <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 space-y-3">
                                        <div className="text-[12px] font-semibold uppercase tracking-wider text-rose-600">Fallo detectado</div>
                                        <div className="space-y-2">
                                            <div className="text-[13px] text-[#32325d] font-semibold">Motivo del fallo</div>
                                            <div className="text-[13px] text-rose-600">{selectedTransfer.failureReason || "Motivo no disponible por el momento."}</div>
                                        </div>
                                        <div className="space-y-1 text-[12px] text-[#4f5b76]">
                                            <div className="font-semibold text-[#32325d]">Que puedes hacer</div>
                                            <div>• Verificar que la cuenta destino siga activa.</div>
                                            <div>• Confirmar que los datos bancarios sean correctos.</div>
                                            <div>• Intentar nuevamente mas tarde si hay mantenimiento bancario.</div>
                                        </div>
                                        <Button
                                            onClick={() => openReviewRequest(selectedTransfer)}
                                            className="h-9 px-4 rounded-lg bg-white border border-rose-200 text-rose-600 text-[13px] font-semibold hover:bg-rose-50"
                                        >
                                            Solicitar revision
                                        </Button>
                                    </div>
                                )}

                                {selectedTransfer.failureReason && getStatusTone(selectedTransfer.status) !== "fallida" && (
                                    <div className="space-y-1">
                                        <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Motivo del fallo</span>
                                        <div className="text-[14px] text-rose-600">{selectedTransfer.failureReason}</div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                                <Button
                                    onClick={() => setIsTransferDetailModalOpen(false)}
                                    variant="outline"
                                    className="h-10 px-6 rounded-lg font-semibold text-[#4f5b76]"
                                >
                                    Cerrar
                                </Button>
                                {getStatusTone(selectedTransfer.status) === "completada" && (
                                    <Button
                                        onClick={() => handleDownloadTransferReceipt(selectedTransfer)}
                                        className="h-10 px-6 rounded-lg bg-[#635bff] hover:bg-[#5851e0] text-white font-bold"
                                    >
                                        Descargar comprobante
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogContent className="w-[95%] sm:max-w-[520px] rounded-3xl p-0 max-h-[85vh] overflow-y-auto border-none shadow-2xl [&>button]:hidden">
                    <div className="p-8 space-y-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-[20px] font-bold text-[#32325d]">Solicitar revision</h2>
                                <p className="text-[13px] text-[#8792a2]">
                                    Esto no reintenta la transferencia. Nuestro equipo revisara el fallo y te contactara si necesita informacion.
                                </p>
                            </div>
                            <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[12px] font-semibold text-[#4f5b76]">Asunto</label>
                                <div className="h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center text-[13px] text-[#32325d]">
                                    {selectedTransfer ? `Payout fallido - ID ${selectedTransfer.id}` : "Payout fallido"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-semibold text-[#4f5b76]">Describe brevemente el problema</label>
                                <textarea
                                    value={reviewMessage}
                                    onChange={(e) => setReviewMessage(e.target.value)}
                                    rows={4}
                                    placeholder="Ej. El banco indica que la cuenta esta activa, pero el payout fallo."
                                    className="w-full rounded-xl border border-gray-200 p-3 text-[13px] text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#635bff]/10 focus:border-[#635bff]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f7f9fc] px-8 py-6 flex items-center justify-end gap-3">
                        <Button
                            onClick={() => setIsReviewModalOpen(false)}
                            variant="outline"
                            className="h-10 px-6 rounded-lg font-semibold text-[#4f5b76]"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSendReviewRequest}
                            disabled={!selectedTransfer}
                            className="h-10 px-6 rounded-lg bg-[#635bff] hover:bg-[#5851e0] text-white font-bold"
                        >
                            Enviar solicitud
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            {exportStep && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4">
                    {exportStep === "form" && (
                        <div className="w-full max-w-[600px] rounded-2xl bg-white shadow-2xl border border-gray-200">
                            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-[18px] font-semibold text-[#1a1f36]">
                                    {exportType === "transfers"
                                        ? "Exportar transferencias de salida"
                                        : exportType === "transferCharges"
                                            ? "Exportar cobros por transferencias"
                                            : "Exportar cobros por cuenta bancaria"}
                                </h3>
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
