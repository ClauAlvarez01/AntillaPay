import React, { useState } from "react";
import {
    ArrowLeftRight,
    Clipboard,
    Banknote,
    Check,
    ChevronDown,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    ExternalLink,
    FileText,
    HelpCircle,
    Info,
    MoreHorizontal,
    Plus,
    Upload,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createPageUrl } from "@/utils";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const INITIAL_TRANSFERS = [
    {
        id: "tr_001",
        amount: 450.00,
        grossAmount: 455.00,
        netAmount: 450.00,
        status: "completada",
        date: "2026-01-15T10:30:00Z",
        createdAt: "2026-01-14T12:10:00Z",
        executedAt: "2026-01-15T10:30:00Z",
        failedAt: null,
        destination: "Banco Metropolitano ****4567",
        type: "Manual",
        failureReason: null
    },
    {
        id: "tr_002",
        amount: 120.50,
        grossAmount: 120.50,
        netAmount: 120.50,
        status: "pendiente",
        date: "2026-01-20T14:45:00Z",
        createdAt: "2026-01-20T14:45:00Z",
        executedAt: null,
        failedAt: null,
        destination: "Banco de Crédito ****8821",
        type: "Manual",
        failureReason: null
    },
    {
        id: "tr_003",
        amount: 890.00,
        grossAmount: 890.00,
        netAmount: 880.00,
        status: "fallida",
        date: "2026-01-10T09:15:00Z",
        createdAt: "2026-01-09T16:40:00Z",
        executedAt: null,
        failedAt: "2026-01-10T09:15:00Z",
        destination: "Banco Metropolitano ****4567",
        type: "Automática",
        failureReason: "Cuenta destino rechazada por el banco receptor."
    }
];

const INITIAL_BANK_ACCOUNTS = [
    {
        id: "ba_001",
        bankName: "Banco Metropolitano",
        last4: "4567",
        isDefault: true,
        holderName: "Clara Alvarez",
        currency: "USD"
    },
    {
        id: "ba_002",
        bankName: "Banco de Crédito",
        last4: "8821",
        isDefault: false,
        holderName: "Clara Alvarez",
        currency: "USD"
    }
];

const STATUS_STYLES = {
    completada: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pendiente: "bg-amber-50 text-amber-700 border-amber-200",
    procesando: "bg-blue-50 text-blue-700 border-blue-200",
    fallida: "bg-rose-50 text-rose-700 border-rose-200"
};

const formatCurrency = (value) => `${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})} US$`;

const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const formatPdfDateTime = (dateValue) => {
    if (!dateValue) return "--";
    const date = new Date(dateValue);
    return date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const sanitizePdfText = (value = "") => {
    return value
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\x20-\x7E]/g, "");
};

const escapePdfText = (value = "") => (
    sanitizePdfText(value)
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
);

const wrapPdfText = (text, maxWidth, fontSize) => {
    const sanitized = sanitizePdfText(text);
    if (!sanitized) return ["--"];
    const approxCharWidth = fontSize * 0.5;
    const maxChars = Math.max(12, Math.floor(maxWidth / approxCharWidth));
    const words = sanitized.split(" ");
    const lines = [];
    let current = "";

    words.forEach((word) => {
        if (!current) {
            current = word;
            return;
        }
        if (`${current} ${word}`.length <= maxChars) {
            current = `${current} ${word}`;
        } else {
            lines.push(current);
            current = word;
        }
    });

    if (current) lines.push(current);
    return lines;
};

