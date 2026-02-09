import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, ChevronRight, Copy, MoreHorizontal, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "--";
    const formatter = new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short"
    });
    return formatter.format(date).replace(".", "");
};

const formatAmount = (amountValue, currencyValue) => {
    const symbolMap = { USD: "US$", EUR: "€", GBP: "£" };
    const currency = currencyValue || "USD";
    const amount = typeof amountValue === "number" ? amountValue : parseFloat(amountValue || "0");
    const formatted = new Intl.NumberFormat("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number.isFinite(amount) ? amount : 0);
    return `${symbolMap[currency] || currency} ${formatted}`;
};

export default function ProductDetail({ productId: productIdProp }) {
    const navigate = useNavigate();
    const params = useParams();
    const productId = productIdProp || params.productId;
    const [openProductMenu, setOpenProductMenu] = useState(false);
    const [openPriceMenuId, setOpenPriceMenuId] = useState(null);
    const [copied, setCopied] = useState(false);
    const [crossSellQuery, setCrossSellQuery] = useState("");
    const [showCrossSellMenu, setShowCrossSellMenu] = useState(false);
    const crossSellRef = useRef(null);

    const [products, setProducts] = useState(() => {
        if (typeof window === "undefined") return [];
        const stored = window.localStorage.getItem("antillapay_products");
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return parsed.map(p => ({
            ...p,
            status: p.status === "Archivado" ? "Inactivo" : p.status,
            prices: (p.prices || []).map(pr => ({
                ...pr,
                status: pr.status === "Archivado" ? "Inactivo" : pr.status
            }))
        }));
    });
    const product = products.find((item) => item.id === productId);

    const prices = product?.prices?.length ? product.prices : [];
    const productStatus = product?.status || "Activo";
    const productUsed = product?.used || prices.some((price) => price.used);
    const isInactive = productStatus === "Inactivo";
    const defaultPrice = prices.find((price) => price.isDefault) || prices[0];
    const otherPrices = prices.filter((price) => price.id !== defaultPrice?.id);
    const availableCurrencies = Array.from(
        new Set(prices.map((price) => price.currency).filter(Boolean))
    );
    const crossSellProductIds = Array.isArray(product?.crossSellProductIds)
        ? product.crossSellProductIds
        : product?.crossSellProductId
            ? [product.crossSellProductId]
            : [];
    const crossSellProducts = products.filter((item) => crossSellProductIds.includes(item.id));
    const crossSellOptions = products
        .filter((item) => item.id !== productId && !crossSellProductIds.includes(item.id))
        .filter((item) => {
            if (!crossSellQuery.trim()) return true;
            return item.name.toLowerCase().includes(crossSellQuery.trim().toLowerCase());
        });
    const linksCount = typeof product?.linksCount === "number" ? product.linksCount : 0;
    const lastUsedAt = product?.lastUsedAt || null;
    const revenueTotal = typeof product?.revenueTotal === "number" ? product.revenueTotal : null;

    const handleSaveProducts = (nextProducts) => {
        setProducts(nextProducts);
        window.localStorage.setItem("antillapay_products", JSON.stringify(nextProducts));
    };

    const handleArchiveProduct = () => {
        const nextProducts = products.map((item) =>
            item.id === productId ? { ...item, status: "Inactivo" } : item
        );
        handleSaveProducts(nextProducts);
        setOpenProductMenu(false);
    };

    const handleDeleteProduct = () => {
        if (productUsed) {
            handleArchiveProduct();
            return;
        }
        const nextProducts = products.filter((item) => item.id !== productId);
        handleSaveProducts(nextProducts);
        navigate("/dashboard/product-catalog");
    };

    const handleSetDefaultPrice = (priceId) => {
        const nextProducts = products.map((item) => {
            if (item.id !== productId) return item;
            const nextPrices = (item.prices || []).map((price) => ({
                ...price,
                isDefault: price.id === priceId
            }));
            return { ...item, prices: nextPrices };
        });
        handleSaveProducts(nextProducts);
    };

    const handleDuplicatePrice = (price) => {
        const nextProducts = products.map((item) => {
            if (item.id !== productId) return item;
            const nextPrices = [
                ...(item.prices || []),
                {
                    ...price,
                    id: `price_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                    isDefault: false,
                    status: "Activo",
                    used: false
                }
            ];
            return { ...item, prices: nextPrices };
        });
        handleSaveProducts(nextProducts);
        setOpenPriceMenuId(null);
    };

    const handleArchiveOrDeletePrice = (price) => {
        const nextProducts = products.map((item) => {
            if (item.id !== productId) return item;
            if (price.used) {
                const nextPrices = (item.prices || []).map((itemPrice) =>
                    itemPrice.id === price.id
                        ? { ...itemPrice, status: "Inactivo", isDefault: false }
                        : itemPrice
                );
                const nextDefault = nextPrices.find((itemPrice) => itemPrice.status !== "Inactivo");
                const normalized = nextDefault
                    ? nextPrices.map((itemPrice) => ({
                        ...itemPrice,
                        isDefault: itemPrice.id === nextDefault.id
                    }))
                    : nextPrices;
                return { ...item, prices: normalized };
            }
            const nextPrices = (item.prices || []).filter((itemPrice) => itemPrice.id !== price.id);
            if (!price.isDefault || nextPrices.length === 0) {
                return { ...item, prices: nextPrices };
            }
            return {
                ...item,
                prices: nextPrices.map((itemPrice, index) => ({
                    ...itemPrice,
                    isDefault: index === 0
                }))
            };
        });
        handleSaveProducts(nextProducts);
        setOpenPriceMenuId(null);
    };

    const handleCopyId = async () => {
        if (!product?.id) return;
        await navigator.clipboard.writeText(product.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (crossSellRef.current && !crossSellRef.current.contains(event.target)) {
                setShowCrossSellMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectCrossSell = (targetProduct) => {
        const nextProducts = products.map((item) =>
            item.id === productId
                ? {
                    ...item,
                    crossSellProductIds: Array.from(new Set([...(crossSellProductIds || []), targetProduct.id]))
                }
                : item
        );
        handleSaveProducts(nextProducts);
        setCrossSellQuery("");
        setShowCrossSellMenu(false);
    };

    const handleClearCrossSell = (removeId) => {
        const nextProducts = products.map((item) =>
            item.id === productId
                ? {
                    ...item,
                    crossSellProductIds: (crossSellProductIds || []).filter((id) => id !== removeId)
                }
                : item
        );
        handleSaveProducts(nextProducts);
        setCrossSellQuery("");
    };

    const breadcrumb = useMemo(() => (
        <div className="flex items-center gap-2 text-[13px] text-[#635bff] font-semibold">
            <span className="cursor-pointer" onClick={() => navigate("/dashboard/product-catalog")}>
                Productos
            </span>
            <ChevronRight className="w-4 h-4 text-[#9ca3af]" />
        </div>
    ), [navigate]);

    if (!product) {
        return (
            <div className="w-full p-10">
                <p className="text-[14px] text-[#6b7280]">No encontramos el producto.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <div className="space-y-3">
                    {breadcrumb}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#f4f5f7] flex items-center justify-center overflow-hidden">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <Box className="w-6 h-6 text-[#9ca3af]" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-[26px] font-bold text-[#32325d]">{product.name}</h1>
                                <span className={cn(
                                    "px-2.5 py-0.5 rounded-lg text-[11px] font-semibold",
                                    productStatus === "Inactivo"
                                        ? "bg-gray-100 text-[#6b7280]"
                                        : "bg-[#e8f7e7] text-[#2f855a]"
                                )}>
                                    {productStatus === "Inactivo" ? "Inactivo" : "Activo"}
                                </span>
                            </div>
                            <p className="text-[13px] text-[#6b7280]">
                                {prices.length} precios
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/products/create", { state: { productToEdit: product } })}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5] hover:bg-white active:bg-white focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                    >
                        Editar producto
                    </button>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setOpenProductMenu((prev) => !prev)}
                            className="w-10 h-9 rounded-lg border border-gray-200 text-[#6b7280] hover:border-[#cbd5f5]"
                        >
                            <MoreHorizontal className="w-4 h-4 mx-auto" />
                        </button>
                        {openProductMenu && (
                            <div className="absolute right-0 top-11 z-20">
                                <div className="w-56 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigate("/dashboard/products/create", { state: { productToEdit: product } });
                                            setOpenProductMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-[14px] text-[#32325d] hover:bg-gray-50"
                                    >
                                        Editar producto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const nextStatus = productStatus === "Inactivo" ? "Activo" : "Inactivo";
                                            const nextProducts = products.map((item) =>
                                                item.id === productId ? { ...item, status: nextStatus } : item
                                            );
                                            handleSaveProducts(nextProducts);
                                            setOpenProductMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-[14px] text-[#32325d] hover:bg-gray-50"
                                    >
                                        {productStatus === "Inactivo" ? "Activar producto" : "Inactivar producto"}
                                    </button>
                                    {!productUsed && (
                                        <button
                                            type="button"
                                            onClick={handleDeleteProduct}
                                            className="w-full text-left px-4 py-3 text-[14px] text-[#ef4444] hover:bg-red-50"
                                        >
                                            Eliminar producto
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_0.65fr]">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[18px] font-semibold text-[#32325d]">Tarifas</h2>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard/products/create", { state: { productToEdit: product, openAddPrice: true } })}
                            disabled={isInactive}
                            className={cn(
                                "w-9 h-9 rounded-lg border border-gray-200 text-[#6b7280]",
                                isInactive ? "cursor-not-allowed opacity-50" : "hover:border-[#cbd5f5]"
                            )}
                        >
                            <Plus className="w-4 h-4 mx-auto" />
                        </button>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-4 text-[13px] font-semibold text-[#6b7280] border-b border-gray-200">
                            <div>Precio</div>
                            <div>Descripción</div>
                            <div>Fecha de creación</div>
                            <div />
                        </div>
                        {prices.map((price) => (
                            <div
                                key={price.id}
                                className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-4 text-[14px] text-[#32325d] border-b border-gray-100 last:border-b-0"
                            >
                                <div>
                                    <div className="text-[16px] font-semibold text-[#32325d]">
                                        {formatAmount(price.amount, price.currency)}
                                    </div>
                                    {price.isDefault && (
                                        <span className="mt-1 inline-flex items-center rounded-lg border border-[#93c5fd] bg-[#eff6ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#2563eb]">
                                            Predeterminado
                                        </span>
                                    )}
                                </div>
                                <div className="text-[#6b7280]">—</div>
                                <div className="text-[#6b7280]">{formatDate(product.createdAt)}</div>
                                <div className="relative flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setOpenPriceMenuId(openPriceMenuId === price.id ? null : price.id)}
                                        className="w-10 h-9 rounded-lg border border-gray-200 text-[#6b7280] hover:border-[#cbd5f5]"
                                    >
                                        ...
                                    </button>
                                    {openPriceMenuId === price.id && (
                                        <div className="absolute right-0 top-11 z-20">
                                            <div className="w-64 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                                                {!price.isDefault && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            handleSetDefaultPrice(price.id);
                                                            setOpenPriceMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-3 text-[14px] text-[#635bff] hover:bg-[#f5f6ff]"
                                                    >
                                                        Establecer como predeterminado
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigate("/dashboard/products/create", {
                                                            state: { productToEdit: product, priceToEditId: price.id }
                                                        });
                                                        setOpenPriceMenuId(null);
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-[14px] text-[#635bff] hover:bg-[#f5f6ff]"
                                                >
                                                    Editar precio
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDuplicatePrice(price)}
                                                    className="w-full text-left px-4 py-3 text-[14px] text-[#635bff] hover:bg-[#f5f6ff]"
                                                >
                                                    Duplicar precio
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleArchiveOrDeletePrice(price)}
                                                    className="w-full text-left px-4 py-3 text-[14px] text-[#ef4444] hover:bg-red-50"
                                                >
                                                    {price.used ? "Inactivar precio" : "Eliminar precio"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10">
                        <h3 className="text-[18px] font-semibold text-[#32325d]">Venta cruzada</h3>
                        <p className="mt-2 text-[13px] text-[#6b7280] max-w-[520px]">
                            Sugiere un producto relacionado para que los clientes lo añadan a su pedido, directamente en el Checkout.
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <span className="text-[13px] text-[#4f5b76]">Venta cruzada a</span>
                            <div ref={crossSellRef} className="relative w-full max-w-[360px]">
                                <input
                                    type="text"
                                    value={crossSellQuery}
                                    onChange={(event) => {
                                        setCrossSellQuery(event.target.value);
                                        setShowCrossSellMenu(true);
                                    }}
                                    onFocus={() => setShowCrossSellMenu(true)}
                                    placeholder="Buscar un producto..."
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                                />
                                {showCrossSellMenu && (
                                    <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-20">
                                        <button
                                            type="button"
                                            onClick={() => navigate("/dashboard/products/create")}
                                            className="w-full px-4 py-2.5 text-left text-[13px] font-semibold text-[#32325d] hover:bg-gray-50"
                                        >
                                            + Añadir un producto nuevo
                                        </button>
                                        {crossSellOptions.length === 0 && (
                                            <div className="px-4 py-3 text-[12px] text-[#6b7280]">Sin resultados</div>
                                        )}
                                        {crossSellOptions.map((item) => {
                                            const defaultItemPrice = item.prices?.find((price) => price.isDefault) || item.prices?.[0];
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleSelectCrossSell(item)}
                                                    className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                                                            <Box className="w-3.5 h-3.5 text-[#9ca3af]" />
                                                        </div>
                                                        <span className="text-[13px] text-[#32325d]">{item.name}</span>
                                                    </div>
                                                    {defaultItemPrice && (
                                                        <span className="text-[12px] text-[#6b7280]">
                                                            {formatAmount(defaultItemPrice.amount, defaultItemPrice.currency)}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                        {crossSellProducts.length > 0 && (
                            <div className="mt-3 ml-[118px] max-w-[360px] space-y-2">
                                {crossSellProducts.map((item) => {
                                    const defaultItemPrice = item.prices?.find((price) => price.isDefault) || item.prices?.[0];
                                    return (
                                        <div
                                            key={item.id}
                                            className="rounded-xl border border-gray-200 bg-white px-4 py-3 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                                                    <Box className="w-3.5 h-3.5 text-[#9ca3af]" />
                                                </div>
                                                <div className="text-[13px] text-[#32325d]">
                                                    {item.name}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {defaultItemPrice ? (
                                                    <span className="text-[12px] text-[#6b7280]">
                                                        {formatAmount(defaultItemPrice.amount, defaultItemPrice.currency)}
                                                    </span>
                                                ) : null}
                                                <button
                                                    type="button"
                                                    onClick={() => handleClearCrossSell(item.id)}
                                                    className="text-[12px] text-[#6b7280] hover:text-[#ef4444]"
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[16px] font-semibold text-[#32325d]">Detalles</h3>
                        </div>
                        <div className="space-y-4 text-[13px] text-[#4f5b76]">
                            <div>
                                <div className="text-[12px] text-[#6b7280] mb-1">Fecha de creación</div>
                                <div className="text-[#32325d]">{formatDate(product.createdAt)}</div>
                            </div>
                            <div>
                                <div className="text-[12px] text-[#6b7280] mb-1">Estado</div>
                                <div className="text-[#32325d]">{productStatus}</div>
                            </div>
                            {product.description && (
                                <div>
                                    <div className="text-[12px] text-[#6b7280] mb-1">Descripción</div>
                                    <div className="text-[#32325d]">{product.description}</div>
                                </div>
                            )}
                            {product.imageUrl && (
                                <div>
                                    <div className="text-[12px] text-[#6b7280] mb-1">Imagen</div>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                                        />
                                        <span className="text-[#32325d] text-[12px]">{product.imageName || "Imagen del producto"}</span>
                                    </div>
                                </div>
                            )}
                            <div>
                                <div className="text-[12px] text-[#6b7280] mb-1">Resumen de precios</div>
                                <div className="text-[#32325d]">
                                    Precio predeterminado: {defaultPrice ? formatAmount(defaultPrice.amount, defaultPrice.currency) : "—"}
                                </div>
                                {otherPrices.length > 0 && (
                                    <div className="text-[#32325d] mt-1">
                                        Otros precios: {otherPrices.length} ({otherPrices.map((price) => formatAmount(price.amount, price.currency)).join(", ")})
                                    </div>
                                )}
                                {availableCurrencies.length > 1 && (
                                    <div className="text-[#6b7280] mt-1">
                                        Monedas disponibles: {availableCurrencies.join(", ")}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="text-[12px] text-[#6b7280] mb-1">Uso</div>
                                <div className="text-[#32325d]">Usado en {linksCount} links de pago</div>
                                <div className="text-[#32325d] mt-1">
                                    Último uso: {lastUsedAt ? formatDate(lastUsedAt) : "—"}
                                </div>
                                <div className="text-[#32325d] mt-1">
                                    Ingresos totales: {revenueTotal != null ? formatAmount(revenueTotal, "USD") : "—"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[16px] font-semibold text-[#32325d]">Avanzado</h3>
                        </div>
                        <div className="space-y-2 text-[13px] text-[#4f5b76]">
                            <div className="text-[12px] text-[#6b7280]">ID del producto</div>
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                                <span className="text-[#32325d] font-mono text-[12px]">{product.id}</span>
                                <button
                                    type="button"
                                    onClick={handleCopyId}
                                    className="text-[#6b7280] hover:text-[#32325d] text-[12px] inline-flex items-center gap-1"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                    {copied ? "Copiado" : "Copiar"}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
