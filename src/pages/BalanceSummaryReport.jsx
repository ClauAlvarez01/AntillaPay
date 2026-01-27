import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Calendar, ChevronDown, ChevronLeft, ChevronRight, FileDown, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const DAY_MS = 24 * 60 * 60 * 1000;
const FILTER_RANGE_OPTIONS = [
    "Hoy",
    "Mes en curso",
    "Últimos 7 días",
    "Últimas 4 semanas",
    "Último mes",
    "Todos",
    "Personalizado"
];

const STATUS_STYLES = {
    completada: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pendiente: "bg-amber-50 text-amber-700 border-amber-200",
    procesando: "bg-blue-50 text-blue-700 border-blue-200",
    fallida: "bg-rose-50 text-rose-700 border-rose-200"
};
const STATUS_LABELS = {
    completada: "Completada",
    pendiente: "Pendiente",
    procesando: "Procesando",
    fallida: "Fallida"
};
const STATUS_ORDER = ["completada", "pendiente", "procesando", "fallida"];

const INITIAL_TRANSFERS = [
    {
        id: "tr_1203",
        amount: 450.0,
        status: "completada",
        date: "2026-01-15T10:30:00Z",
        destination: "Banco Metropolitano ****4567"
    },
    {
        id: "tr_1202",
        amount: 120.5,
        status: "pendiente",
        date: "2026-01-20T14:45:00Z",
        destination: "Banco de Crédito ****8821"
    },
    {
        id: "tr_1201",
        amount: 890.0,
        status: "fallida",
        date: "2026-01-10T09:15:00Z",
        destination: "Banco Metropolitano ****4567"
    },
    {
        id: "tr_1199",
        amount: 560.0,
        status: "completada",
        date: "2026-01-05T11:05:00Z",
        destination: "Banco Popular ****1123"
    }
];

const TRANSFER_EXPORT_COLUMNS = ["Importe", "Estado", "Fecha", "Destino"];

const formatCurrency = (value) => `${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})} US$`;

const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date).replace(".", "");
};

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
const formatShortDate = (year, month, day) => new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short"
}).format(new Date(Date.UTC(year, month, day))).replace(".", "");
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
const formatInputDate = (value) => {
    if (!value) return "DD/MM/YYYY";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
};
const getCalendarGrid = (year, month) => {
    const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const weeks = [];
    let day = 1;
    for (let week = 0; week < 6; week += 1) {
        const row = [];
        for (let dow = 0; dow < 7; dow += 1) {
            if (week === 0 && dow < firstDay) {
                row.push(null);
            } else if (day > daysInMonth) {
                row.push(null);
            } else {
                row.push(day);
                day += 1;
            }
        }
        weeks.push(row);
        if (day > daysInMonth) break;
    }
    return weeks;
};
const getMonthLabel = (year, month) => new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric"
}).format(new Date(Date.UTC(year, month, 1)));

