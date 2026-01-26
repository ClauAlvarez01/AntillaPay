import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    Box,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    CornerDownRight,
    Plus,
    Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRODUCT_TABS = [
    "Todos los productos"
];

const formatProductDate = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "--";
    const formatter = new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        hour12: false
    });
    const parts = formatter.formatToParts(date);
    const day = parts.find((part) => part.type === "day")?.value ?? "";
    const month = (parts.find((part) => part.type === "month")?.value ?? "").replace(".", "");
    const hour = parts.find((part) => part.type === "hour")?.value ?? "";
    const minute = parts.find((part) => part.type === "minute")?.value ?? "";
    return `${day} ${month} ${hour}:${minute}`;
};

const formatProductPrice = (product) => {
    const defaultPrice = product.prices?.find((price) => price.isDefault) || product.prices?.[0];
    const amountValue = defaultPrice?.amount ?? product.amount;
    const currencyValue = defaultPrice?.currency || product.currency || "USD";
    const amount = typeof amountValue === "number" ? amountValue : parseFloat(amountValue || "0");
    const currency = currencyValue || "USD";
    const symbolMap = { USD: "US$", EUR: "€", GBP: "£" };
    const symbol = symbolMap[currency] || currency;
    const formatted = new Intl.NumberFormat("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number.isFinite(amount) ? amount : 0);
    return `${symbol} ${formatted}`;
};

export default function ProductCatalog() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(PRODUCT_TABS[0]);
    const [products, setProducts] = useState(() => {
        if (typeof window === "undefined") return [];
        const stored = window.localStorage.getItem("antillapay_products");
        return stored ? JSON.parse(stored) : [];
    });

    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [statusFilterValue, setStatusFilterValue] = useState("Todo");
    const [appliedStatusFilter, setAppliedStatusFilter] = useState("Todo");
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

    const [showDateFilter, setShowDateFilter] = useState(false);
    const [dateFilterValue, setDateFilterValue] = useState("está en los últimos");
    const [dateNumberValue, setDateNumberValue] = useState("23");
    const [dateUnitValue, setDateUnitValue] = useState("días");
    const [timezoneValue, setTimezoneValue] = useState("GMT-5");
    const [appliedDateFilter, setAppliedDateFilter] = useState(null);
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showCopyHintId, setShowCopyHintId] = useState(null);

    const statusFilterRef = useRef(null);
    const statusDropdownRef = useRef(null);
    const dateFilterRef = useRef(null);
    const dateDropdownRef = useRef(null);
    const calendarRef = useRef(null);
    const startCalendarRef = useRef(null);
    const endCalendarRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem("antillapay_products", JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
                setShowCopyHintId(null);
            }
            if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
                if (!statusDropdownRef.current || !statusDropdownRef.current.contains(event.target)) {
                    setShowStatusFilter(false);
                    setIsStatusDropdownOpen(false);
                }
            } else if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setIsStatusDropdownOpen(false);
            }

            if (dateFilterRef.current && !dateFilterRef.current.contains(event.target)) {
                if (!dateDropdownRef.current || !dateDropdownRef.current.contains(event.target)) {
                    setShowDateFilter(false);
                    setIsDateDropdownOpen(false);
                    setShowCalendar(false);
                }
            } else if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
                setIsDateDropdownOpen(false);
            }

            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }

            if (startCalendarRef.current && !startCalendarRef.current.contains(event.target)) {
                setShowStartCalendar(false);
            }

            if (endCalendarRef.current && !endCalendarRef.current.contains(event.target)) {
                setShowEndCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const applyDateFilter = () => {
        const needsSingleDate = ["es igual a", "en esa fecha o después", "es anterior o igual al"].includes(dateFilterValue);
        const hasRange = dateFilterValue !== "entre" || (startDate && endDate);
        const hasSingleDate = !needsSingleDate || Boolean(selectedDate);
        if (!hasRange || !hasSingleDate) {
            setAppliedDateFilter(null);
            return;
        }

        setAppliedDateFilter({
            type: dateFilterValue,
            number: dateNumberValue,
            unit: dateUnitValue,
            timezone: timezoneValue,
            date: needsSingleDate ? selectedDate : null,
            startDate: dateFilterValue === "entre" ? startDate : null,
            endDate: dateFilterValue === "entre" ? endDate : null
        });
        setShowDateFilter(false);
    };

    const clearRangeFilter = () => {
        setStartDate(null);
        setEndDate(null);
        setShowStartCalendar(false);
        setShowEndCalendar(false);
        setAppliedDateFilter(null);
    };

    const resetFilters = () => {
        setAppliedStatusFilter("Todo");
        setAppliedDateFilter(null);
        setStatusFilterValue("Todo");
        setDateFilterValue("está en los últimos");
        setDateNumberValue("23");
        setDateUnitValue("días");
        setTimezoneValue("GMT-5");
        setSelectedDate(null);
        setStartDate(null);
        setEndDate(null);
        setShowStatusFilter(false);
        setShowDateFilter(false);
        setIsStatusDropdownOpen(false);
        setIsDateDropdownOpen(false);
        setShowCalendar(false);
        setShowStartCalendar(false);
        setShowEndCalendar(false);
    };

    const filteredProducts = products
        .filter((product) => appliedStatusFilter === "Todo" || product.status === appliedStatusFilter)
        .filter((product) => {
            if (!appliedDateFilter) return true;

            const productDate = new Date(product.createdAt || product.created_at || Date.now());

            if (appliedDateFilter.type === "es igual a") {
                const filterDate = appliedDateFilter.date;
                return productDate.toDateString() === filterDate.toDateString();
            }
            if (appliedDateFilter.type === "entre") {
                const start = appliedDateFilter.startDate;
                const end = appliedDateFilter.endDate;
                return productDate >= start && productDate <= end;
            }
            if (appliedDateFilter.type === "está en los últimos") {
                const now = new Date();
                const number = parseInt(appliedDateFilter.number, 10);
                const unit = appliedDateFilter.unit;

                let pastDate;
                if (unit === "horas") {
                    pastDate = new Date(now.getTime() - number * 60 * 60 * 1000);
                } else if (unit === "días") {
                    pastDate = new Date(now.getTime() - number * 24 * 60 * 60 * 1000);
                } else if (unit === "meses") {
                    pastDate = new Date(now.getFullYear(), now.getMonth() - number, now.getDate());
                }

                return productDate >= pastDate;
            }
            if (appliedDateFilter.type === "en esa fecha o después") {
                const filterDate = appliedDateFilter.date || new Date();
                return productDate >= filterDate;
            }
            if (appliedDateFilter.type === "es anterior o igual al") {
                const filterDate = appliedDateFilter.date || new Date();
                return productDate <= filterDate;
            }

            return true;
        });

    const totalCount = products.length;
    const activeCount = products.filter((product) => product.status === "Activo").length;
    const archivedCount = products.filter((product) => product.status === "Archivado").length;
    const hasActiveFilters = appliedStatusFilter !== "Todo" || Boolean(appliedDateFilter);

    const handleArchiveProduct = (productId) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === productId
                    ? { ...product, status: product.status === "Archivado" ? "Activo" : "Archivado" }
                    : product
            )
        );
    };

    const handleDeleteProduct = (productId) => {
        setProducts((prev) => prev.filter((product) => product.id !== productId));
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-[28px] font-bold text-[#32325d]">Catálogo de productos</h1>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => navigate("/dashboard/products/create")}
                        className="bg-[#635bff] hover:bg-[#5851e0] text-white font-semibold rounded-full px-4 py-2 flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        Crea un producto
                        <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[11px] font-semibold">
                            N
                        </span>
                    </Button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-6 text-[14px] border-b border-gray-200 pb-2">
                {PRODUCT_TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "pb-2 text-[14px] font-semibold transition-colors",
                            activeTab === tab
                                ? "text-[#635bff] border-b-2 border-[#635bff]"
                                : "text-[#6b7280] hover:text-[#32325d]"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <button
                    type="button"
                    onClick={() => {
                        setAppliedStatusFilter("Todo");
                        setStatusFilterValue("Todo");
                    }}
                    className={cn(
                        "rounded-xl border px-4 py-3 text-left transition-colors",
                        appliedStatusFilter === "Todo"
                            ? "border-[#635bff] bg-[#f6f5ff]"
                            : "border-gray-200 bg-white hover:border-[#cbd5f5]"
                    )}
                >
                    <p className={cn("text-[13px] font-semibold", appliedStatusFilter === "Todo" ? "text-[#635bff]" : "text-[#6b7280]")}>
                        Todos
                    </p>
                    <p className={cn("text-[18px] font-semibold mt-1", appliedStatusFilter === "Todo" ? "text-[#635bff]" : "text-[#4b5563]")}>
                        {totalCount}
                    </p>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setAppliedStatusFilter("Activo");
                        setStatusFilterValue("Activo");
                    }}
                    className={cn(
                        "rounded-xl border px-4 py-3 text-left transition-colors",
                        appliedStatusFilter === "Activo"
                            ? "border-[#635bff] bg-[#f6f5ff]"
                            : "border-gray-200 bg-white hover:border-[#cbd5f5]"
                    )}
                >
                    <p className={cn("text-[13px] font-semibold", appliedStatusFilter === "Activo" ? "text-[#635bff]" : "text-[#6b7280]")}>
                        Activo
                    </p>
                    <p className={cn("text-[18px] font-semibold mt-1", appliedStatusFilter === "Activo" ? "text-[#635bff]" : "text-[#4b5563]")}>
                        {activeCount}
                    </p>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setAppliedStatusFilter("Archivado");
                        setStatusFilterValue("Archivado");
                    }}
                    className={cn(
                        "rounded-xl border px-4 py-3 text-left transition-colors",
                        appliedStatusFilter === "Archivado"
                            ? "border-[#635bff] bg-[#f6f5ff]"
                            : "border-gray-200 bg-white hover:border-[#cbd5f5]"
                    )}
                >
                    <p className={cn("text-[13px] font-semibold", appliedStatusFilter === "Archivado" ? "text-[#635bff]" : "text-[#6b7280]")}>
                        Archivado
                    </p>
                    <p className={cn("text-[18px] font-semibold mt-1", appliedStatusFilter === "Archivado" ? "text-[#635bff]" : "text-[#4b5563]")}>
                        {archivedCount}
                    </p>
                </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    {["Creación", "Estado"].map((label) => (
                        <div key={label} className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    if (label === "Estado") {
                                        setShowStatusFilter(!showStatusFilter);
                                        setShowDateFilter(false);
                                    } else if (label === "Creación") {
                                        setShowDateFilter(!showDateFilter);
                                        setShowStatusFilter(false);
                                    }
                                }}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-full border border-dashed border-gray-200 px-2.5 py-1 text-[12px] text-[#4f5b76] hover:border-[#cbd5f5] transition-colors",
                                    ((label === "Estado" && showStatusFilter) || (label === "Creación" && showDateFilter)) && "bg-gray-50 border-[#cbd5f5]"
                                )}
                            >
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-200 text-[11px] text-[#8792a2]">
                                    +
                                </span>
                                {label}
                                {label === "Estado" && appliedStatusFilter !== "Todo" && (
                                    <span className="ml-2 text-[#635bff] text-[11px] font-semibold">
                                        {appliedStatusFilter}
                                    </span>
                                )}
                                {label === "Creación" && (
                                    <>
                                        <ChevronDown className="w-3.5 h-3.5 text-[#635bff]" />
                                        {appliedDateFilter && (
                                            <span className="ml-2 text-[#635bff] text-[11px] flex items-center gap-1">
                                                {appliedDateFilter.type === "es igual a"
                                                    ? appliedDateFilter.date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
                                                    : appliedDateFilter.type === "entre"
                                                        ? `${appliedDateFilter.startDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })} - ${appliedDateFilter.endDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}`
                                                        : appliedDateFilter.type === "en esa fecha o después"
                                                            ? `A partir del ${appliedDateFilter.date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}`
                                                            : appliedDateFilter.type === "es anterior o igual al"
                                                                ? `Termina el ${appliedDateFilter.date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}`
                                                                : `Desde hace ${appliedDateFilter.number} ${appliedDateFilter.unit}`
                                                }
                                            </span>
                                        )}
                                    </>
                                )}
                            </button>

                            {label === "Estado" && showStatusFilter && (
                                <div
                                    ref={statusFilterRef}
                                    className="absolute top-full left-0 mt-2 w-[220px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 p-3 z-[60]"
                                >
                                    <h3 className="text-[12px] font-bold text-[#32325d] mb-2 lowercase">
                                        filtrar por: estado
                                    </h3>

                                    <div className="relative mb-4">
                                        <button
                                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-[#cbd5f5] bg-white text-[13px] font-semibold text-[#32325d] transition-all"
                                        >
                                            {statusFilterValue}
                                            <div className="flex flex-col -gap-1">
                                                <ChevronUp className="w-2.5 h-2.5 text-[#4f5b76]" />
                                                <ChevronDown className="w-2.5 h-2.5 text-[#4f5b76] -mt-1" />
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {isStatusDropdownOpen && (
                                                <motion.div
                                                    ref={statusDropdownRef}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-[70] overflow-hidden"
                                                >
                                                    {["Todo", "Activo", "Archivado"].map((opt) => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => {
                                                                setStatusFilterValue(opt);
                                                                setIsStatusDropdownOpen(false);
                                                            }}
                                                            className="w-full px-3 py-1.5 text-left text-[12px] hover:bg-gray-50 flex items-center justify-between transition-colors"
                                                        >
                                                            <span className={statusFilterValue === opt ? "text-[#32325d] font-semibold" : "text-[#4f5b76]"}>
                                                                {opt}
                                                            </span>
                                                            {statusFilterValue === opt && (
                                                                <div className="w-4 h-4 rounded-full bg-[#4f5b76] flex items-center justify-center">
                                                                    <Check className="w-2.5 h-2.5 text-white" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <Button
                                        onClick={() => {
                                            setAppliedStatusFilter(statusFilterValue);
                                            setShowStatusFilter(false);
                                        }}
                                        className="w-full bg-[#635bff] hover:bg-[#5851e0] text-white font-bold py-1.5 text-[12px] rounded-lg"
                                    >
                                        Aplicar
                                    </Button>
                                </div>
                            )}

                            {label === "Creación" && showDateFilter && (
                                <div
                                    ref={dateFilterRef}
                                    className="absolute top-full left-0 mt-2 w-[300px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 p-2.5 z-[60]"
                                >
                                    <h3 className="text-[12px] font-bold text-[#32325d] mb-2 lowercase">
                                        filtrar por: creado
                                    </h3>

                                    <div className="relative mb-3">
                                        <button
                                            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-[#cbd5f5] bg-white text-[13px] font-semibold text-[#32325d] transition-all"
                                        >
                                            {dateFilterValue}
                                            <div className="flex flex-col -gap-1">
                                                <ChevronUp className="w-2.5 h-2.5 text-[#4f5b76]" />
                                                <ChevronDown className="w-2.5 h-2.5 text-[#4f5b76] -mt-1" />
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {isDateDropdownOpen && (
                                                <motion.div
                                                    ref={dateDropdownRef}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-[70] overflow-hidden"
                                                >
                                                    {["está en los últimos", "es igual a", "entre", "en esa fecha o después", "es anterior o igual al"].map((opt) => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => {
                                                                setDateFilterValue(opt);
                                                                setIsDateDropdownOpen(false);
                                                            }}
                                                            className="w-full px-3 py-1.5 text-left text-[12px] hover:bg-gray-50 flex items-center justify-between transition-colors"
                                                        >
                                                            <span className={dateFilterValue === opt ? "text-[#32325d] font-semibold" : "text-[#4f5b76]"}>
                                                                {opt}
                                                            </span>
                                                            {dateFilterValue === opt && (
                                                                <div className="w-4 h-4 rounded-full bg-[#4f5b76] flex items-center justify-center">
                                                                    <Check className="w-2.5 h-2.5 text-white" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="mb-3">
                                        {dateFilterValue === "está en los últimos" && (
                                            <div className="flex items-center gap-2 mb-3">
                                                <CornerDownRight className="w-4 h-4 text-[#635bff]" />
                                                <input
                                                    type="text"
                                                    value={dateNumberValue}
                                                    onChange={(e) => setDateNumberValue(e.target.value)}
                                                    className="w-14 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[13px] text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                                                    placeholder="23"
                                                />
                                                <select
                                                    value={dateUnitValue}
                                                    onChange={(e) => setDateUnitValue(e.target.value)}
                                                    className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-[13px] text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#93c5fd] appearance-none bg-white"
                                                >
                                                    <option value="horas">horas</option>
                                                    <option value="días">días</option>
                                                    <option value="meses">meses</option>
                                                </select>
                                                <div className="flex flex-col -gap-1 -ml-6 pointer-events-none">
                                                    <ChevronUp className="w-2.5 h-2.5 text-[#4f5b76]" />
                                                    <ChevronDown className="w-2.5 h-2.5 text-[#4f5b76] -mt-1" />
                                                </div>
                                            </div>
                                        )}

                                        {dateFilterValue === "es igual a" && (
                                            <div className="mb-3 relative">
                                                <div className="flex items-center gap-2">
                                                    <CornerDownRight className="w-4 h-4 text-[#635bff]" />
                                                    {!showCalendar && selectedDate ? (
                                                        <button
                                                            onClick={() => setShowCalendar(true)}
                                                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[13px] text-[#32325d] hover:border-[#cbd5f5] focus:outline-none focus:ring-2 focus:ring-[#93c5fd] text-left"
                                                        >
                                                            {selectedDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setShowCalendar(true)}
                                                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[13px] text-[#4f5b76] hover:border-[#cbd5f5] focus:outline-none focus:ring-2 focus:ring-[#93c5fd] text-left"
                                                        >
                                                            DD/MM/YYYY
                                                        </button>
                                                    )}
                                                </div>

                                                {showCalendar && (
                                                    <div
                                                        ref={calendarRef}
                                                        className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-[70] w-[320px]"
                                                    >
                                                        {(() => {
                                                            const calendarDate = selectedDate || new Date();
                                                            const today = new Date();
                                                            return (
                                                                <>
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <button
                                                                            onClick={() => {
                                                                                const newDate = new Date(calendarDate);
                                                                                newDate.setMonth(newDate.getMonth() - 1);
                                                                                setSelectedDate(newDate);
                                                                            }}
                                                                            className="p-1 hover:bg-gray-100 rounded"
                                                                        >
                                                                            <ChevronLeft className="w-4 h-4 text-[#4f5b76]" />
                                                                        </button>
                                                                        <div className="text-sm font-semibold text-[#32325d]">
                                                                            {calendarDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                                                                        </div>
                                                                        <button
                                                                            onClick={() => {
                                                                                const newDate = new Date(calendarDate);
                                                                                newDate.setMonth(newDate.getMonth() + 1);
                                                                                setSelectedDate(newDate);
                                                                            }}
                                                                            className="p-1 hover:bg-gray-100 rounded"
                                                                        >
                                                                            <ChevronRight className="w-4 h-4 text-[#4f5b76]" />
                                                                        </button>
                                                                    </div>

                                                                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                                                        {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].map((day) => (
                                                                            <div key={day} className="font-semibold text-[#4f5b76] py-1">
                                                                                {day}
                                                                            </div>
                                                                        ))}

                                                                        {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((day) => {
                                                                            const isToday = day === today.getDate() &&
                                                                                calendarDate.getMonth() === today.getMonth() &&
                                                                                calendarDate.getFullYear() === today.getFullYear();
                                                                            const isSelected = selectedDate
                                                                                ? day === selectedDate.getDate() &&
                                                                                calendarDate.getMonth() === selectedDate.getMonth() &&
                                                                                calendarDate.getFullYear() === selectedDate.getFullYear()
                                                                                : false;

                                                                            return (
                                                                                <button
                                                                                    key={day}
                                                                                    onClick={() => {
                                                                                        const newDate = new Date(calendarDate);
                                                                                        newDate.setDate(day);
                                                                                        setSelectedDate(newDate);
                                                                                        setShowCalendar(false);
                                                                                    }}
                                                                                    className={`py-1 px-2 rounded text-xs hover:bg-gray-100 ${isToday
                                                                                        ? "bg-[#635bff] text-white"
                                                                                        : isSelected
                                                                                            ? "bg-[#cbd5f5] text-[#32325d]"
                                                                                            : "text-[#4f5b76]"
                                                                                        }`}
                                                                                >
                                                                                    {day}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {dateFilterValue === "entre" && (
                                            <div className="mb-3">
                                                <div className="flex gap-2 mb-3">
                                                    <div className="flex-1">
                                                        <label className="block text-[11px] text-[#4f5b76] mb-1">Inicio</label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                value={startDate ? startDate.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                                                                onClick={() => setShowStartCalendar(!showStartCalendar)}
                                                                readOnly
                                                                placeholder="DD/MM/YYYY"
                                                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-[13px] text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#93c5fd] cursor-pointer placeholder:text-[#aab2c4]"
                                                            />
                                                            {showStartCalendar && (
                                                                <div
                                                                    ref={startCalendarRef}
                                                                    className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-[70] w-[320px]"
                                                                >
                                                                    {(() => {
                                                                        const calendarDate = startDate || new Date();
                                                                        return (
                                                                            <>
                                                                                <div className="flex items-center justify-between mb-4">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const newDate = new Date(calendarDate);
                                                                                            newDate.setMonth(newDate.getMonth() - 1);
                                                                                            setStartDate(newDate);
                                                                                        }}
                                                                                        className="p-1 hover:bg-gray-100 rounded"
                                                                                    >
                                                                                        <ChevronLeft className="w-4 h-4 text-[#4f5b76]" />
                                                                                    </button>
                                                                                    <div className="text-sm font-semibold text-[#32325d]">
                                                                                        {calendarDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                                                                                    </div>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const newDate = new Date(calendarDate);
                                                                                            newDate.setMonth(newDate.getMonth() + 1);
                                                                                            setStartDate(newDate);
                                                                                        }}
                                                                                        className="p-1 hover:bg-gray-100 rounded"
                                                                                    >
                                                                                        <ChevronRight className="w-4 h-4 text-[#4f5b76]" />
                                                                                    </button>
                                                                                </div>

                                                                                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                                                                    {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].map((day) => (
                                                                                        <div key={day} className="font-semibold text-[#4f5b76] py-1">
                                                                                            {day}
                                                                                        </div>
                                                                                    ))}

                                                                                    {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((day) => {
                                                                                        const isInRange = startDate
                                                                                            ? day >= startDate.getDate() ||
                                                                                            startDate.getMonth() !== new Date().getMonth() ||
                                                                                            startDate.getFullYear() !== new Date().getFullYear()
                                                                                            : false;

                                                                                        return (
                                                                                            <button
                                                                                                key={day}
                                                                                                onClick={() => {
                                                                                                    const newDate = new Date(calendarDate);
                                                                                                    newDate.setDate(day);
                                                                                                    setStartDate(newDate);
                                                                                                    setShowStartCalendar(false);
                                                                                                }}
                                                                                                className={`py-1 px-2 rounded text-xs hover:bg-gray-100 ${isInRange ? "bg-[#cbd5f5] text-[#32325d]" : "text-[#4f5b76]"
                                                                                                    }`}
                                                                                            >
                                                                                                {day}
                                                                                            </button>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <label className="block text-[11px] text-[#4f5b76] mb-1">Final</label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                value={endDate ? endDate.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                                                                onClick={() => setShowEndCalendar(!showEndCalendar)}
                                                                readOnly
                                                                placeholder="DD/MM/YYYY"
                                                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-[13px] text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#93c5fd] cursor-pointer placeholder:text-[#aab2c4]"
                                                            />
                                                            {showEndCalendar && (
                                                                <div
                                                                    ref={endCalendarRef}
                                                                    className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-[70] w-[320px]"
                                                                >
                                                                    {(() => {
                                                                        const calendarDate = endDate || new Date();
                                                                        return (
                                                                            <>
                                                                                <div className="flex items-center justify-between mb-4">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const newDate = new Date(calendarDate);
                                                                                            newDate.setMonth(newDate.getMonth() - 1);
                                                                                            setEndDate(newDate);
                                                                                        }}
                                                                                        className="p-1 hover:bg-gray-100 rounded"
                                                                                    >
                                                                                        <ChevronLeft className="w-4 h-4 text-[#4f5b76]" />
                                                                                    </button>
                                                                                    <div className="text-sm font-semibold text-[#32325d]">
                                                                                        {calendarDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                                                                                    </div>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const newDate = new Date(calendarDate);
                                                                                            newDate.setMonth(newDate.getMonth() + 1);
                                                                                            setEndDate(newDate);
                                                                                        }}
                                                                                        className="p-1 hover:bg-gray-100 rounded"
                                                                                    >
                                                                                        <ChevronRight className="w-4 h-4 text-[#4f5b76]" />
                                                                                    </button>
                                                                                </div>

                                                                                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                                                                    {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].map((day) => (
                                                                                        <div key={day} className="font-semibold text-[#4f5b76] py-1">
                                                                                            {day}
                                                                                        </div>
                                                                                    ))}

                                                                                    {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((day) => {
                                                                                        const isInRange = endDate
                                                                                            ? day <= endDate.getDate() ||
                                                                                            endDate.getMonth() !== new Date().getMonth() ||
                                                                                            endDate.getFullYear() !== new Date().getFullYear()
                                                                                            : false;

                                                                                        return (
                                                                                            <button
                                                                                                key={day}
                                                                                                onClick={() => {
                                                                                                    const newDate = new Date(calendarDate);
                                                                                                    newDate.setDate(day);
                                                                                                    setEndDate(newDate);
                                                                                                    setShowEndCalendar(false);
                                                                                                }}
                                                                                                className={`py-1 px-2 rounded text-xs hover:bg-gray-100 ${isInRange ? "bg-[#cbd5f5] text-[#32325d]" : "text-[#4f5b76]"
                                                                                                    }`}
                                                                                            >
                                                                                                {day}
                                                                                            </button>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {dateFilterValue === "en esa fecha o después" && (
                                            <div className="mb-3 relative">
                                                <div className="flex items-center gap-2">
                                                    <CornerDownRight className="w-4 h-4 text-[#635bff]" />
                                                    {!showCalendar && selectedDate ? (
                                                        <button
                                                            onClick={() => setShowCalendar(true)}
                                                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[13px] text-[#32325d] hover:border-[#cbd5f5] focus:outline-none focus:ring-2 focus:ring-[#93c5fd] text-left"
                                                        >
                                                            {selectedDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setShowCalendar(true)}
                                                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[13px] text-[#4f5b76] hover:border-[#cbd5f5] focus:outline-none focus:ring-2 focus:ring-[#93c5fd] text-left"
                                                        >
                                                            DD/MM/YYYY
                                                        </button>
                                                    )}
                                                </div>

                                                {showCalendar && (
                                                    <div
                                                        ref={calendarRef}
                                                        className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-[70] w-[320px]"
                                                    >
                                                        {(() => {
                                                            const calendarDate = selectedDate || new Date();
                                                            const today = new Date();
                                                            return (
                                                                <>
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <button
                                                                            onClick={() => {
                                                                                const newDate = new Date(calendarDate);
                                                                                newDate.setMonth(newDate.getMonth() - 1);
                                                                                setSelectedDate(newDate);
                                                                            }}
                                                                            className="p-1 hover:bg-gray-100 rounded"
                                                                        >
                                                                            <ChevronLeft className="w-4 h-4 text-[#4f5b76]" />
                                                                        </button>
                                                                        <div className="text-sm font-semibold text-[#32325d]">
                                                                            {calendarDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                                                                        </div>
                                                                        <button
                                                                            onClick={() => {
                                                                                const newDate = new Date(calendarDate);
                                                                                newDate.setMonth(newDate.getMonth() + 1);
                                                                                setSelectedDate(newDate);
                                                                            }}
                                                                            className="p-1 hover:bg-gray-100 rounded"
                                                                        >
                                                                            <ChevronRight className="w-4 h-4 text-[#4f5b76]" />
                                                                        </button>
                                                                    </div>

                                                                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                                                        {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].map((day) => (
                                                                            <div key={day} className="font-semibold text-[#4f5b76] py-1">
                                                                                {day}
                                                                            </div>
                                                                        ))}

                                                                        {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((day) => {
                                                                            const isToday = day === today.getDate() &&
                                                                                calendarDate.getMonth() === today.getMonth() &&
                                                                                calendarDate.getFullYear() === today.getFullYear();
                                                                            const isSelected = selectedDate
                                                                                ? day === selectedDate.getDate() &&
                                                                                calendarDate.getMonth() === selectedDate.getMonth() &&
                                                                                calendarDate.getFullYear() === selectedDate.getFullYear()
                                                                                : false;

                                                                            return (
                                                                                <button
                                                                                    key={day}
                                                                                    onClick={() => {
                                                                                        const newDate = new Date(calendarDate);
                                                                                        newDate.setDate(day);
                                                                                        setSelectedDate(newDate);
                                                                                        setShowCalendar(false);
                                                                                    }}
                                                                                    className={`py-1 px-2 rounded text-xs hover:bg-gray-100 ${isToday
                                                                                        ? "bg-[#635bff] text-white"
                                                                                        : isSelected
                                                                                            ? "bg-[#cbd5f5] text-[#32325d]"
                                                                                            : "text-[#4f5b76]"
                                                                                        }`}
                                                                                >
                                                                                    {day}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {dateFilterValue === "es anterior o igual al" && (
                                            <div className="mb-3 relative">
                                                <div className="flex items-center gap-2">
                                                    <CornerDownRight className="w-4 h-4 text-[#635bff]" />
                                                    {!showCalendar && selectedDate ? (
                                                        <button
                                                            onClick={() => setShowCalendar(true)}
                                                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[13px] text-[#32325d] hover:border-[#cbd5f5] focus:outline-none focus:ring-2 focus:ring-[#93c5fd] text-left"
                                                        >
                                                            {selectedDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setShowCalendar(true)}
                                                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[13px] text-[#4f5b76] hover:border-[#cbd5f5] focus:outline-none focus:ring-2 focus:ring-[#93c5fd] text-left"
                                                        >
                                                            DD/MM/YYYY
                                                        </button>
                                                    )}
                                                </div>

                                                {showCalendar && (
                                                    <div
                                                        ref={calendarRef}
                                                        className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-[70] w-[320px]"
                                                    >
                                                        {(() => {
                                                            const calendarDate = selectedDate || new Date();
                                                            const today = new Date();
                                                            return (
                                                                <>
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <button
                                                                            onClick={() => {
                                                                                const newDate = new Date(calendarDate);
                                                                                newDate.setMonth(newDate.getMonth() - 1);
                                                                                setSelectedDate(newDate);
                                                                            }}
                                                                            className="p-1 hover:bg-gray-100 rounded"
                                                                        >
                                                                            <ChevronLeft className="w-4 h-4 text-[#4f5b76]" />
                                                                        </button>
                                                                        <div className="text-sm font-semibold text-[#32325d]">
                                                                            {calendarDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                                                                        </div>
                                                                        <button
                                                                            onClick={() => {
                                                                                const newDate = new Date(calendarDate);
                                                                                newDate.setMonth(newDate.getMonth() + 1);
                                                                                setSelectedDate(newDate);
                                                                            }}
                                                                            className="p-1 hover:bg-gray-100 rounded"
                                                                        >
                                                                            <ChevronRight className="w-4 h-4 text-[#4f5b76]" />
                                                                        </button>
                                                                    </div>

                                                                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                                                        {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].map((day) => (
                                                                            <div key={day} className="font-semibold text-[#4f5b76] py-1">
                                                                                {day}
                                                                            </div>
                                                                        ))}

                                                                        {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((day) => {
                                                                            const isToday = day === today.getDate() &&
                                                                                calendarDate.getMonth() === today.getMonth() &&
                                                                                calendarDate.getFullYear() === today.getFullYear();
                                                                            const isSelected = selectedDate
                                                                                ? day === selectedDate.getDate() &&
                                                                                calendarDate.getMonth() === selectedDate.getMonth() &&
                                                                                calendarDate.getFullYear() === selectedDate.getFullYear()
                                                                                : false;

                                                                            return (
                                                                                <button
                                                                                    key={day}
                                                                                    onClick={() => {
                                                                                        const newDate = new Date(calendarDate);
                                                                                        newDate.setDate(day);
                                                                                        setSelectedDate(newDate);
                                                                                        setShowCalendar(false);
                                                                                    }}
                                                                                    className={`py-1 px-2 rounded text-xs hover:bg-gray-100 ${isToday
                                                                                        ? "bg-[#635bff] text-white"
                                                                                        : isSelected
                                                                                            ? "bg-[#cbd5f5] text-[#32325d]"
                                                                                            : "text-[#4f5b76]"
                                                                                        }`}
                                                                                >
                                                                                    {day}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 mb-3">
                                            <p className="text-[12px] font-semibold text-[#32325d]">Zona horaria:</p>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="timezone"
                                                    value="GMT-5"
                                                    checked={timezoneValue === "GMT-5"}
                                                    onChange={(e) => setTimezoneValue(e.target.value)}
                                                    className="w-4 h-4 text-[#635bff] border-gray-300 focus:ring-[#93c5fd]"
                                                />
                                                <span className="text-[12px] text-[#4f5b76]">GMT-5</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="timezone"
                                                    value="UTC"
                                                    checked={timezoneValue === "UTC"}
                                                    onChange={(e) => setTimezoneValue(e.target.value)}
                                                    className="w-4 h-4 text-[#635bff] border-gray-300 focus:ring-[#93c5fd]"
                                                />
                                                <span className="text-[12px] text-[#4f5b76]">UTC</span>
                                            </label>
                                        </div>
                                    </div>

                                    {dateFilterValue === "entre" ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={clearRangeFilter}
                                                className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[12px] text-[#4f5b76] hover:border-[#cbd5f5] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                                            >
                                                Borra
                                            </button>
                                            <Button
                                                onClick={applyDateFilter}
                                                className="flex-1 bg-[#635bff] hover:bg-[#5851e0] text-white font-bold py-1.5 text-[12px] rounded-lg"
                                            >
                                                Aplicar
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={applyDateFilter}
                                            className="w-full bg-[#635bff] hover:bg-[#5851e0] text-white font-bold py-1.5 text-[12px] rounded-lg"
                                        >
                                            Aplicar
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="text-[12px] font-semibold text-[#635bff] hover:underline"
                        >
                            Borrar los filtros
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]">
                        <Upload className="w-4 h-4 text-[#8792a2]" />
                        Exportar precios
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]">
                        <Upload className="w-4 h-4 text-[#8792a2]" />
                        Exportar productos
                    </button>
                </div>
            </div>

            <div className="mt-10">
                {filteredProducts.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 text-[13px] font-semibold text-[#6b7280] border-b border-gray-200">
                        <div>Producto</div>
                        <div>Precio</div>
                        <div>Estado</div>
                        <div>Creación</div>
                        <div />
                    </div>
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => navigate(`/dashboard/products/${product.id}`)}
                            className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 text-[14px] text-[#32325d] border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50"
                        >
                            <div className="font-semibold">{product.name}</div>
                            <div className="flex items-center gap-2 text-[#4f5b76]">
                                <span>{formatProductPrice(product)}</span>
                                {product.prices && product.prices.length > 1 && (
                                    <span className="px-2 py-0.5 rounded-full border border-[#93c5fd] bg-[#eff6ff] text-[#2563eb] text-[11px] font-semibold">
                                        {product.prices.length} tarifas
                                    </span>
                                )}
                            </div>
                            <div className="text-[#4f5b76]">{product.status}</div>
                            <div className="text-[#4f5b76]">{formatProductDate(product.createdAt)}</div>
                            <div className="relative flex justify-end">
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setOpenMenuId(openMenuId === product.id ? null : product.id);
                                        setShowCopyHintId(null);
                                    }}
                                    className="text-[#aab2c4] text-lg leading-none hover:text-[#6b7280]"
                                >
                                    ...
                                </button>
                                {openMenuId === product.id && (
                                    <div
                                        className="absolute right-0 top-6 z-20"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <div
                                            ref={menuRef}
                                            className="w-64 rounded-xl border border-gray-200 bg-white shadow-xl"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigate("/dashboard/products/create", { state: { productToEdit: product } });
                                                    setOpenMenuId(null);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-[14px] text-[#32325d] hover:bg-gray-50 rounded-t-xl"
                                            >
                                                Editar producto
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleArchiveProduct(product.id);
                                                    setOpenMenuId(null);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-[14px] text-[#32325d] hover:bg-gray-50"
                                            >
                                                {product.status === "Archivado" ? "Activar producto" : "Archivar producto"}
                                            </button>
                                            <div
                                                onMouseEnter={() => setShowCopyHintId(product.id)}
                                                onMouseLeave={() => setShowCopyHintId(null)}
                                                className="border-t border-gray-200 relative"
                                            >
                                                {showCopyHintId === product.id && (
                                                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-[240px] bg-white rounded-xl shadow-xl p-4 z-50 border border-gray-100">
                                                        <div className="absolute -right-[6.5px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-t border-r border-l-0 border-b-0 border-gray-100" />
                                                        <p className="text-[#4f5b76] text-[13px] leading-relaxed">
                                                            La copia en modo activo estará disponible una vez hayas completado tu perfil de empresa.
                                                        </p>
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    className="w-full text-left px-4 py-2.5 text-[14px] text-[#9ca3af] cursor-not-allowed pointer-events-none"
                                                >
                                                    Copiar a modo activo
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleDeleteProduct(product.id);
                                                    setOpenMenuId(null);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-[14px] text-[#ef4444] hover:bg-red-50 rounded-b-xl"
                                            >
                                                Eliminar producto
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                ) : totalCount === 0 ? (
                    <div className="flex flex-col items-center text-center gap-3 py-16">
                        <div className="w-12 h-12 rounded-xl bg-[#f4f5f7] flex items-center justify-center">
                            <Box className="w-5 h-5 text-[#9ca3af]" />
                        </div>
                        <h3 className="text-[18px] font-semibold text-[#32325d]">
                            Añade tu primer producto de prueba.
                        </h3>
                        <p className="text-[14px] text-[#6b7280] max-w-[420px]">
                            Los productos son lo que vendes a tus clientes. Pueden ser cualquier cosa,
                            desde bienes materiales hasta servicios digitales o planes de suscripción.
                        </p>
                        <Button
                            onClick={() => navigate("/dashboard/products/create")}
                            className="mt-2 bg-[#635bff] hover:bg-[#5851e0] text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Añadir un producto
                            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[11px] font-semibold">
                                N
                            </span>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center gap-3 py-16">
                        <div className="w-12 h-12 rounded-xl bg-[#f4f5f7] flex items-center justify-center">
                            <Box className="w-5 h-5 text-[#9ca3af]" />
                        </div>
                        <h3 className="text-[18px] font-semibold text-[#32325d]">
                            No se han encontrado productos en modo de prueba con los filtros aplicados
                        </h3>
                        <p className="text-[14px] text-[#6b7280] max-w-[460px]">
                            Puedes intentar cambiar los filtros o pasar al modo activo para ampliar los resultados.
                            Si no, puedes crear un producto.
                        </p>
                        <Button
                            onClick={() => navigate("/dashboard/products/create")}
                            className="mt-2 bg-[#635bff] hover:bg-[#5851e0] text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Añadir un producto
                            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[11px] font-semibold">
                                N
                            </span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
