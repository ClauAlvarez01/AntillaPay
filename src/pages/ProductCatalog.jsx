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
    Search,
    Upload,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PRODUCT_TABS = [
    "Todos los productos"
];
const DAY_MS = 24 * 60 * 60 * 1000;
const PRODUCT_STATUS_STYLES = {
    Activo: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Inactivo: "bg-slate-50 text-slate-700 border-slate-200"
};

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
    const [searchQuery, setSearchQuery] = useState("");
    const [exportStep, setExportStep] = useState(null);
    const [exportType, setExportType] = useState("products");
    const [exportFormat, setExportFormat] = useState("csv");
    const [exportTimezone, setExportTimezone] = useState("GMT-5");
    const [exportRange, setExportRange] = useState("Hoy");
    const [exportCustomStart, setExportCustomStart] = useState("");
    const [exportCustomEnd, setExportCustomEnd] = useState("");
    const [exportCsvContent, setExportCsvContent] = useState("");
    const [exportFilename, setExportFilename] = useState("");
    const [exportMimeType, setExportMimeType] = useState("text/csv;charset=utf-8;");

    const statusFilterRef = useRef(null);
    const statusDropdownRef = useRef(null);
    const dateFilterRef = useRef(null);
    const dateDropdownRef = useRef(null);
    const calendarRef = useRef(null);
    const startCalendarRef = useRef(null);
    const endCalendarRef = useRef(null);
    const menuRef = useRef(null);
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
        products: ["ID", "Nombre", "Fecha de creación", "Descripción"],
        prices: ["ID del precio", "ID del producto", "Producto", "Fecha de creación", "Moneda", "Monto"]
    };
    const exportColumns = exportColumnsByType[exportType] || exportColumnsByType.products;

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

    useEffect(() => {
        return () => {
            if (exportTimerRef.current) {
                clearTimeout(exportTimerRef.current);
            }
        };
    }, []);

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
    const formatShortDate = (year, month, day) => {
        return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" })
            .format(new Date(Date.UTC(year, month, day)))
            .replace(".", "");
    };
    const formatRangeLabel = (startParts, endParts) => {
        if (!startParts) return "--";
        if (!endParts) return formatShortDate(startParts.year, startParts.month, startParts.day);
        const sameDay = startParts.year === endParts.year &&
            startParts.month === endParts.month &&
            startParts.day === endParts.day;
        if (sameDay) {
            return formatShortDate(startParts.year, startParts.month, startParts.day);
        }
        return `${formatShortDate(startParts.year, startParts.month, startParts.day)}–${formatShortDate(endParts.year, endParts.month, endParts.day)}`;
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
            return {
                year: date.getUTCFullYear(),
                month: date.getUTCMonth(),
                day: date.getUTCDate()
            };
        };

        switch (option) {
            case "Hoy":
                return formatRangeLabel(nowParts);
            case "Mes en curso": {
                const startParts = { ...nowParts, day: 1 };
                return formatRangeLabel(startParts, nowParts);
            }
            case "Últimos 7 días": {
                const startParts = shiftDays(nowParts, -6);
                return formatRangeLabel(startParts, nowParts);
            }
            case "Últimas 4 semanas": {
                const startParts = shiftDays(nowParts, -27);
                return formatRangeLabel(startParts, nowParts);
            }
            case "Último mes": {
                let year = nowParts.year;
                let month = nowParts.month - 1;
                if (month < 0) {
                    month = 11;
                    year -= 1;
                }
                const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
                const startParts = { year, month, day: 1 };
                const endParts = { year, month, day: lastDay };
                return formatRangeLabel(startParts, endParts);
            }
            case "Todos":
                return "Siempre";
            case "Personalizado": {
                if (!exportCustomStart || !exportCustomEnd) {
                    return "Selecciona fechas";
                }
                const startParts = parseDateInput(exportCustomStart);
                const endParts = parseDateInput(exportCustomEnd);
                return formatRangeLabel(startParts, endParts);
            }
            default:
                return "--";
        }
    };
    const buildProductsExportCsv = (rows) => {
        const header = exportColumnsByType.products.join(",");
        const body = rows.map((product) => {
            const createdAt = new Date(product.createdAt || product.created_at || "");
            const createdAtValue = Number.isNaN(createdAt.getTime()) ? "" : createdAt.toISOString();
            const values = [
                product.id || "",
                product.name || "",
                createdAtValue,
                product.description || ""
            ];
            return values.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",");
        }).join("\n");
        return `${header}\n${body}`;
    };
    const buildProductsExportRows = (rows) => rows.map((product) => {
        const createdAt = new Date(product.createdAt || product.created_at || "");
        const createdAtValue = Number.isNaN(createdAt.getTime()) ? "" : createdAt.toISOString();
        return [
            product.id || "",
            product.name || "",
            createdAtValue,
            product.description || ""
        ];
    });
    const buildPricesExportCsv = (rows) => {
        const header = exportColumnsByType.prices.join(",");
        const body = rows.map(({ product, price }) => {
            const createdAt = new Date(price.createdAt || product.createdAt || product.created_at || "");
            const createdAtValue = Number.isNaN(createdAt.getTime()) ? "" : createdAt.toISOString();
            const values = [
                price.id || "",
                product.id || "",
                product.name || "",
                createdAtValue,
                price.currency || product.currency || "",
                price.amount ?? ""
            ];
            return values.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",");
        }).join("\n");
        return `${header}\n${body}`;
    };
    const buildPricesExportRows = (rows) => rows.map(({ product, price }) => {
        const createdAt = new Date(price.createdAt || product.createdAt || product.created_at || "");
        const createdAtValue = Number.isNaN(createdAt.getTime()) ? "" : createdAt.toISOString();
        return [
            price.id || "",
            product.id || "",
            product.name || "",
            createdAtValue,
            price.currency || product.currency || "",
            price.amount ?? ""
        ];
    });
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
    const openExportModal = (type) => {
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
            let csvContent = "";
            let mimeType = "text/csv;charset=utf-8;";
            let rowsCount = 0;

            if (exportType === "prices") {
                const priceRows = products.flatMap((product) =>
                    (product.prices || []).map((price) => ({ product, price }))
                ).filter(({ product, price }) => isInRange(price.createdAt || product.createdAt || product.created_at || ""));
                rowsCount = priceRows.length;
                if (rowsCount > 0) {
                    if (exportFormat === "xlsx") {
                        csvContent = buildSpreadsheetHtml(exportColumnsByType.prices, buildPricesExportRows(priceRows));
                        mimeType = "application/vnd.ms-excel";
                    } else {
                        csvContent = buildPricesExportCsv(priceRows);
                    }
                }
            } else {
                const productRows = products.filter((product) =>
                    isInRange(product.createdAt || product.created_at || "")
                );
                rowsCount = productRows.length;
                if (rowsCount > 0) {
                    if (exportFormat === "xlsx") {
                        csvContent = buildSpreadsheetHtml(exportColumnsByType.products, buildProductsExportRows(productRows));
                        mimeType = "application/vnd.ms-excel";
                    } else {
                        csvContent = buildProductsExportCsv(productRows);
                    }
                }
            }

            if (rowsCount === 0) {
                setExportStep("empty");
                return;
            }

            const nowParts = getNowPartsForTimezone(exportTimezone);
            const fileDate = `${nowParts.year}-${String(nowParts.month + 1).padStart(2, "0")}-${String(nowParts.day).padStart(2, "0")}`;
            const extension = exportFormat === "xlsx" ? "xlsx" : "csv";
            const filename = exportType === "prices" ? `precios-${fileDate}.${extension}` : `productos-${fileDate}.${extension}`;
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
        .filter((product) => {
            const query = searchQuery.trim().toLowerCase();
            if (!query) return true;
            return product.name?.toLowerCase().includes(query);
        })
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
    const hasActiveFilters = appliedStatusFilter !== "Todo" || Boolean(appliedDateFilter);
    const todayInputValue = getTodayInputValue(exportTimezone);
    const isCustomExportRange = exportRange === "Personalizado";
    const isExportReady = !isCustomExportRange || (exportCustomStart && exportCustomEnd);
    const exportTitle = exportType === "prices" ? "Exportar precios" : "Exportar productos";

    const handleArchiveProduct = (productId) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === productId
                    ? { ...product, status: product.status === "Inactivo" ? "Activo" : "Inactivo" }
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

            <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative w-full max-w-[420px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab2c4]" />
                    <Input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Buscar por nombre del producto"
                        className="h-9 rounded-full border-gray-200 bg-white pl-10 text-[13px]"
                    />
                </div>
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
                                                    {["Todo", "Activo", "Inactivo"].map((opt) => (
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
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[13px] text-[#697386]">
                    Mostrando {filteredProducts.length} productos
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => openExportModal("prices")}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                    >
                        <Upload className="w-4 h-4 text-[#8792a2]" />
                        Exportar precios
                    </button>
                    <button
                        type="button"
                        onClick={() => openExportModal("products")}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                    >
                        <Upload className="w-4 h-4 text-[#8792a2]" />
                        Exportar productos
                    </button>
                </div>
            </div>

            <div className="mt-10">
                {filteredProducts.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="min-w-[800px]">
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
                                        className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 text-[14px] text-[#32325d] border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
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
                                        <div className="text-[#4f5b76]">
                                            <Badge
                                                variant="outline"
                                                className={cn("rounded-full border text-[11px]", PRODUCT_STATUS_STYLES[product.status] || "bg-slate-50 text-slate-700 border-slate-200")}
                                            >
                                                {product.status}
                                            </Badge>
                                        </div>
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
                                                                navigate(`/dashboard/products/${product.id}`);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-[14px] text-[#32325d] hover:bg-gray-50 rounded-t-xl"
                                                        >
                                                            Ver detalles
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                navigate("/dashboard/products/create", { state: { productToEdit: product } });
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-[14px] text-[#32325d] hover:bg-gray-50"
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
                                                            {product.status === "Inactivo" ? "Activar producto" : "Inactivar producto"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
                                                                    handleDeleteProduct(product.id);
                                                                }
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-[14px] text-rose-600 hover:bg-rose-50 rounded-b-xl"
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
                        </div>
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
            </div >
            {exportStep && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4">
                    {exportStep === "form" && (
                        <div className="w-[95%] sm:max-w-[600px] rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[85vh] overflow-y-auto">
                            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-[18px] font-semibold text-[#1a1f36]">{exportTitle}</h3>
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
                                                    max={exportCustomEnd || todayInputValue}
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
                                                    max={todayInputValue}
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
                        <div className="w-[95%] sm:max-w-[520px] rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[85vh] overflow-y-auto">
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
                        <div className="w-[95%] sm:max-w-[520px] rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[85vh] overflow-y-auto">
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
                        <div className="w-[95%] sm:max-w-[520px] rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[85vh] overflow-y-auto">
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
        </div >
    );
}
