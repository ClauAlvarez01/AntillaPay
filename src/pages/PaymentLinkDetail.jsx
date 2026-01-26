import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Check,
    ChevronRight,
    Copy,
    ExternalLink,
    Link2,
    Share2
} from "lucide-react";
import { cn } from "@/lib/utils";

const PAYMENT_LINK_BASE_URL = "https://buy.antillapay.com/";
const DEFAULT_PAYMENT_METHODS = [
    { id: "card", label: "Tarjeta", enabled: true },
    { id: "apple_pay", label: "Apple Pay", enabled: false },
    { id: "klarna", label: "Klarna", enabled: false },
    { id: "link", label: "Link", enabled: true },
    { id: "cash_app", label: "Cash App Pay", enabled: false },
    { id: "amazon_pay", label: "Amazon Pay", enabled: false },
    { id: "crypto", label: "Criptomoneda", enabled: false }
];

const CURRENCY_OPTIONS = [
    { code: "USD", label: "USD" },
    { code: "EUR", label: "EUR" },
    { code: "GBP", label: "GBP" }
];

const formatDateTime = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "--";
    const formatter = new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
    return formatter.format(date).replace(".", "");
};

const formatAmount = (amountValue, currencyCode) => {
    const amount = typeof amountValue === "number" ? amountValue : parseFloat(amountValue || "0");
    const safeAmount = Number.isFinite(amount) ? amount : 0;
    const symbolMap = { USD: "US$", EUR: "€", GBP: "£" };
    const symbol = symbolMap[currencyCode] || currencyCode || "US$";
    const formatted = new Intl.NumberFormat("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(safeAmount);
    return `${symbol} ${formatted}`;
};

export default function PaymentLinkDetail({ paymentLinks, setPaymentLinks, linkId }) {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [shareHint, setShareHint] = useState("");

    const link = paymentLinks.find((item) => item.id === linkId);

    const normalizedLink = useMemo(() => {
        if (!link) return null;
        const amountValue = typeof link.amount === "number" ? link.amount : parseFloat(link.amount || "");
        const fallbackAmount = Number.isFinite(amountValue) ? amountValue : 20;
        const allowCustomerAmount = link.allowCustomerAmount ?? (link.priceType === "customer_choice");
        const currencyCode = link.currencyCode || "USD";
        const productName = link.productName || link.name || "Producto";
        const paymentMethods = Array.isArray(link.paymentMethods) && link.paymentMethods.length
            ? link.paymentMethods
            : DEFAULT_PAYMENT_METHODS;
        return {
            ...link,
            amount: fallbackAmount,
            allowCustomerAmount,
            currencyCode,
            productName,
            paymentMethods,
            confirmationPage: link.confirmationPage || "Predeterminada",
            buttonLabel: link.buttonLabel || "Pagar"
        };
    }, [link]);

    useEffect(() => {
        if (!link || !normalizedLink) return;
        const updates = {};
        if (!link.currencyCode) updates.currencyCode = normalizedLink.currencyCode;
        if (link.amount == null) updates.amount = normalizedLink.amount;
        if (link.allowCustomerAmount == null) updates.allowCustomerAmount = normalizedLink.allowCustomerAmount;
        if (!link.productName) updates.productName = normalizedLink.productName;
        if (!link.paymentMethods || link.paymentMethods.length === 0) {
            updates.paymentMethods = normalizedLink.paymentMethods;
        }
        if (!link.confirmationPage) updates.confirmationPage = normalizedLink.confirmationPage;
        if (!link.buttonLabel) updates.buttonLabel = normalizedLink.buttonLabel;
        if (Object.keys(updates).length > 0) {
            setPaymentLinks((prev) =>
                prev.map((item) => (item.id === linkId ? { ...item, ...updates } : item))
            );
        }
    }, [link, linkId, normalizedLink, setPaymentLinks]);

    if (!normalizedLink) {
        return (
            <div className="w-full p-10">
                <p className="text-[14px] text-[#6b7280]">No encontramos el enlace de pago.</p>
            </div>
        );
    }

    const linkUrl = `${PAYMENT_LINK_BASE_URL}${normalizedLink.id}`;
    const isActive = normalizedLink.status === "Activo";

    const updateLink = (updates) => {
        setPaymentLinks((prev) =>
            prev.map((item) => (item.id === linkId ? { ...item, ...updates } : item))
        );
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(linkUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: normalizedLink.name, url: linkUrl });
                setShareHint("Compartido");
            } catch (error) {
                setShareHint("");
            }
        } else {
            await handleCopy();
            setShareHint("Enlace copiado");
        }
        setTimeout(() => setShareHint(""), 1500);
    };

    const handleToggleStatus = () => {
        updateLink({ status: isActive ? "Desactivado" : "Activo" });
    };

    const handleToggleEditable = () => {
        const nextAllow = !normalizedLink.allowCustomerAmount;
        updateLink({
            allowCustomerAmount: nextAllow,
            priceType: nextAllow ? "customer_choice" : "fixed"
        });
    };

    const handleAmountChange = (event) => {
        const value = event.target.value;
        const parsed = parseFloat(value || "0");
        updateLink({ amount: Number.isFinite(parsed) ? parsed : 0 });
    };

    const handleCurrencyChange = (event) => {
        updateLink({ currencyCode: event.target.value });
    };

    const handleProductNameChange = (event) => {
        updateLink({ productName: event.target.value });
    };

    const handleButtonLabelChange = (event) => {
        updateLink({ buttonLabel: event.target.value });
    };

    const handleToggleMethod = (methodId) => {
        const nextMethods = normalizedLink.paymentMethods.map((method) =>
            method.id === methodId ? { ...method, enabled: !method.enabled } : method
        );
        updateLink({ paymentMethods: nextMethods });
    };

    const enabledMethods = normalizedLink.paymentMethods.filter((method) => method.enabled);

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 text-[13px] text-[#635bff] font-semibold">
                <button type="button" onClick={() => navigate("/dashboard/payment-links")}>Payment Links</button>
                <ChevronRight className="w-4 h-4 text-[#9ca3af]" />
            </div>

            <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[12px] font-semibold text-[#8792a2] uppercase">Enlace de pago</p>
                        <div className="mt-2 flex items-center gap-3">
                            <h1 className="text-[26px] font-bold text-[#32325d]">{normalizedLink.name}</h1>
                            <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                                isActive ? "bg-[#e8f7e7] text-[#2f855a]" : "bg-gray-100 text-[#6b7280]"
                            )}>
                                {isActive ? "Activo" : "Desactivado"}
                            </span>
                        </div>
                        <p className="mt-2 text-[13px] text-[#6b7280]">
                            Copia y comparte para empezar a aceptar pagos con este enlace.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleToggleStatus}
                        className="rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                    >
                        {isActive ? "Desactivar" : "Activar"}
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[280px] rounded-lg border border-gray-200 bg-white px-3 py-2 flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-[#8792a2]" />
                        <span className="text-[13px] text-[#32325d] truncate">{linkUrl}</span>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="ml-auto text-[#635bff] text-[12px] font-semibold hover:underline"
                        >
                            {copied ? "Copiado" : "Copiar"}
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                    >
                        <Share2 className="w-4 h-4 text-[#8792a2]" />
                        Compartir
                    </button>
                    {shareHint && (
                        <span className="text-[12px] text-[#6b7280]">{shareHint}</span>
                    )}
                </div>
            </div>

            <div className="mt-6 border-b border-gray-200 flex items-center gap-6 text-[13px] font-semibold text-[#6b7280]">
                <button className="pb-2.5 border-b-2 border-[#635bff] text-[#635bff]">Resumen</button>
                <button className="pb-2.5 text-[#9ca3af]">Pagos y análisis</button>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-[16px] font-semibold text-[#32325d] mb-4">Identificación y estado</h2>
                        <div className="grid gap-4 text-[13px] text-[#4f5b76]">
                            <div className="flex items-center justify-between">
                                <span>Estado del enlace</span>
                                <button
                                    type="button"
                                    onClick={handleToggleStatus}
                                    className={cn(
                                        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-semibold",
                                        isActive
                                            ? "border-[#bbf7d0] bg-[#e8f7e7] text-[#2f855a]"
                                            : "border-gray-200 bg-gray-50 text-[#6b7280]"
                                    )}
                                >
                                    <span className={cn(
                                        "w-2 h-2 rounded-full",
                                        isActive ? "bg-[#22c55e]" : "bg-[#9ca3af]"
                                    )} />
                                    {isActive ? "Activo" : "Desactivado"}
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Fecha de creación</span>
                                <span className="text-[#32325d]">{formatDateTime(normalizedLink.createdAt)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>URL del enlace</span>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="text-[#635bff] font-semibold inline-flex items-center gap-1"
                                >
                                    Copiar enlace
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-[16px] font-semibold text-[#32325d] mb-4">Producto y precio</h2>
                        <div className="grid gap-4">
                            <label className="text-[12px] text-[#6b7280]">Producto asociado</label>
                            <input
                                value={normalizedLink.productName}
                                onChange={handleProductNameChange}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px] gap-3">
                                <div>
                                    <label className="text-[12px] text-[#6b7280]">Precio predeterminado</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={normalizedLink.amount}
                                        onChange={handleAmountChange}
                                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[12px] text-[#6b7280]">Moneda</label>
                                    <select
                                        value={normalizedLink.currencyCode}
                                        onChange={handleCurrencyChange}
                                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                                    >
                                        {CURRENCY_OPTIONS.map((currency) => (
                                            <option key={currency.code} value={currency.code}>{currency.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={handleToggleEditable}
                                        className="w-full inline-flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-[#32325d]"
                                    >
                                        <span>Precio editable</span>
                                        {normalizedLink.allowCustomerAmount ? (
                                            <Check className="w-4 h-4 text-[#22c55e]" />
                                        ) : (
                                            <span className="text-[#9ca3af]">No</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="text-[12px] text-[#6b7280]">
                                {normalizedLink.allowCustomerAmount
                                    ? `El cliente podrá editar el importe (${normalizedLink.currencyCode}).`
                                    : "El importe es fijo para todos los clientes."}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[16px] font-semibold text-[#32325d]">Métodos de pago</h2>
                            <span className="text-[12px] text-[#6b7280]">{enabledMethods.length} activos</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {normalizedLink.paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => handleToggleMethod(method.id)}
                                    className={cn(
                                        "flex items-center justify-between rounded-lg border px-3 py-2 text-[13px]",
                                        method.enabled
                                            ? "border-[#93c5fd] bg-[#eff6ff] text-[#1d4ed8]"
                                            : "border-gray-200 text-[#4f5b76]"
                                    )}
                                >
                                    <span>{method.label}</span>
                                    {method.enabled ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <span className="text-[11px] text-[#9ca3af]">No</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="mt-3 text-[12px] text-[#6b7280]">
                            Solo muestra los métodos de pago habilitados para tu integración actual.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-[16px] font-semibold text-[#32325d] mb-4">Checkout básico</h2>
                        <div className="grid gap-3 text-[13px] text-[#4f5b76]">
                            <div className="flex items-center justify-between">
                                <span>Correo electrónico</span>
                                <span className="text-[#32325d] font-semibold">Requerido</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Dirección</span>
                                <span className="text-[#9ca3af]">No se solicita</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Teléfono</span>
                                <span className="text-[#9ca3af]">No</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Nombre completo</span>
                                <span className="text-[#9ca3af]">No</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Nombre de empresa</span>
                                <span className="text-[#9ca3af]">No</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-[16px] font-semibold text-[#32325d] mb-4">Post-pago</h2>
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-[#4f5b76]">Página de confirmación</span>
                                <span className="text-[13px] text-[#32325d]">{normalizedLink.confirmationPage}</span>
                            </div>
                            <div>
                                <label className="text-[12px] text-[#6b7280]">Botón de acción</label>
                                <input
                                    value={normalizedLink.buttonLabel}
                                    onChange={handleButtonLabelChange}
                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[16px] font-semibold text-[#32325d]">Vista previa</h2>
                            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-semibold text-[#32325d]">
                                <ExternalLink className="w-4 h-4 text-[#8792a2]" />
                                Editar
                            </button>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-4 space-y-4">
                            <div>
                                <div className="text-[12px] text-[#9ca3af]">{normalizedLink.productName}</div>
                                <div className="text-[20px] font-semibold text-[#32325d]">
                                    {normalizedLink.allowCustomerAmount
                                        ? `A elección del cliente (${normalizedLink.currencyCode})`
                                        : formatAmount(normalizedLink.amount, normalizedLink.currencyCode)}
                                </div>
                                {normalizedLink.allowCustomerAmount && (
                                    <button className="mt-2 text-[12px] text-[#635bff] font-semibold">Cambiar importe</button>
                                )}
                            </div>
                            <div>
                                <label className="text-[12px] text-[#6b7280]">Correo electrónico</label>
                                <input
                                    disabled
                                    placeholder="correo@ejemplo.com"
                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-[#9ca3af]"
                                />
                            </div>
                            <div>
                                <div className="text-[12px] text-[#6b7280] mb-2">Método de pago</div>
                                <div className="space-y-2">
                                    {enabledMethods.length === 0 && (
                                        <div className="text-[12px] text-[#9ca3af]">Sin métodos habilitados</div>
                                    )}
                                    {enabledMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-[12px] text-[#4f5b76]"
                                        >
                                            <span>{method.label}</span>
                                            <span className="text-[#9ca3af]">Disponible</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="w-full rounded-lg bg-[#2563eb] text-white py-2 text-[13px] font-semibold">
                                {normalizedLink.buttonLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