export default function BalanceSummaryReport({ onBack }) {
    const [transfers] = useState(INITIAL_TRANSFERS);
    const [availableBalance] = useState(1240.5);
    const [pendingBalance] = useState(350.25);

    const [rangeFilter, setRangeFilter] = useState("Mes en curso");
    const [showRangeDropdown, setShowRangeDropdown] = useState(false);
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);
    const [startCalendarMonth, setStartCalendarMonth] = useState(() => new Date().getMonth());
    const [startCalendarYear, setStartCalendarYear] = useState(() => new Date().getFullYear());
    const [endCalendarMonth, setEndCalendarMonth] = useState(() => new Date().getMonth());
    const [endCalendarYear, setEndCalendarYear] = useState(() => new Date().getFullYear());

    const [exportStep, setExportStep] = useState(null);
    const [exportFormat, setExportFormat] = useState("csv");
    const [exportTimezone, setExportTimezone] = useState("GMT-5");
    const [exportRange, setExportRange] = useState("Mes en curso");
    const [exportCustomStart, setExportCustomStart] = useState("");
    const [exportCustomEnd, setExportCustomEnd] = useState("");
    const [exportCsvContent, setExportCsvContent] = useState("");
    const [exportFilename, setExportFilename] = useState("");
    const [exportMimeType, setExportMimeType] = useState("text/csv;charset=utf-8;");
    const exportTimerRef = useRef(null);
    const startPickerRef = useRef(null);
    const endPickerRef = useRef(null);
    const rangeSelectRef = useRef(null);
    const rangeDropdownRef = useRef(null);

    const filterTimezone = "GMT-5";

    useEffect(() => () => {
        if (exportTimerRef.current) {
            clearTimeout(exportTimerRef.current);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showRangeDropdown && rangeSelectRef.current && !rangeSelectRef.current.contains(event.target)) {
                if (!rangeDropdownRef.current || !rangeDropdownRef.current.contains(event.target)) {
                    setShowRangeDropdown(false);
                }
            }
            if (showStartCalendar && startPickerRef.current && !startPickerRef.current.contains(event.target)) {
                setShowStartCalendar(false);
            }
            if (showEndCalendar && endPickerRef.current && !endPickerRef.current.contains(event.target)) {
                setShowEndCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showStartCalendar, showEndCalendar]);

    const getRangeBounds = (range, timezone, startValue, endValue) => {
        const nowParts = getNowPartsForTimezone(timezone);
        const todayStartUtcMs = toUtcMsFromTimezone(nowParts.year, nowParts.month, nowParts.day, 0, 0, 0, 0, timezone);
        const nowUtcMs = Date.now();

        switch (range) {
            case "Hoy":
                return { startUtcMs: todayStartUtcMs, endUtcMs: nowUtcMs };
            case "Mes en curso":
                return {
                    startUtcMs: toUtcMsFromTimezone(nowParts.year, nowParts.month, 1, 0, 0, 0, 0, timezone),
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
                    startUtcMs: toUtcMsFromTimezone(year, month, 1, 0, 0, 0, 0, timezone),
                    endUtcMs: toUtcMsFromTimezone(year, month, lastDay, 23, 59, 59, 999, timezone)
                };
            }
            case "Todos":
                return { startUtcMs: null, endUtcMs: null };
            case "Personalizado": {
                if (!startValue || !endValue) {
                    return { startUtcMs: null, endUtcMs: null, isInvalid: true };
                }
                const startParts = parseDateInput(startValue);
                const endParts = parseDateInput(endValue);
                let startUtcMs = toUtcMsFromTimezone(startParts.year, startParts.month, startParts.day, 0, 0, 0, 0, timezone);
                let endUtcMs = toUtcMsFromTimezone(endParts.year, endParts.month, endParts.day, 23, 59, 59, 999, timezone);
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

    const getRangeLabel = (option, timezone, startValue, endValue) => {
        const nowParts = getNowPartsForTimezone(timezone);
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
                if (!startValue || !endValue) {
                    return "Selecciona fechas";
                }
                const startParts = parseDateInput(startValue);
                const endParts = parseDateInput(endValue);
                return formatRangeLabel(startParts, endParts);
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

    const buildTransfersExportCsv = (rows) => {
        const header = TRANSFER_EXPORT_COLUMNS.join(",");
        const body = rows.map((transfer) => {
            const createdAt = new Date(transfer.date || "");
            const createdAtValue = Number.isNaN(createdAt.getTime()) ? "" : createdAt.toISOString();
            const values = [
                transfer.amount ?? "",
                transfer.status || "",
                createdAtValue,
                transfer.destination || ""
            ];
            return values.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",");
        }).join("\n");
        return `${header}\n${body}`;
    };

    const buildTransfersExportRows = (rows) => rows.map((transfer) => {
        const createdAt = new Date(transfer.date || "");
        const createdAtValue = Number.isNaN(createdAt.getTime()) ? "" : createdAt.toISOString();
        return [
            transfer.amount ?? "",
            transfer.status || "",
            createdAtValue,
            transfer.destination || ""
        ];
    });

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
        setExportTimezone(filterTimezone);
        setExportRange(rangeFilter);
        setExportCustomStart(customStart);
        setExportCustomEnd(customEnd);
        setExportStep("form");
    };

    const handleExport = () => {
        const { startUtcMs, endUtcMs, isInvalid } = getRangeBounds(exportRange, exportTimezone, exportCustomStart, exportCustomEnd);
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
            const transferRows = transfers
                .filter((transfer) => isInRange(transfer.date))
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            if (transferRows.length === 0) {
                setExportStep("empty");
                return;
            }

            let csvContent = "";
            let mimeType = "text/csv;charset=utf-8;";
            if (exportFormat === "xlsx") {
                csvContent = buildSpreadsheetHtml(TRANSFER_EXPORT_COLUMNS, buildTransfersExportRows(transferRows));
                mimeType = "application/vnd.ms-excel";
            } else {
                csvContent = buildTransfersExportCsv(transferRows);
            }

            const nowParts = getNowPartsForTimezone(exportTimezone);
            const fileDate = `${nowParts.year}-${String(nowParts.month + 1).padStart(2, "0")}-${String(nowParts.day).padStart(2, "0")}`;
            const extension = exportFormat === "xlsx" ? "xlsx" : "csv";
            const filename = `transferencias-${fileDate}.${extension}`;
            setExportCsvContent(csvContent);
            setExportFilename(filename);
            setExportMimeType(mimeType);
            setExportStep("success");
            downloadFile(csvContent, filename, mimeType);
        }, 1200);
    };

    const handleExportDownload = () => {
        if (!exportCsvContent) return;
        downloadFile(exportCsvContent, exportFilename || "transferencias.csv", exportMimeType);
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

    const filterRangeBounds = getRangeBounds(rangeFilter, filterTimezone, customStart, customEnd);
    const isFilterInvalid = Boolean(filterRangeBounds.isInvalid);

    const sortedTransfers = useMemo(() => (
        [...transfers].sort((a, b) => new Date(b.date) - new Date(a.date))
    ), [transfers]);

    const filteredTransfers = useMemo(() => {
        if (rangeFilter === "Todos") return sortedTransfers;
        if (filterRangeBounds.isInvalid) return [];
        const { startUtcMs, endUtcMs } = filterRangeBounds;
        if (startUtcMs == null || endUtcMs == null) return sortedTransfers;
        return sortedTransfers.filter((transfer) => {
            const transferDate = new Date(transfer.date || "");
            if (Number.isNaN(transferDate.getTime())) return false;
            const transferMs = transferDate.getTime();
            return transferMs >= startUtcMs && transferMs <= endUtcMs;
        });
    }, [sortedTransfers, rangeFilter, filterRangeBounds]);

    const totalTransferred = useMemo(() => (
        filteredTransfers
            .filter((transfer) => transfer.status === "completada")
            .reduce((acc, transfer) => acc + (transfer.amount || 0), 0)
    ), [filteredTransfers]);
    const totalGross = useMemo(() => (
        filteredTransfers.reduce((acc, transfer) => acc + (transfer.amount || 0), 0)
    ), [filteredTransfers]);
    const statusSummary = useMemo(() => {
        const summary = {};
        filteredTransfers.forEach((transfer) => {
            const status = transfer.status || "pendiente";
            if (!summary[status]) {
                summary[status] = { count: 0, amount: 0 };
            }
            summary[status].count += 1;
            summary[status].amount += transfer.amount || 0;
        });
        return summary;
    }, [filteredTransfers]);
    const statusRows = useMemo(() => STATUS_ORDER.map((status) => {
        const values = statusSummary[status] || { count: 0, amount: 0 };
        const percent = filteredTransfers.length > 0 ? (values.count / filteredTransfers.length) * 100 : 0;
        return {
            status,
            label: STATUS_LABELS[status] || status,
            count: values.count,
            amount: values.amount,
            percent
        };
    }), [statusSummary, filteredTransfers.length]);
    const topDestinations = useMemo(() => {
        const map = new Map();
        filteredTransfers.forEach((transfer) => {
            const key = transfer.destination || "Destino no definido";
            const current = map.get(key) || { destination: key, count: 0, amount: 0 };
            current.count += 1;
            current.amount += transfer.amount || 0;
            map.set(key, current);
        });
        return Array.from(map.values())
            .sort((a, b) => b.amount - a.amount || b.count - a.count)
            .slice(0, 3);
    }, [filteredTransfers]);
    const generatedAtLabel = useMemo(() => new Intl.DateTimeFormat("es-ES", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date()), []);

    const rangeLabel = getRangeLabel(rangeFilter, filterTimezone, customStart, customEnd);
    const exportRangeLabel = getRangeLabel(exportRange, exportTimezone, exportCustomStart, exportCustomEnd);
    const isCustomRange = rangeFilter === "Personalizado";
    const isCustomExportRange = exportRange === "Personalizado";
    const isExportReady = !isCustomExportRange || (exportCustomStart && exportCustomEnd);

    useEffect(() => {
        if (!isCustomRange) {
            setShowStartCalendar(false);
            setShowEndCalendar(false);
        }
    }, [isCustomRange]);

    const openStartCalendar = () => {
        const base = customStart ? parseDateInput(customStart) : getNowPartsForTimezone(filterTimezone);
        setStartCalendarMonth(base.month);
        setStartCalendarYear(base.year);
        setShowStartCalendar(true);
        setShowEndCalendar(false);
    };

    const openEndCalendar = () => {
        const base = customEnd ? parseDateInput(customEnd) : getNowPartsForTimezone(filterTimezone);
        setEndCalendarMonth(base.month);
        setEndCalendarYear(base.year);
        setShowEndCalendar(true);
        setShowStartCalendar(false);
    };

    const selectStartDate = (day) => {
        const nextValue = `${startCalendarYear}-${String(startCalendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        setCustomStart(nextValue);
        if (customEnd && nextValue > customEnd) {
            setCustomEnd(nextValue);
        }
        setShowStartCalendar(false);
    };

    const selectEndDate = (day) => {
        const nextValue = `${endCalendarYear}-${String(endCalendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        setCustomEnd(nextValue);
        if (customStart && nextValue < customStart) {
            setCustomStart(nextValue);
        }
        setShowEndCalendar(false);
    };

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="space-y-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#4f5b76]" />
                    </button>
                    <h1 className="text-[28px] font-bold text-[#32325d]">Resumen del saldo</h1>
                </div>
                <p className="text-[14px] text-[#4f5b76] ml-12">
                    Cambios en su saldo de Stripe desde el <span className="font-semibold">{rangeLabel}</span>, según la fecha de cambio de saldo.
                </p>
            </div>

            <div className="ml-12 flex flex-wrap items-end gap-3">
                <div className="relative" ref={rangeSelectRef}>
                    <button
                        type="button"
                        onClick={() => setShowRangeDropdown((prev) => !prev)}
                        className={cn(
                            "h-10 min-w-[220px] rounded-lg border bg-white px-4 text-[13px] font-semibold text-[#32325d] flex items-center justify-between shadow-sm transition-colors",
                            showRangeDropdown ? "border-[#93c5fd] ring-2 ring-[#93c5fd]/40" : "border-gray-200"
                        )}
                    >
                        <span>{rangeFilter}</span>
                        <div className="flex flex-col -gap-1">
                            <ChevronDown className="w-4 h-4 text-[#8792a2]" />
                        </div>
                    </button>

                    {showRangeDropdown && (
                        <div
                            ref={rangeDropdownRef}
                            className="absolute top-full left-0 mt-2 w-full rounded-2xl bg-white shadow-xl border border-gray-100 py-2 z-[80] overflow-hidden"
                        >
                            {FILTER_RANGE_OPTIONS.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        setRangeFilter(option);
                                        setShowRangeDropdown(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-[13px] hover:bg-gray-50 flex items-center justify-between"
                                >
                                    <span className={rangeFilter === option ? "text-[#32325d] font-semibold" : "text-[#4f5b76]"}>
                                        {option}
                                    </span>
                                    {rangeFilter === option && (
                                        <div className="w-5 h-5 rounded-full bg-[#4f5b76] flex items-center justify-center">
                                            <span className="text-[11px] text-white">✓</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-[13px] font-semibold text-[#32325d] flex items-center gap-2 shadow-sm"
                >
                    <Calendar className="w-4 h-4 text-[#aab2c4]" />
                    {rangeLabel}
                </button>

                {isCustomRange && (
                    <div className="flex items-end gap-3">
                        <div ref={startPickerRef} className="relative">
                            <label className="block text-[11px] text-[#6b7280] mb-1">Inicio</label>
                            <button
                                type="button"
                                onClick={openStartCalendar}
                                className={cn(
                                    "h-10 w-[160px] rounded-lg border px-3 text-left text-[13px] font-semibold shadow-sm",
                                    customStart ? "border-gray-200 text-[#32325d] bg-white" : "border-gray-200 text-[#9ca3af] bg-white",
                                    showStartCalendar && "ring-2 ring-[#93c5fd] border-[#93c5fd]"
                                )}
                            >
                                {formatInputDate(customStart)}
                            </button>
                            {showStartCalendar && (
                                <div className="absolute left-full top-0 ml-4 w-[320px] rounded-2xl bg-white shadow-xl border border-gray-100 p-4 z-[80]">
                                    <div className="flex items-center justify-between mb-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                let nextMonth = startCalendarMonth - 1;
                                                let nextYear = startCalendarYear;
                                                if (nextMonth < 0) {
                                                    nextMonth = 11;
                                                    nextYear -= 1;
                                                }
                                                setStartCalendarMonth(nextMonth);
                                                setStartCalendarYear(nextYear);
                                            }}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-[#4f5b76]" />
                                        </button>
                                        <div className="text-[16px] font-semibold text-[#32325d] capitalize">
                                            {getMonthLabel(startCalendarYear, startCalendarMonth)}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                let nextMonth = startCalendarMonth + 1;
                                                let nextYear = startCalendarYear;
                                                if (nextMonth > 11) {
                                                    nextMonth = 0;
                                                    nextYear += 1;
                                                }
                                                setStartCalendarMonth(nextMonth);
                                                setStartCalendarYear(nextYear);
                                            }}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <ChevronRight className="w-5 h-5 text-[#4f5b76]" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-7 text-center text-[12px] text-[#6b7280] mb-2">
                                        {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].map((day) => (
                                            <div key={day} className="py-1 font-semibold">{day}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 text-center text-[13px] text-[#32325d] gap-y-1">
                                        {getCalendarGrid(startCalendarYear, startCalendarMonth).flat().map((day, idx) => {
                                            if (!day) return <div key={`start-empty-${idx}`} className="py-2" />;
                                            const selectedParts = customStart ? parseDateInput(customStart) : null;
                                            const isSelected = selectedParts
                                                && selectedParts.year === startCalendarYear
                                                && selectedParts.month === startCalendarMonth
                                                && selectedParts.day === day;
                                            return (
                                                <button
                                                    type="button"
                                                    key={`start-day-${day}-${idx}`}
                                                    onClick={() => selectStartDate(day)}
                                                    className={cn(
                                                        "w-9 h-9 mx-auto rounded-full transition-colors",
                                                        isSelected ? "bg-[#635bff] text-white font-semibold" : "hover:bg-gray-100"
                                                    )}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div ref={endPickerRef} className="relative">
                            <label className="block text-[11px] text-[#6b7280] mb-1">Final</label>
                            <button
                                type="button"
                                onClick={openEndCalendar}
                                className={cn(
                                    "h-10 w-[160px] rounded-lg border px-3 text-left text-[13px] font-semibold shadow-sm",
                                    customEnd ? "border-gray-200 text-[#32325d] bg-white" : "border-gray-200 text-[#9ca3af] bg-white",
                                    showEndCalendar && "ring-2 ring-[#93c5fd] border-[#93c5fd]"
                                )}
                            >
                                {formatInputDate(customEnd)}
                            </button>
                            {showEndCalendar && (
                                <div className="absolute left-full top-0 ml-4 w-[320px] rounded-2xl bg-white shadow-xl border border-gray-100 p-4 z-[80]">
                                    <div className="flex items-center justify-between mb-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                let nextMonth = endCalendarMonth - 1;
                                                let nextYear = endCalendarYear;
                                                if (nextMonth < 0) {
                                                    nextMonth = 11;
                                                    nextYear -= 1;
                                                }
                                                setEndCalendarMonth(nextMonth);
                                                setEndCalendarYear(nextYear);
                                            }}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-[#4f5b76]" />
                                        </button>
                                        <div className="text-[16px] font-semibold text-[#32325d] capitalize">
                                            {getMonthLabel(endCalendarYear, endCalendarMonth)}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                let nextMonth = endCalendarMonth + 1;
                                                let nextYear = endCalendarYear;
                                                if (nextMonth > 11) {
                                                    nextMonth = 0;
                                                    nextYear += 1;
                                                }
                                                setEndCalendarMonth(nextMonth);
                                                setEndCalendarYear(nextYear);
                                            }}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <ChevronRight className="w-5 h-5 text-[#4f5b76]" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-7 text-center text-[12px] text-[#6b7280] mb-2">
                                        {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].map((day) => (
                                            <div key={day} className="py-1 font-semibold">{day}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 text-center text-[13px] text-[#32325d] gap-y-1">
                                        {getCalendarGrid(endCalendarYear, endCalendarMonth).flat().map((day, idx) => {
                                            if (!day) return <div key={`end-empty-${idx}`} className="py-2" />;
                                            const selectedParts = customEnd ? parseDateInput(customEnd) : null;
                                            const isSelected = selectedParts
                                                && selectedParts.year === endCalendarYear
                                                && selectedParts.month === endCalendarMonth
                                                && selectedParts.day === day;
                                            return (
                                                <button
                                                    type="button"
                                                    key={`end-day-${day}-${idx}`}
                                                    onClick={() => selectEndDate(day)}
                                                    className={cn(
                                                        "w-9 h-9 mx-auto rounded-full transition-colors",
                                                        isSelected ? "bg-[#635bff] text-white font-semibold" : "hover:bg-gray-100"
                                                    )}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {isFilterInvalid && (
                <div className="ml-12 text-[12px] text-rose-500">
                    Selecciona un rango válido para ver las transferencias.
                </div>
            )}

            <div className="ml-12 flex items-start gap-3 p-4 bg-[#f7f9fc] rounded-xl border border-gray-100">
                <Info className="w-5 h-5 text-[#635bff] shrink-0 mt-0.5" />
                <p className="text-[13px] text-[#4f5b76] leading-relaxed">
                    Actualmente, los datos diarios están disponibles a través de hoy. Los datos recientes pueden tardar hasta 24 horas en reflejarse.
                </p>
            </div>

            <div className="ml-12 space-y-8">
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-1">
                                <h2 className="text-[17px] font-bold text-[#32325d]">Resumen ejecutivo</h2>
                                <p className="text-[13px] text-[#4f5b76]">
                                    Reporte generado el {generatedAtLabel}.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: "Período", value: rangeLabel },
                                    { label: "Transferencias", value: filteredTransfers.length },
                                    { label: "Importe bruto", value: formatCurrency(totalGross) },
                                    { label: "Total transferido", value: formatCurrency(totalTransferred) }
                                ].map((item) => (
                                    <div key={item.label} className="rounded-xl border border-gray-100 bg-[#f8fafc] px-3 py-2">
                                        <div className="text-[11px] uppercase tracking-wide text-[#8792a2] font-semibold">{item.label}</div>
                                        <div className="text-[13px] font-semibold text-[#32325d]">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 text-[13px] text-[#4f5b76]">
                            En este período se registraron {filteredTransfers.length} transferencias por {formatCurrency(totalGross)}. El{" "}
                            {filteredTransfers.length ? Math.round((statusSummary.completada?.count || 0) / filteredTransfers.length * 100) : 0}% se completó
                            y {statusSummary.pendiente?.count || 0} permanecen pendientes.
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-[15px] font-bold text-[#32325d] mb-4">Distribución por estado</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-b border-gray-50">
                                        <TableHead className="text-[11px] font-bold text-[#8792a2] uppercase text-left">Estado</TableHead>
                                        <TableHead className="text-[11px] font-bold text-[#8792a2] uppercase text-left">Recuento</TableHead>
                                        <TableHead className="text-[11px] font-bold text-[#8792a2] uppercase text-left">% del total</TableHead>
                                        <TableHead className="text-[11px] font-bold text-[#8792a2] uppercase text-left">Importe</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {statusRows.map((row) => (
                                        <TableRow key={row.status} className="hover:bg-gray-50/50 border-b border-gray-50">
                                            <TableCell className="py-3 text-[#4f5b76]">{row.label}</TableCell>
                                            <TableCell className="text-[#32325d]">{row.count}</TableCell>
                                            <TableCell className="text-[#32325d]">{row.percent.toFixed(0)}%</TableCell>
                                            <TableCell className="text-[#32325d] font-medium">{formatCurrency(row.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-[15px] font-bold text-[#32325d] mb-4">Destinos principales</h3>
                            {topDestinations.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b border-gray-50">
                                            <TableHead className="text-[11px] font-bold text-[#8792a2] uppercase text-left">Destino</TableHead>
                                            <TableHead className="text-[11px] font-bold text-[#8792a2] uppercase text-left">Recuento</TableHead>
                                            <TableHead className="text-[11px] font-bold text-[#8792a2] uppercase text-left">Importe</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topDestinations.map((row) => (
                                            <TableRow key={row.destination} className="hover:bg-gray-50/50 border-b border-gray-50">
                                                <TableCell className="py-3 text-[#4f5b76]">{row.destination}</TableCell>
                                                <TableCell className="text-[#32325d]">{row.count}</TableCell>
                                                <TableCell className="text-[#32325d] font-medium">{formatCurrency(row.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-[13px] text-[#8792a2]">Sin datos para mostrar.</div>
                            )}
                        </div>
                    </section>
                </div>

                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="space-y-1 mb-6">
                            <h2 className="text-[17px] font-bold text-[#32325d]">Resumen de saldo</h2>
                            <p className="text-[13px] text-[#4f5b76] leading-relaxed max-w-2xl">
                                Vista rápida del saldo disponible, el saldo entrante y el total transferido dentro del período seleccionado.
                            </p>
                        </div>

                        <div className="space-y-0 text-[14px]">
                            <div className="flex items-center justify-between py-4 border-b border-gray-50">
                                <span className="text-[#4f5b76]">Saldo disponible</span>
                                <span className="font-semibold text-[#32325d]">{formatCurrency(availableBalance)}</span>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-gray-50">
                                <span className="text-[#4f5b76]">Saldo entrante / pendiente</span>
                                <span className="font-semibold text-[#32325d]">{formatCurrency(pendingBalance)}</span>
                            </div>
                            <div className="flex items-center justify-between py-4">
                                <span className="font-semibold text-[#32325d]">Total transferido</span>
                                <span className="font-semibold text-[#32325d]">{formatCurrency(totalTransferred)}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-start justify-between gap-8 mb-6">
                            <div className="space-y-1">
                                <h2 className="text-[17px] font-bold text-[#32325d]">Transferencias</h2>
                                <p className="text-[13px] text-[#4f5b76] leading-relaxed max-w-2xl">
                                    Desglose detallado de las transferencias totales en el período seleccionado.
                                </p>
                            </div>
                            <Button
                                onClick={openExportModal}
                                variant="outline"
                                className="h-8 gap-2 text-[12px] font-bold text-[#32325d]"
                            >
                                <FileDown className="w-3.5 h-3.5 text-[#aab2c4]" />
                                Exportar
                            </Button>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-gray-50">
                                    <TableHead className="w-[40%] text-[12px] font-bold text-[#8792a2] uppercase text-left">Transferencias</TableHead>
                                    <TableHead className="w-[20%] text-[12px] font-bold text-[#8792a2] uppercase text-left">Recuento</TableHead>
                                    <TableHead className="text-[12px] font-bold text-[#8792a2] uppercase text-left">Importe bruto</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="hover:bg-gray-50/50 border-b border-gray-50">
                                    <TableCell className="py-4 text-[#4f5b76]">Transferencias</TableCell>
                                    <TableCell className="text-[#32325d]">{filteredTransfers.length}</TableCell>
                                    <TableCell className="text-[#32325d] font-medium">{formatCurrency(totalGross)}</TableCell>
                                </TableRow>
                                <TableRow className="bg-gray-50/30">
                                    <TableCell className="py-4 font-bold text-[#32325d]">Total transferido</TableCell>
                                    <TableCell className="font-bold text-[#32325d]">{filteredTransfers.length}</TableCell>
                                    <TableCell className="font-bold text-[#32325d]">{formatCurrency(totalTransferred)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="border-t border-gray-100">
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[14px] font-semibold text-[#32325d]">Detalle de transferencias</h3>
                                <span className="text-[12px] text-[#8792a2]">{filteredTransfers.length} movimientos</span>
                            </div>

                            {filteredTransfers.length > 0 ? (
                                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                                <TableHead className="px-6 h-11 text-[11px] font-bold text-[#8792a2] uppercase tracking-wider">Importe</TableHead>
                                                <TableHead className="h-11 text-[11px] font-bold text-[#8792a2] uppercase tracking-wider">Estado</TableHead>
                                                <TableHead className="h-11 text-[11px] font-bold text-[#8792a2] uppercase tracking-wider">Fecha</TableHead>
                                                <TableHead className="h-11 text-[11px] font-bold text-[#8792a2] uppercase tracking-wider">Destino</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredTransfers.map((transfer) => (
                                                <TableRow key={transfer.id} className="hover:bg-gray-50 transition-colors border-gray-100">
                                                    <TableCell className="px-6 py-4 text-[13px] font-bold text-[#32325d]">
                                                        {formatCurrency(transfer.amount)}
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0 h-5 border rounded-md",
                                                                STATUS_STYLES[transfer.status]
                                                            )}
                                                        >
                                                            {transfer.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-[13px] text-[#4f5b76]">
                                                        {formatDate(transfer.date)}
                                                    </TableCell>
                                                    <TableCell className="py-4 text-[13px] text-[#4f5b76]">
                                                        {transfer.destination}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-16 border-2 border-dashed border-gray-100 rounded-2xl bg-[#f6f9fc]/50">
                                    <p className="text-[13px] text-[#8792a2] font-medium tracking-tight">
                                        No se han encontrado transferencias en este período.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {exportStep && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4">
                    {exportStep === "form" && (
                        <div className="w-full max-w-[600px] rounded-2xl bg-white shadow-2xl border border-gray-200">
                            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-[18px] font-semibold text-[#1a1f36]">Exportar transferencias</h3>
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
                                        {FILTER_RANGE_OPTIONS.map((option) => (
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
                                                <span className="text-[12px] text-[#6b7280]">
                                                    {option === exportRange ? exportRangeLabel : getRangeLabel(option, exportTimezone, exportCustomStart, exportCustomEnd)}
                                                </span>
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
                                    <p className="text-[12px] text-[#6b7280]">{TRANSFER_EXPORT_COLUMNS.join(", ")}</p>
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
                                    No hemos podido encontrar ningún dato para exportar según lo que has seleccionado.
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
                                    Tu exportación ha finalizado. Si no ves el archivo,{" "}
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
