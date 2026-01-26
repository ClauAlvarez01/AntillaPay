import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CURRENCIES = [
    { code: "USD", label: "USD", symbol: "US$" },
    { code: "EUR", label: "EUR", symbol: "€" },
    { code: "GBP", label: "GBP", symbol: "£" }
];

const formatCurrency = (value, currencyCode, symbol) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    const formatted = new Intl.NumberFormat("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(safeValue);
    return `${formatted} ${symbol || currencyCode}`;
};

const formatAmountLabel = (amount, currencyCode) => {
    const symbolMap = { USD: "US$", EUR: "€", GBP: "£" };
    const symbol = symbolMap[currencyCode] || currencyCode;
    return formatCurrency(amount, currencyCode, symbol);
};

export default function ProductCreate() {
    const navigate = useNavigate();
    const location = useLocation();
    const editingProduct = location.state?.productToEdit || null;
    const priceToEditId = location.state?.priceToEditId || null;
    const openAddPriceOnLoad = location.state?.openAddPrice || false;
    const fileInputRef = useRef(null);
    const priceMenuRef = useRef(null);
    const [showPreview, setShowPreview] = useState(true);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageName, setImageName] = useState("");
    const billingType = "one_time";
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [quantity, setQuantity] = useState("1");
    const [prices, setPrices] = useState([]);
    const [openPriceMenuId, setOpenPriceMenuId] = useState(null);
    const [priceModalOpen, setPriceModalOpen] = useState(false);
    const [priceModalMode, setPriceModalMode] = useState("create");
    const [priceDraftAmount, setPriceDraftAmount] = useState("");
    const [priceDraftCurrency, setPriceDraftCurrency] = useState("USD");
    const [editingPriceId, setEditingPriceId] = useState(null);

    const selectedCurrency = CURRENCIES.find((item) => item.code === currency) || CURRENCIES[0];
    const quantityValue = Math.max(1, parseInt(quantity, 10) || 1);
    const numericAmount = parseFloat(amount.replace(",", ".")) || 0;
    const lineTotal = numericAmount * quantityValue;
    const totalLabel = "Total";
    const canSubmit = name.trim().length > 0 && numericAmount > 0;

    const totalFormatted = useMemo(
        () => formatCurrency(lineTotal, selectedCurrency.code, selectedCurrency.symbol),
        [lineTotal, selectedCurrency]
    );
    const unitFormatted = useMemo(
        () => formatCurrency(numericAmount, selectedCurrency.code, selectedCurrency.symbol),
        [numericAmount, selectedCurrency]
    );

    useEffect(() => {
        if (!editingProduct) return;
        setName(editingProduct.name || "");
        setDescription(editingProduct.description || "");
        setAmount(editingProduct.amount != null ? String(editingProduct.amount) : "");
        setCurrency(editingProduct.currency || "USD");
        setQuantity(editingProduct.quantity != null ? String(editingProduct.quantity) : "1");
        setImageUrl(editingProduct.imageUrl || "");
        setImageName(editingProduct.imageName || "");
        if (editingProduct.prices && editingProduct.prices.length > 0) {
            setPrices(editingProduct.prices);
            const defaultPrice = editingProduct.prices.find((price) => price.isDefault) || editingProduct.prices[0];
            if (defaultPrice) {
                setAmount(defaultPrice.amount != null ? String(defaultPrice.amount) : "");
                setCurrency(defaultPrice.currency || "USD");
            }
        } else {
            const fallbackAmount = editingProduct.amount != null ? editingProduct.amount : 0;
            const fallbackCurrency = editingProduct.currency || "USD";
            setPrices([
                {
                    id: `price_${Date.now()}`,
                    amount: fallbackAmount,
                    currency: fallbackCurrency,
                    isDefault: true,
                    status: "Activo",
                    used: false
                }
            ]);
        }
    }, [editingProduct]);

    useEffect(() => {
        if (!editingProduct || prices.length === 0) return;
        const defaultPrice = prices.find((price) => price.isDefault) || prices[0];
        if (!defaultPrice) return;
        setAmount(defaultPrice.amount != null ? String(defaultPrice.amount) : "");
        setCurrency(defaultPrice.currency || "USD");
    }, [editingProduct, prices]);

    useEffect(() => {
        if (!editingProduct || !priceToEditId || prices.length === 0) return;
        const target = prices.find((price) => price.id === priceToEditId);
        if (!target) return;
        openEditPriceModal(target);
    }, [editingProduct, priceToEditId, prices]);

    useEffect(() => {
        if (!editingProduct || !openAddPriceOnLoad || prices.length === 0) return;
        openAddPriceModal();
    }, [editingProduct, openAddPriceOnLoad, prices]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (priceMenuRef.current && !priceMenuRef.current.contains(event.target)) {
                setOpenPriceMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            setImageUrl("");
            setImageName("");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            return;
        }
        const nextUrl = URL.createObjectURL(file);
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
        setImageUrl(nextUrl);
        setImageName(file.name);
    };

    const handleCreateProduct = () => {
        if (!canSubmit) return;
        const now = new Date();
        const stored = window.localStorage.getItem("antillapay_products");
        const existing = stored ? JSON.parse(stored) : [];

        if (editingProduct) {
            const nextPrices = prices.length
                ? prices
                : [
                    {
                        id: `price_${now.getTime()}`,
                        amount: numericAmount,
                        currency,
                        isDefault: true,
                        status: "Activo",
                        used: false
                    }
                ];
            const defaultPrice = nextPrices.find((price) => price.isDefault) || nextPrices[0];
            const updated = existing.map((item) => {
                if (item.id !== editingProduct.id) return item;
                return {
                    ...item,
                    name: name.trim(),
                    description: description.trim(),
                    imageUrl,
                    imageName,
                    currency: defaultPrice?.currency || currency,
                    amount: defaultPrice?.amount ?? numericAmount,
                    billingType,
                    quantity: quantityValue,
                    prices: nextPrices
                };
            });
            window.localStorage.setItem("antillapay_products", JSON.stringify(updated));
        } else {
            const id = `prod_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`;
            const primaryPrice = {
                id: `price_${now.getTime()}_${Math.random().toString(36).slice(2, 6)}`,
                amount: numericAmount,
                currency,
                isDefault: true,
                status: "Activo",
                used: false
            };
            const newProduct = {
                id,
                name: name.trim(),
                description: description.trim(),
                status: "Activo",
                createdAt: now.toISOString(),
                imageUrl,
                imageName,
                currency,
                amount: numericAmount,
                billingType,
                quantity: quantityValue,
                prices: [primaryPrice]
            };
            window.localStorage.setItem("antillapay_products", JSON.stringify([newProduct, ...existing]));
        }
        navigate("/dashboard/product-catalog");
    };

    const openAddPriceModal = () => {
        setPriceModalMode("create");
        setEditingPriceId(null);
        setPriceDraftAmount("");
        setPriceDraftCurrency("USD");
        setPriceModalOpen(true);
    };

    const openEditPriceModal = (price) => {
        setPriceModalMode("edit");
        setEditingPriceId(price.id);
        setPriceDraftAmount(String(price.amount ?? ""));
        setPriceDraftCurrency(price.currency || "USD");
        setPriceModalOpen(true);
    };

    const handleSavePrice = () => {
        const parsedAmount = parseFloat(priceDraftAmount.replace(",", ".")) || 0;
        if (parsedAmount <= 0) return;

        if (priceModalMode === "edit" && editingPriceId) {
            setPrices((prev) =>
                prev.map((price) =>
                    price.id === editingPriceId
                        ? { ...price, amount: parsedAmount, currency: priceDraftCurrency }
                        : price
                )
            );
        } else {
            const newPrice = {
                id: `price_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                amount: parsedAmount,
                currency: priceDraftCurrency,
                isDefault: prices.length === 0,
                status: "Activo",
                used: false
            };
            setPrices((prev) => [...prev, newPrice]);
        }
        setPriceModalOpen(false);
    };

    const handleDuplicatePrice = (price) => {
        const duplicated = {
            ...price,
            id: `price_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            isDefault: false,
            status: "Activo",
            used: false
        };
        setPrices((prev) => [...prev, duplicated]);
    };

    const handleSetDefaultPrice = (priceId) => {
        setPrices((prev) =>
            prev.map((price) => ({
                ...price,
                isDefault: price.id === priceId
            }))
        );
    };

    const handleRemovePrice = (price) => {
        if (price.used) {
            setPrices((prev) => {
                const next = prev.map((item) =>
                    item.id === price.id
                        ? { ...item, status: "Archivado", isDefault: false }
                        : item
                );
                if (price.isDefault) {
                    const nextDefault = next.find((item) => item.status !== "Archivado");
                    if (nextDefault) {
                        return next.map((item) => ({
                            ...item,
                            isDefault: item.id === nextDefault.id
                        }));
                    }
                }
                return next;
            });
            return;
        }
        setPrices((prev) => {
            const remaining = prev.filter((item) => item.id !== price.id);
            if (!price.isDefault || remaining.length === 0) return remaining;
            return remaining.map((item, index) => ({ ...item, isDefault: index === 0 }));
        });
    };

    return (
        <div className="w-full min-h-screen bg-white flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                    <span className="text-[18px] font-semibold text-[#32325d]">
                        {editingProduct ? "Actualiza un producto" : "Añade un producto"}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setShowPreview((prev) => !prev)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                    >
                        {showPreview ? "Cierra la vista previa" : "Muestra la vista previa"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/product-catalog")}
                        className="text-[#8792a2] hover:text-[#32325d] transition-colors"
                        aria-label="Cerrar creación de producto"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-1">
                <div className={cn("flex-1 overflow-y-auto", showPreview ? "border-r border-gray-200" : "")}>
                    <div className="px-8 py-6 max-w-[760px]">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#1f2937] mb-1">
                                    Nombre (obligatorio)
                                </label>
                                <p className="text-[12px] text-[#6b7280] mb-2">
                                    Nombre del producto o servicio, visible para los clientes.
                                </p>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[14px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-semibold text-[#1f2937] mb-1">
                                    Descripción
                                </label>
                                <p className="text-[12px] text-[#6b7280] mb-2">
                                    Aparece en el proceso de compra, en el portal de clientes y en los presupuestos.
                                </p>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-[14px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-semibold text-[#1f2937] mb-1">
                                    Imagen
                                </label>
                                <p className="text-[12px] text-[#6b7280] mb-2">
                                    Aparece al finalizar una compra. JPEG, PNG o WEBP de menos de 2 MB.
                                </p>
                                <div className="flex items-center gap-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                                    >
                                        <Upload className="w-4 h-4 text-[#8792a2]" />
                                        Cargar
                                    </button>
                                    {imageName && (
                                        <span className="text-[12px] text-[#6b7280]">{imageName}</span>
                                    )}
                                </div>
                            </div>

                        </div>

                        <div className="my-6 border-t border-gray-200" />

                        <div className="space-y-4">
                            <h3 className="text-[16px] font-semibold text-[#1f2937]">Tarifas</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="rounded-lg border border-[#635bff] bg-[#f4f3ff] px-4 py-2 text-[13px] font-semibold text-[#635bff]">
                                    Pago único
                                </div>
                            </div>

                            {!editingProduct && (
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#1f2937] mb-2">
                                        Importe (obligatorio)
                                    </label>
                                    <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                                        <span className="px-3 text-[13px] text-[#6b7280]">{selectedCurrency.symbol}</span>
                                        <input
                                            type="text"
                                            value={amount}
                                            onChange={(event) => setAmount(event.target.value)}
                                            placeholder="0"
                                            className="flex-1 px-2 py-2 text-[14px] text-[#111827] focus:outline-none"
                                        />
                                        <select
                                            value={currency}
                                            onChange={(event) => setCurrency(event.target.value)}
                                            className="border-l border-gray-200 bg-white px-3 py-2 text-[13px] text-[#4b5563] focus:outline-none"
                                        >
                                            {CURRENCIES.map((item) => (
                                                <option key={item.code} value={item.code}>
                                                    {item.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {editingProduct && (
                                <div className="space-y-4">
                                    <div className="space-y-4">
                                        {prices.map((price) => (
                                            <div key={price.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                                                <div>
                                                    <div className="text-[18px] font-semibold text-[#635bff]">
                                                        {formatAmountLabel(price.amount, price.currency)}
                                                    </div>
                                                    <div className="text-[13px] text-[#6b7280]">Pago único</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {price.isDefault && (
                                                        <span className="px-3 py-1 rounded-full border border-[#93c5fd] bg-[#eff6ff] text-[#2563eb] text-[12px] font-semibold">
                                                            Predeterminado
                                                        </span>
                                                    )}
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => setOpenPriceMenuId(openPriceMenuId === price.id ? null : price.id)}
                                                            className="w-10 h-9 rounded-lg border border-gray-200 text-[#6b7280] hover:border-[#cbd5f5]"
                                                        >
                                                            ...
                                                        </button>
                                                        {openPriceMenuId === price.id && (
                                                            <div className="absolute right-0 top-11 z-20">
                                                                <div
                                                                    ref={priceMenuRef}
                                                                    className="w-72 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
                                                                >
                                                                    {!price.isDefault && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                handleSetDefaultPrice(price.id);
                                                                                setOpenPriceMenuId(null);
                                                                            }}
                                                                            className="w-full text-left px-4 py-3 text-[14px] text-[#635bff] hover:bg-[#f5f6ff]"
                                                                        >
                                                                            Establecer como precio predeterminado
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            openEditPriceModal(price);
                                                                            setOpenPriceMenuId(null);
                                                                        }}
                                                                        className="w-full text-left px-4 py-3 text-[14px] text-[#635bff] hover:bg-[#f5f6ff]"
                                                                    >
                                                                        Editar precio
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            handleDuplicatePrice(price);
                                                                            setOpenPriceMenuId(null);
                                                                        }}
                                                                        className="w-full text-left px-4 py-3 text-[14px] text-[#635bff] hover:bg-[#f5f6ff]"
                                                                    >
                                                                        Duplicar precio
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            handleRemovePrice(price);
                                                                            setOpenPriceMenuId(null);
                                                                        }}
                                                                        className="w-full text-left px-4 py-3 text-[14px] text-[#ef4444] hover:bg-red-50"
                                                                    >
                                                                        {price.used ? "Archivar precio" : "Eliminar precio"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={openAddPriceModal}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#bfd8ff] px-4 py-3 text-[14px] font-semibold text-[#4f5b76] hover:border-[#93c5fd] transition-colors"
                                    >
                                        <span className="text-[18px]">+</span>
                                        Añadir otro precio
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showPreview && (
                    <div className="w-[420px] bg-[#f6f7f9] p-8">
                        <div>
                            <h2 className="text-[18px] font-semibold text-[#32325d]">Vista previa</h2>
                            <p className="text-[13px] text-[#6b7280] mt-1">
                                Calcula los importes totales de acuerdo con el modelo de precios, la cantidad unitaria y los impuestos.
                            </p>
                        </div>

                        <div className="mt-6 space-y-6">
                            <div>
                                <label className="block text-[13px] font-semibold text-[#1f2937] mb-2">
                                    Cantidad por unidad
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(event) => setQuantity(event.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[14px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                                />
                            </div>

                            <div className="border-t border-gray-200" />

                            <div className="text-[14px] text-[#4b5563]">
                                {quantityValue} × {unitFormatted} = <span className="font-semibold text-[#1f2937]">{totalFormatted}</span>
                            </div>

                            <div className="border-t border-gray-200" />

                            <div className="space-y-2 text-[14px] text-[#4b5563]">
                                <div className="flex items-center justify-between">
                                    <span>{totalLabel}</span>
                                    <span className="font-semibold text-[#1f2937]">{totalFormatted}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/product-catalog")}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-[13px] font-semibold text-[#374151] hover:bg-gray-50"
                >
                    Cancelar
                </button>
                    <Button
                        onClick={handleCreateProduct}
                        disabled={!canSubmit}
                        className={cn(
                            "rounded-lg px-4 py-2 text-[13px] font-semibold text-white",
                            canSubmit ? "bg-[#635bff] hover:bg-[#5851e0]" : "bg-[#c4c7ff] cursor-not-allowed"
                        )}
                    >
                        {editingProduct ? "Actualizar producto" : "Añadir producto"}
                    </Button>
            </div>

            {priceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
                    <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl border border-gray-200">
                        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                            <h3 className="text-[18px] font-semibold text-[#1a1f36]">
                                {priceModalMode === "edit" ? "Editar precio" : "Añadir precio"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setPriceModalOpen(false)}
                                className="rounded-xl border border-transparent p-1.5 text-[#9ca3af] hover:text-[#4b5563]"
                                aria-label="Cerrar"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-[13px] font-semibold text-[#1f2937] mb-2">
                                    Importe (obligatorio)
                                </label>
                                <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                                    <span className="px-3 text-[13px] text-[#6b7280]">
                                        {CURRENCIES.find((item) => item.code === priceDraftCurrency)?.symbol || "US$"}
                                    </span>
                                    <input
                                        type="text"
                                        value={priceDraftAmount}
                                        onChange={(event) => setPriceDraftAmount(event.target.value)}
                                        placeholder="0"
                                        className="flex-1 px-2 py-2 text-[14px] text-[#111827] focus:outline-none"
                                    />
                                    <select
                                        value={priceDraftCurrency}
                                        onChange={(event) => setPriceDraftCurrency(event.target.value)}
                                        className="border-l border-gray-200 bg-white px-3 py-2 text-[13px] text-[#4b5563] focus:outline-none"
                                    >
                                        {CURRENCIES.map((item) => (
                                            <option key={item.code} value={item.code}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <p className="text-[12px] text-[#6b7280] mt-2">
                                    Para MVP de pagos únicos, añade precios por moneda o por nivel comercial/promo.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setPriceModalOpen(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-[13px] font-semibold text-[#374151] hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSavePrice}
                                className="rounded-lg bg-[#635bff] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#5851e0]"
                            >
                                {priceModalMode === "edit" ? "Guardar precio" : "Añadir precio"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