const buildReceiptPdf = (transfer) => {
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 48;
    const headerHeight = 96;
    const colGap = 24;
    const colWidth = (pageWidth - margin * 2 - colGap) / 2;
    const col2X = margin + colWidth + colGap;

    const colors = {
        accent: [0.388, 0.357, 1],
        primary: [0.196, 0.208, 0.365],
        muted: [0.53, 0.58, 0.64],
        border: [0.88, 0.9, 0.93],
        headerBg: [0.965, 0.97, 0.985]
    };

    const lines = [];
    const add = (command) => lines.push(command);

    const drawText = (text, x, y, size = 11, font = "F1", color = colors.primary) => {
        const safeText = escapePdfText(text);
        add(`${color[0]} ${color[1]} ${color[2]} rg`);
        add(`BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${safeText}) Tj ET`);
    };

    const drawLine = (x1, y1, x2, y2, color = colors.border, width = 1) => {
        add(`${color[0]} ${color[1]} ${color[2]} RG`);
        add(`${width} w`);
        add(`${x1} ${y1} m ${x2} ${y2} l S`);
    };

    const drawRect = (x, y, width, height, color) => {
        add(`${color[0]} ${color[1]} ${color[2]} rg`);
        add(`${x} ${y} ${width} ${height} re f`);
    };

    const drawField = (label, value, x, y) => {
        drawText(label, x, y, 8, "F1", colors.muted);
        drawText(value, x, y - 12, 11, "F2", colors.primary);
    };

    drawRect(0, pageHeight - headerHeight, pageWidth, headerHeight, colors.headerBg);
    drawRect(0, pageHeight - headerHeight, pageWidth, 2, colors.accent);

    drawText("Comprobante de extracción", margin, pageHeight - 50, 18, "F2", colors.primary);
    drawText("AntillaPay - Payouts", margin, pageHeight - 72, 10, "F1", colors.muted);

    let cursorY = pageHeight - headerHeight - 28;

    drawText("RESUMEN DEL PAYOUT", margin, cursorY, 9, "F2", colors.muted);
    cursorY -= 8;
    drawLine(margin, cursorY, pageWidth - margin, cursorY);
    cursorY -= 18;

    const statusLabel = getStatusLabel(transfer.status);
    drawField("ID DEL PAYOUT", transfer.id, margin, cursorY);
    drawField("ESTADO", statusLabel, col2X, cursorY);
    cursorY -= 34;

    drawField("FECHA DE CREACION", formatPdfDateTime(transfer.createdAt), margin, cursorY);
    drawField("FECHA DE EJECUCION", formatPdfDateTime(transfer.executedAt), col2X, cursorY);
    cursorY -= 34;

    drawField("FECHA DE FALLO", formatPdfDateTime(transfer.failedAt), margin, cursorY);
    cursorY -= 40;

    drawText("MONTOS", margin, cursorY, 9, "F2", colors.muted);
    cursorY -= 8;
    drawLine(margin, cursorY, pageWidth - margin, cursorY);
    cursorY -= 18;

    drawField("MONTO BRUTO", formatCurrency(transfer.grossAmount ?? transfer.amount), margin, cursorY);
    drawField("MONTO NETO", formatCurrency(transfer.netAmount ?? transfer.amount), col2X, cursorY);
    cursorY -= 40;

    drawText("DESTINO", margin, cursorY, 9, "F2", colors.muted);
    cursorY -= 8;
    drawLine(margin, cursorY, pageWidth - margin, cursorY);
    cursorY -= 18;

    drawText("CUENTA DESTINO", margin, cursorY, 8, "F1", colors.muted);
    cursorY -= 12;
    const destinationLines = wrapPdfText(transfer.destination, pageWidth - margin * 2, 11);
    destinationLines.forEach((line) => {
        drawText(line, margin, cursorY, 11, "F2", colors.primary);
        cursorY -= 14;
    });

    if (transfer.failureReason) {
        cursorY -= 10;
        drawText("MOTIVO DEL FALLO", margin, cursorY, 9, "F2", colors.muted);
        cursorY -= 8;
        drawLine(margin, cursorY, pageWidth - margin, cursorY);
        cursorY -= 18;
        const failureLines = wrapPdfText(transfer.failureReason, pageWidth - margin * 2, 11);
        failureLines.forEach((line) => {
            drawText(line, margin, cursorY, 11, "F1", colors.primary);
            cursorY -= 14;
        });
    }

    const footerY = 64;
    drawLine(margin, footerY + 20, pageWidth - margin, footerY + 20);
    drawText(`Generado el ${formatPdfDateTime(new Date().toISOString())}`, margin, footerY + 6, 9, "F1", colors.muted);
    drawText("Documento para uso contable y soporte.", margin, footerY - 6, 9, "F1", colors.muted);

    const contentStream = lines.join("\n");
    const objects = [];

    const addObject = (content) => {
        objects.push(content);
        return objects.length;
    };

    addObject("<< /Type /Catalog /Pages 2 0 R >>");
    addObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
    addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`);
    addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
    addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
    addObject(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);

    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((obj, index) => {
        offsets.push(pdf.length);
        pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
    });

    const xrefPosition = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    offsets.slice(1).forEach((offset) => {
        pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPosition}\n%%EOF`;

    return pdf;
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
        procesando: "Pendiente",
        fallida: "Fallida"
    };

    return labels[status] || "Pendiente";
};

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

