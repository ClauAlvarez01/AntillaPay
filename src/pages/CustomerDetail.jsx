import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Copy, Upload, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

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

const escapeCsvValue = (value) => {
    const safeValue = value === null || value === undefined ? "" : String(value);
    if (/[",\n]/.test(safeValue)) {
        return `"${safeValue.replace(/"/g, "\"\"")}"`;
    }
    return safeValue;
};

const handleCopyText = (value) => {
    if (!value) return;
    if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(value);
        return;
    }
    const input = document.createElement("input");
    input.value = value;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
};

export default function CustomerDetail({ customerId }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [payments, setPayments] = useState([]);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState("csv");

    const customerFromState = location.state?.customer;
    const storedCustomers = useMemo(() => {
        if (typeof window === "undefined") return [];
        const stored = window.localStorage.getItem("antillapay_customers");
        return stored ? JSON.parse(stored) : [];
    }, []);

    const customer = customerFromState || storedCustomers.find((item) => item.id === customerId);
    const customerPayments = useMemo(() => (
        customer
            ? payments.filter((payment) => payment.email === customer.email)
            : []
    ), [customer, payments]);

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

    const handleExportPayments = () => {
        if (!customerPayments.length || !customer) return;

        const header = [
            "Cliente",
            "Correo",
            "ID del cliente",
            "Fecha",
            "Importe",
            "Moneda",
            "Estado",
            "Metodo",
            "Referencia",
            "Origen"
        ];
        const rows = customerPayments.map((payment) => ([
            customer.name,
            customer.email,
            customer.id,
            new Date(payment.createdAt).toISOString(),
            payment.amount,
            payment.currency,
            payment.status,
            payment.method,
            payment.reference,
            payment.origin
        ]));
        const extension = exportFormat === "xlsx" ? "xlsx" : "csv";
        const filename = `pagos_${customer.id}.${extension}`;

        if (exportFormat === "xlsx") {
            const htmlContent = buildSpreadsheetHtml(header, rows);
            downloadFile(htmlContent, filename, "application/vnd.ms-excel");
        } else {
            const csvLines = [header, ...rows]
                .map((row) => row.map(escapeCsvValue).join(","))
                .join("\n");
            downloadFile(csvLines, filename, "text/csv;charset=utf-8;");
        }
        setIsExportModalOpen(false);
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem("antillapay_payments");
        if (stored) {
            setPayments(JSON.parse(stored));
            return;
        }
        window.localStorage.setItem("antillapay_payments", JSON.stringify(DEMO_PAYMENTS));
        setPayments(DEMO_PAYMENTS);
    }, []);

    const breadcrumb = (
        <div className="flex items-center gap-2 text-[13px] text-[#635bff] font-semibold">
            <span className="cursor-pointer" onClick={() => navigate("/customers")}>
                Clientes
            </span>
            <ChevronRight className="w-4 h-4 text-[#9ca3af]" />
        </div>
    );

    if (!customer) {
        return (
            <div className="space-y-6">
                {breadcrumb}
                <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-[#8792a2]">
                    No se encontro el cliente solicitado.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-3">
                    {breadcrumb}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#f4f5f7] flex items-center justify-center overflow-hidden">
                            <User className="w-6 h-6 text-[#9ca3af]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-[26px] font-bold text-[#32325d]">{customer.name}</h1>
                            </div>
                            <p className="text-[13px] text-[#6b7280]">{customer.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#4f5b76]">
                <span>ID {customer.id}</span>
                <span className="text-[#c7cbd3]">•</span>
                <span>Creado {formatDate(customer.createdAt)}</span>
                <button
                    type="button"
                    onClick={() => handleCopyText(customer.id)}
                    className="inline-flex items-center gap-1 text-[#635bff] font-semibold hover:underline"
                >
                    <Copy className="w-3.5 h-3.5" />
                    Copiar ID
                </button>
                <button
                    type="button"
                    onClick={() => handleCopyText(customer.email)}
                    className="inline-flex items-center gap-1 text-[#635bff] font-semibold hover:underline"
                >
                    <Copy className="w-3.5 h-3.5" />
                    Copiar email
                </button>
            </div>

            <div className="max-w-[720px]">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-6">
                    <div className="text-[14px] font-semibold text-[#32325d]">Información básica</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Nombre</span>
                            <div className="text-[14px] text-[#32325d] font-semibold">{customer.name}</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Email</span>
                            <div className="text-[14px] text-[#32325d]">{customer.email}</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Creado</span>
                            <div className="text-[14px] text-[#32325d]">{formatDate(customer.createdAt)}</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[11px] uppercase tracking-widest text-[#8792a2] font-semibold">Tipo</span>
                            <div className="text-[14px] text-[#32325d]">{customer.type}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[14px] font-semibold text-[#32325d]">Historial de pagos</div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsExportModalOpen(true)}
                        disabled={!customerPayments.length}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                    >
                        <Upload className="w-4 h-4 text-[#8792a2]" />
                        Exportar
                    </Button>
                </div>
                {customerPayments.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 p-6 text-[13px] text-[#8792a2]">
                        Aún no hay pagos registrados para este cliente.
                    </div>
                ) : (
                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/60">
                                    <TableHead className="px-4 py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Fecha</TableHead>
                                    <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Importe</TableHead>
                                    <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Moneda</TableHead>
                                    <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Estado</TableHead>
                                    <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Método</TableHead>
                                    <TableHead className="py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Referencia</TableHead>
                                    <TableHead className="pr-4 py-3 text-[11px] uppercase tracking-wider text-[#8792a2]">Origen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customerPayments.map((payment) => (
                                    <TableRow key={payment.id} className="border-b border-gray-100 last:border-b-0">
                                        <TableCell className="px-4 py-3 text-[13px] text-[#4f5b76]">
                                            {formatDate(payment.createdAt)}
                                        </TableCell>
                                        <TableCell className="py-3 text-[13px] font-semibold text-[#32325d]">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </TableCell>
                                        <TableCell className="py-3 text-[13px] text-[#4f5b76]">
                                            {payment.currency}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className={cn(
                                                "inline-flex rounded-lg border px-2 py-0.5 text-[11px] font-semibold",
                                                PAYMENT_STATUS_STYLES[payment.status] || "bg-gray-50 text-gray-600 border-gray-200"
                                            )}>
                                                {payment.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-3 text-[13px] text-[#4f5b76]">
                                            {payment.method}
                                        </TableCell>
                                        <TableCell className="py-3 text-[13px] text-[#4f5b76]">
                                            {payment.reference}
                                        </TableCell>
                                        <TableCell className="pr-4 py-3 text-[13px] text-[#4f5b76]">
                                            {payment.origin}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
                <DialogContent className="sm:max-w-[520px] rounded-2xl border border-gray-200 p-0 [&>button]:hidden">
                    <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                        <div>
                            <h3 className="text-[18px] font-semibold text-[#1a1f36]">
                                Exportar pagos
                            </h3>
                            <p className="text-[13px] text-[#6b7280] mt-1">
                                Elige el formato del archivo.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsExportModalOpen(false)}
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
                    </div>

                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => setIsExportModalOpen(false)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-[13px] font-semibold text-[#374151] hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleExportPayments}
                            disabled={!customerPayments.length}
                            className={`rounded-lg px-4 py-2 text-[13px] font-semibold text-white ${!customerPayments.length
                                ? "bg-[#c4c7ff] cursor-not-allowed"
                                : "bg-[#635bff] hover:bg-[#5851e0]"
                                }`}
                        >
                            Exportar
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