const EXTRACTION_FILTERS = [
    { id: "created", label: "Fecha de Creación" },
    { id: "status", label: "Estado" }
];

export default function BalancesPage({ onOpenReport }) {
    const [transfers, setTransfers] = useState(INITIAL_TRANSFERS);
    const [bankAccounts, setBankAccounts] = useState(INITIAL_BANK_ACCOUNTS);
    const [availableBalance] = useState(1240.50);
    const [pendingBalance] = useState(350.25);
    const [selectedTransfer, setSelectedTransfer] = useState(null);

    // Modals
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isManageBanksModalOpen, setIsManageBanksModalOpen] = useState(false);
    const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [isTransferDetailModalOpen, setIsTransferDetailModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // Form states
    const [transferAmount, setTransferAmount] = useState("");
    const [selectedBankId, setSelectedBankId] = useState(bankAccounts.find(b => b.isDefault)?.id || "");
    const [newBankName, setNewBankName] = useState("");
    const [newBankLast4, setNewBankLast4] = useState("");
    const [transferType, setTransferType] = useState("manual");
    const [transferScheduleFrequency, setTransferScheduleFrequency] = useState("Diarias");
    const [transferWeeklyDays, setTransferWeeklyDays] = useState([]);
    const [transferMonthlyDays, setTransferMonthlyDays] = useState([]);
    const [reviewMessage, setReviewMessage] = useState("");

    // Filter states
    const [chipFilters, setChipFilters] = useState(() => ({
        created: false,
        status: false
    }));
    const [statusFilter, setStatusFilter] = useState("all");
    const [createdDate, setCreatedDate] = useState(undefined);
    const [isCreatedCalendarOpen, setIsCreatedCalendarOpen] = useState(false);

    // Export states
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const handleTransfer = () => {
        if (!transferAmount || isNaN(transferAmount) || parseFloat(transferAmount) <= 0) return;

        const parsedAmount = parseFloat(transferAmount);
        const selectedBank = bankAccounts.find(b => b.id === selectedBankId);
        const newTransfer = {
            id: `tr_${Date.now()}`,
            amount: parsedAmount,
            grossAmount: parsedAmount,
            netAmount: parsedAmount,
            status: "pendiente",
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            executedAt: null,
            failedAt: null,
            destination: `${selectedBank?.bankName} ****${selectedBank?.last4}`,
            type: "Manual",
            failureReason: null
        };

        setTransfers([newTransfer, ...transfers]);
        setIsTransferModalOpen(false);
        setTransferAmount("");
    };

    const openTransferDetails = (transfer) => {
        setSelectedTransfer(transfer);
        setIsTransferDetailModalOpen(true);
    };

    const openReviewRequest = (transfer) => {
        setSelectedTransfer(transfer);
        setReviewMessage("");
        setIsReviewModalOpen(true);
    };

    const handleSendReviewRequest = () => {
        if (!selectedTransfer) return;
        setIsReviewModalOpen(false);
        setReviewMessage("");
    };

    const handleDownloadReceipt = (transfer) => {
        if (!transfer) return;

        const pdfContent = buildReceiptPdf(transfer);
        const blob = new Blob([pdfContent], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `comprobante_${transfer.id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const handleCopyTransferId = async (transfer) => {
        if (!transfer?.id) return;
        const text = transfer.id;

        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
    };

    const handleAddBank = () => {
        if (!newBankName || !newBankLast4) return;

        const newBank = {
            id: `ba_${Date.now()}`,
            bankName: newBankName,
            last4: newBankLast4,
            isDefault: bankAccounts.length === 0,
            holderName: "Clara Alvarez",
            currency: "USD"
        };

        setBankAccounts([...bankAccounts, newBank]);
        setIsAddBankModalOpen(false);
        setNewBankName("");
        setNewBankLast4("");
    };

    const setDefaultBank = (id) => {
        setBankAccounts(prev => prev.map(bank => ({
            ...bank,
            isDefault: bank.id === id
        })));
    };

    const removeBank = (id) => {
        setBankAccounts(prev => prev.filter(bank => bank.id !== id));
    };

    const handleToggleFilter = (filterId) => {
        setChipFilters(prev => {
            const nextValue = !prev[filterId];
            if (!nextValue) {
                setCreatedDate(undefined);
                setIsCreatedCalendarOpen(false);
            }
            return {
                ...prev,
                [filterId]: nextValue
            };
        });
    };

    const availableStatuses = ["completada", "pendiente", "fallida"];

    const filteredTransfers = transfers.filter(transfer => {
        if (chipFilters.created && createdDate) {
            const transferDate = new Date(transfer.createdAt).toDateString();
            const filterDate = new Date(createdDate).toDateString();
            if (transferDate !== filterDate) return false;
        }
        if (chipFilters.status && statusFilter !== "all") {
            if (transfer.status !== statusFilter) return false;
        }
        return true;
    });

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-[28px] font-bold text-[#32325d]">
                    <h1>Saldos {formatCurrency(availableBalance)}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsTransferModalOpen(true)}
                        className="h-8 rounded-md bg-white border border-gray-200 text-[#32325d] text-[13px] font-semibold hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
                    >
                        Extraer
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="h-8 rounded-md bg-white border border-gray-200 text-[#32325d] text-[13px] font-semibold hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
                            >
                                Gestionar extracciones
                                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[280px] rounded-xl p-1 shadow-xl border-gray-100">
                            <DropdownMenuItem
                                onClick={() => setIsCalendarModalOpen(true)}
                                className="rounded-lg py-2.5 text-[14px] text-[#32325d] cursor-pointer"
                            >
                                Gestionar calendario de extracciones
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setIsManageBanksModalOpen(true)}
                                className="rounded-lg py-2.5 text-[14px] text-[#32325d] cursor-pointer"
                            >
                                Gestionar cuentas bancarias
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                <div className="space-y-12">
                    {/* Balance Summary */}
                    <section className="space-y-6">
                        <div className="space-y-0 relative">
                            {/* Horizontal Bar Visualizer */}
                            <div className="h-2 w-full bg-[#e3e8ee] rounded-full overflow-hidden mb-6">
                                <div
                                    className="h-full bg-[#635bff]"
                                    style={{ width: `${(availableBalance / (availableBalance + pendingBalance)) * 100}%` }}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded bg-[#aab2c4]" />
                                        <span className="text-[14px] text-[#4f5b76]">Entrante</span>
                                    </div>
                                    <span className="text-[14px] font-semibold text-[#32325d]">{formatCurrency(pendingBalance)}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded bg-[#635bff]" />
                                        <span className="text-[14px] text-[#4f5b76]">Disponible</span>
                                    </div>
                                    <span className="text-[14px] font-semibold text-[#32325d]">{formatCurrency(availableBalance)}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Recent Activity */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-100">
                            <div className="flex gap-8">
                                <button className="pb-3 text-[14px] font-semibold text-[#635bff] border-b-2 border-[#635bff]">
                                    Extracciones
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex flex-wrap items-center gap-2">
                                {EXTRACTION_FILTERS.map((filter) => (
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
                                                {availableStatuses.map((status) => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <span className="text-[12px] text-[#6b7280]">
                                    Mostrando {filteredTransfers.length} extracciones
                                </span>
                                <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
                                    
                                    <DialogContent className="sm:max-w-[600px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                                        <div className="p-6 space-y-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h2 className="text-[18px] font-semibold text-[#1a1f36]">Exportar extracciones</h2>
                                                    <p className="text-[14px] text-[#4f5b76] mt-1">Exporta tus extracciones en formato CSV o Excel</p>
                                                </div>
                                                <button
                                                    onClick={() => setIsExportModalOpen(false)}
                                                    className="rounded-lg border border-transparent p-1.5 text-[#9ca3af] hover:text-[#4b5563] transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[13px] font-semibold text-[#32325d] mb-2 block">Formato</label>
                                                    <div className="flex gap-4">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="format"
                                                                value="csv"
                                                                defaultChecked
                                                                className="w-4 h-4 text-[#635bff] border-gray-300"
                                                            />
                                                            <span className="text-[12px] text-[#4f5b76]">CSV</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="format"
                                                                value="xlsx"
                                                                className="w-4 h-4 text-[#635bff] border-gray-300"
                                                            />
                                                            <span className="text-[12px] text-[#4f5b76]">Excel (.xlsx)</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-[13px] font-semibold text-[#32325d] mb-2 block">Intervalo de fechas</label>
                                                    <select className="w-full h-9 px-3 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#635bff]/20">
                                                        <option>Hoy</option>
                                                        <option>Últimos 7 días</option>
                                                        <option>Últimos 30 días</option>
                                                        <option>Mes en curso</option>
                                                        <option>Mes anterior</option>
                                                        <option>Todos</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setIsExportModalOpen(false)}
                                                    className="h-9 px-5 rounded-lg text-[13px] font-semibold text-[#4f5b76] border-gray-200"
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        alert('Export functionality coming soon');
                                                        setIsExportModalOpen(false);
                                                    }}
                                                    className="h-9 px-5 rounded-lg text-[13px] font-semibold bg-[#635bff] hover:bg-[#5851e0] text-white"
                                                >
                                                    Exportar
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
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

                        {filteredTransfers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                                <p className="text-[14px] text-[#8792a2]">No se han encontrado extracciones</p>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/60">
                                            <TableHead className="px-6 py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Fecha</TableHead>
                                            <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Importe</TableHead>
                                            <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Estado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTransfers.map((transfer) => (
                                            <TableRow key={transfer.id} className="border-b border-gray-100 last:border-b-0">
                                                <TableCell className="px-6 py-4 text-[13px] text-[#4f5b76]">
                                                    {formatDate(transfer.date)}
                                                </TableCell>
                                                <TableCell className="py-4 text-[14px] font-semibold text-[#32325d]">
                                                    {formatCurrency(transfer.amount)}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn("rounded-full border text-[11px] font-semibold capitalize", STATUS_STYLES[transfer.status])}
                                                    >
                                                        {transfer.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Links */}
                <div className="space-y-8">
                </div>
            </div>

            {/* Modal: Transfer / Withdraw */}
            <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl [&>button]:hidden">
                    <div className="p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[20px] font-bold text-[#32325d]">Extraer fondos</h2>
                            <button onClick={() => setIsTransferModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-[#4f5b76]">Importe</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#32325d] font-semibold">US$</div>
                                    <input
                                        type="number"
                                        value={transferAmount}
                                        onChange={(e) => setTransferAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all text-[16px] font-medium"
                                    />
                                    <button
                                        onClick={() => setTransferAmount(availableBalance.toString())}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#635bff] hover:text-[#5851e0]"
                                    >
                                        USAR MÁXIMO
                                    </button>
                                </div>
                                <p className="text-[12px] text-[#8792a2]">Máximo disponible: {formatCurrency(availableBalance)}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-[#4f5b76]">Enviar a</label>
                                <div className="space-y-2">
                                    {bankAccounts.map((account) => (
                                        <button
                                            key={account.id}
                                            onClick={() => setSelectedBankId(account.id)}
                                            className={cn(
                                                "w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group",
                                                selectedBankId === account.id
                                                    ? "border-[#635bff] bg-[#f5f3ff] shadow-sm"
                                                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                                    selectedBankId === account.id ? "bg-white shadow-sm" : "bg-gray-100"
                                                )}>
                                                    <CreditCard className={cn("w-5 h-5", selectedBankId === account.id ? "text-[#635bff]" : "text-gray-400")} />
                                                </div>
                                                <div>
                                                    <div className="text-[14px] font-semibold text-[#32325d]">{account.bankName}</div>
                                                    <div className="text-[12px] text-[#4f5b76]">**** {account.last4} • {account.holderName}</div>
                                                </div>
                                            </div>
                                            {selectedBankId === account.id && (
                                                <div className="w-5 h-5 rounded-full bg-[#635bff] flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setIsAddBankModalOpen(true)}
                                        className="w-full p-4 rounded-xl border border-dashed border-gray-200 text-[#635bff] font-semibold text-[14px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Añadir cuenta bancaria
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f7f9fc] p-8 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-[12px] text-[#697386]">
                            <Info className="w-4 h-4" />
                            <span>Las extracciones tardan de 1 a 3 días hábiles.</span>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={handleTransfer}
                                disabled={!transferAmount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > availableBalance}
                                className="h-10 px-6 rounded-lg bg-[#635bff] hover:bg-[#5851e0] text-white text-[14px] font-bold shadow-lg shadow-[#635bff]/20"
                            >
                                Extraer fondos
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal: Transfer Detail */}
            <Dialog open={isTransferDetailModalOpen} onOpenChange={setIsTransferDetailModalOpen}>
                <DialogContent className="sm:max-w-[560px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl [&>button]:hidden">
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
                                                STATUS_STYLES[selectedTransfer.status]
                                            )}
                                        >
                                            {getStatusLabel(selectedTransfer.status)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Fecha de creacion</span>
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
                                            {formatCurrency(selectedTransfer.grossAmount ?? selectedTransfer.amount)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Monto neto</span>
                                        <div className="text-[16px] font-semibold text-[#32325d]">
                                            {formatCurrency(selectedTransfer.netAmount ?? selectedTransfer.amount)}
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
                                        onClick={() => handleDownloadReceipt(selectedTransfer)}
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

            {/* Modal: Review Request */}
            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogContent className="sm:max-w-[520px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl [&>button]:hidden">
                    <div className="p-8 space-y-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-[20px] font-bold text-[#32325d]">Solicitar revision</h2>
                                <p className="text-[13px] text-[#8792a2]">
                                    Esto no reintenta la extracción. Nuestro equipo revisara el fallo y te contactara si necesita informacion.
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

            {/* Modal: Manage Bank Accounts */}
            <Dialog open={isManageBanksModalOpen} onOpenChange={setIsManageBanksModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl [&>button]:hidden">
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[20px] font-bold text-[#32325d]">Cuentas bancarias</h2>
                            <button onClick={() => setIsManageBanksModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {bankAccounts.length === 0 ? (
                            <div className="text-center py-12 space-y-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                    <CreditCard className="w-8 h-8 text-[#aab2c4]" />
                                </div>
                                <p className="text-[14px] text-[#4f5b76]">No se han añadido cuentas bancarias</p>
                                <Button
                                    onClick={() => setIsAddBankModalOpen(true)}
                                    variant="outline"
                                    className="h-10 px-4 rounded-lg flex items-center gap-2 mx-auto"
                                >
                                    <Plus className="w-4 h-4" />
                                    Añadir cuenta bancaria
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {bankAccounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="p-4 rounded-xl border border-gray-100 flex items-center justify-between bg-white hover:border-[#cbd5f5] transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                                <CreditCard className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[14px] font-semibold text-[#32325d]">{account.bankName}</span>
                                                    {account.isDefault && (
                                                        <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] uppercase font-bold px-1.5 py-0">Predeterminada</Badge>
                                                    )}
                                                </div>
                                                <div className="text-[12px] text-[#4f5b76]">**** {account.last4} • {account.currency}</div>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="text-[#aab2c4] hover:text-[#32325d] transition-colors p-1">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[200px] rounded-xl p-1 shadow-xl">
                                                {!account.isDefault && (
                                                    <DropdownMenuItem onClick={() => setDefaultBank(account.id)} className="rounded-lg py-2 text-[14px] text-[#32325d] cursor-pointer">
                                                        Marcar predeterminada
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem onClick={() => removeBank(account.id)} className="rounded-lg py-2 text-[14px] text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer">
                                                    Eliminar cuenta
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))}
                                <Button
                                    onClick={() => setIsAddBankModalOpen(true)}
                                    variant="ghost"
                                    className="w-full h-12 rounded-xl border-2 border-dashed border-gray-100 text-[#635bff] font-semibold hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Añadir otra cuenta
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#f7f9fc] p-6 flex justify-end">
                        <Button
                            onClick={() => setIsManageBanksModalOpen(false)}
                            className="bg-[#635bff] hover:bg-[#5851e0] text-white h-10 px-8 rounded-lg font-bold"
                        >
                            Hecho
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal: Add Bank Account */}
            <Dialog open={isAddBankModalOpen} onOpenChange={setIsAddBankModalOpen}>
                <DialogContent className="sm:max-w-[460px] rounded-3xl p-8 border-none shadow-2xl">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-[20px] font-bold text-[#32325d]">Añadir cuenta bancaria</DialogTitle>
                        <DialogDescription className="text-[14px] text-[#4f5b76]">
                            Introduce los datos de la cuenta bancaria donde recibirás tus fondos.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-[#4f5b76]">Nombre del banco</label>
                            <input
                                value={newBankName}
                                onChange={(e) => setNewBankName(e.target.value)}
                                placeholder="Ej. Banco Metropolitano"
                                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#635bff]/10 focus:border-[#635bff] transition-all text-[14px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-[#4f5b76]">Últimos 4 dígitos</label>
                            <input
                                value={newBankLast4}
                                onChange={(e) => setNewBankLast4(e.target.value)}
                                maxLength={4}
                                placeholder="0000"
                                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#635bff]/10 focus:border-[#635bff] transition-all text-[14px]"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3">
                        <Button
                            onClick={() => setIsAddBankModalOpen(false)}
                            variant="outline"
                            className="h-10 px-6 rounded-lg font-semibold"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleAddBank}
                            disabled={!newBankName || !newBankLast4}
                            className="h-10 px-8 rounded-lg bg-[#635bff] hover:bg-[#5851e0] text-white font-bold"
                        >
                            Guardar cuenta
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal: Transfer Calendar */}
            <Dialog open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
                <DialogContent className="sm:max-w-[540px] rounded-3xl p-8 border-none shadow-2xl overflow-hidden">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-[22px] font-bold text-[#32325d]">Calendario de extracciones</h2>
                            <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                                Define un calendario personalizado para la extracción de fondos a tu cuenta bancaria.{" "}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <label
                                onClick={() => setTransferType("manual")}
                                className={cn(
                                    "flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all",
                                    transferType === "manual" ? "border-[#635bff] bg-[#f5f3ff]" : "border-gray-100 hover:bg-gray-50"
                                )}
                            >
                                <div className={cn(
                                    "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    transferType === "manual" ? "border-[#635bff] bg-[#635bff]" : "border-gray-300"
                                )}>
                                    {transferType === "manual" && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[15px] font-bold text-[#32325d]">Extracciones manuales</div>
                                    <div className="text-[13px] text-[#4f5b76]">Envía extracciones cuando quieras.</div>
                                </div>
                            </label>

                            <label
                                onClick={() => setTransferType("auto")}
                                className={cn(
                                    "flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all",
                                    transferType === "auto" ? "border-[#635bff] bg-[#f5f3ff]" : "border-gray-100 hover:bg-gray-50"
                                )}
                            >
                                <div className={cn(
                                    "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    transferType === "auto" ? "border-[#635bff] bg-[#635bff]" : "border-gray-300"
                                )}>
                                    {transferType === "auto" && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div className="space-y-1">
                                        <div className="text-[15px] font-bold text-[#32325d]">Extracciones automáticas</div>
                                        <div className="text-[13px] text-[#4f5b76]">
                                            Realiza extracciones de forma periódica. Ya sea semanal o mensualmente, puedes seleccionar más de un día de extracciones durante esos periodos.
                                        </div>
                                    </div>

                                    {transferType === "auto" && (
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-start">
                                            {transferScheduleFrequency === "Semanales" && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            type="button"
                                                            className="relative w-full h-10 pl-4 pr-10 rounded-xl border border-gray-200 bg-white text-left text-[14px] font-medium text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#635bff]/10"
                                                        >
                                                            <span className="block truncate">
                                                                {transferWeeklyDays.length === 0
                                                                    ? "Selecciona días"
                                                                    : transferWeeklyDays.join(", ")}
                                                            </span>
                                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-[260px] rounded-xl p-2 shadow-xl border-gray-100">
                                                        <DropdownMenuItem
                                                            onSelect={(event) => {
                                                                event.preventDefault();
                                                                const allDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
                                                                if (transferWeeklyDays.length === allDays.length) {
                                                                    setTransferWeeklyDays([]);
                                                                    return;
                                                                }
                                                                setTransferWeeklyDays(allDays);
                                                            }}
                                                            className="rounded-lg py-2 text-[14px] text-[#32325d] cursor-pointer"
                                                        >
                                                            <span
                                                                className={cn(
                                                                    "mr-3 flex h-4 w-4 items-center justify-center rounded-full border",
                                                                    transferWeeklyDays.length === 7 ? "border-[#635bff]" : "border-gray-300"
                                                                )}
                                                            >
                                                                {transferWeeklyDays.length === 7 && <span className="h-2 w-2 rounded-full bg-[#635bff]" />}
                                                            </span>
                                                            Seleccionar todos
                                                        </DropdownMenuItem>
                                                        {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => {
                                                            const checked = transferWeeklyDays.includes(day);
                                                            return (
                                                                <DropdownMenuItem
                                                                    key={day}
                                                                    onSelect={(event) => {
                                                                        event.preventDefault();
                                                                        setTransferWeeklyDays((prev) => {
                                                                            if (prev.includes(day)) return prev.filter((d) => d !== day);
                                                                            return [...prev, day];
                                                                        });
                                                                    }}
                                                                    className="rounded-lg py-2 text-[14px] text-[#32325d] cursor-pointer"
                                                                >
                                                                    <span
                                                                        className={cn(
                                                                            "mr-3 flex h-4 w-4 items-center justify-center rounded-full border",
                                                                            checked ? "border-[#635bff]" : "border-gray-300"
                                                                        )}
                                                                    >
                                                                        {checked && <span className="h-2 w-2 rounded-full bg-[#635bff]" />}
                                                                    </span>
                                                                    {day}
                                                                </DropdownMenuItem>
                                                            );
                                                        })}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}

                                            {transferScheduleFrequency === "Mensuales" && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            type="button"
                                                            className="relative w-full h-10 pl-4 pr-10 rounded-xl border border-gray-200 bg-white text-left text-[14px] font-medium text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#635bff]/10"
                                                        >
                                                            <span className="block truncate">
                                                                {transferMonthlyDays.length === 0
                                                                    ? "Selecciona días"
                                                                    : transferMonthlyDays.join(", ")}
                                                            </span>
                                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="start"
                                                        className="w-[260px] max-h-[320px] overflow-auto rounded-xl p-2 shadow-xl border-gray-100"
                                                    >
                                                        <DropdownMenuItem
                                                            onSelect={(event) => {
                                                                event.preventDefault();
                                                                const allDays = Array.from({ length: 31 }, (_, i) => `${i + 1}.°`);
                                                                if (transferMonthlyDays.length === allDays.length) {
                                                                    setTransferMonthlyDays([]);
                                                                    return;
                                                                }
                                                                setTransferMonthlyDays(allDays);
                                                            }}
                                                            className="rounded-lg py-2 text-[14px] text-[#32325d] cursor-pointer"
                                                        >
                                                            <span
                                                                className={cn(
                                                                    "mr-3 flex h-4 w-4 items-center justify-center rounded-full border",
                                                                    transferMonthlyDays.length === 31 ? "border-[#635bff]" : "border-gray-300"
                                                                )}
                                                            >
                                                                {transferMonthlyDays.length === 31 && <span className="h-2 w-2 rounded-full bg-[#635bff]" />}
                                                            </span>
                                                            Seleccionar todos
                                                        </DropdownMenuItem>
                                                        {Array.from({ length: 31 }, (_, i) => `${i + 1}.°`).map((day) => {
                                                            const checked = transferMonthlyDays.includes(day);
                                                            return (
                                                                <DropdownMenuItem
                                                                    key={day}
                                                                    onSelect={(event) => {
                                                                        event.preventDefault();
                                                                        setTransferMonthlyDays((prev) => {
                                                                            if (prev.includes(day)) return prev.filter((d) => d !== day);
                                                                            return [...prev, day];
                                                                        });
                                                                    }}
                                                                    className="rounded-lg py-2 text-[14px] text-[#32325d] cursor-pointer"
                                                                >
                                                                    <span
                                                                        className={cn(
                                                                            "mr-3 flex h-4 w-4 items-center justify-center rounded-full border",
                                                                            checked ? "border-[#635bff]" : "border-gray-300"
                                                                        )}
                                                                    >
                                                                        {checked && <span className="h-2 w-2 rounded-full bg-[#635bff]" />}
                                                                    </span>
                                                                    {day}
                                                                </DropdownMenuItem>
                                                            );
                                                        })}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}

                                            <div className="w-full max-w-[200px]">
                                                <div className="relative">
                                                    <select
                                                        value={transferScheduleFrequency}
                                                        onChange={(event) => {
                                                            const next = event.target.value;
                                                            setTransferScheduleFrequency(next);
                                                            if (next !== "Semanales") {
                                                                setTransferWeeklyDays([]);
                                                            }
                                                            if (next !== "Mensuales") {
                                                                setTransferMonthlyDays([]);
                                                            }
                                                        }}
                                                        className="w-full h-10 pl-4 pr-10 rounded-xl border border-gray-200 bg-white appearance-none text-[14px] font-medium text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#635bff]/10"
                                                    >
                                                        <option>Diarias</option>
                                                        <option>Semanales</option>
                                                        <option>Mensuales</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </label>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                            <Button
                                onClick={() => setIsCalendarModalOpen(false)}
                                variant="outline"
                                className="h-10 px-6 rounded-lg font-semibold text-[#4f5b76]"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => setIsCalendarModalOpen(false)}
                                className="h-10 px-8 rounded-lg bg-[#635bff] hover:bg-[#5851e0] text-white font-bold"
                            >
                                Guardar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
