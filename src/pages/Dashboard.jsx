/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowLeftRight,
    Box,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Clipboard,
    CornerDownRight,
    CreditCard,
    DollarSign,
    FileText,
    Home,
    LayoutDashboard,
    Link2,
    LogOut,
    Maximize2,
    Package,
    Plus,
    Settings,
    Upload,
    User,
    Users,
    X
} from 'lucide-react';
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import ProductCatalog from "@/pages/ProductCatalog";
import ProductDetail from "@/pages/ProductDetail";
import DashboardCardsSection from "@/components/dashboard/DashboardCardsSection";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EnvironmentBanner from "@/components/dashboard/EnvironmentBanner";
import {
    Area,
    AreaChart,
    ReferenceDot,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts";
import CustomersPage from "./Customers";
import CustomerDetail from "./CustomerDetail";
import BalancesPage from "./Balances";
import BalanceSummaryReport from "./BalanceSummaryReport";
import TransactionsPage from "./Transactions";
import TransfersPage from "./TransfersPage";

import SettingsPage from "./Settings";
import PersonalData from "./settings/PersonalData";
import Communication from "./settings/Communication";
import Business from "./settings/Business";
import TeamSecurity from "./settings/TeamSecurity";
import Compliance from "./settings/Compliance";
import BillingSettings from "./settings/BillingSettings";
import PaymentsSettings from "./settings/PaymentsSettings";
import FinancialConnectionsSettings from "./settings/FinancialConnectionsSettings";
import RadarSettings from "./settings/RadarSettings";
import DevelopersOverview from "@/pages/developers/DevelopersOverview";
import DevelopersWebhooks from "@/pages/developers/DevelopersWebhooks";
import DevelopersEvents from "@/pages/developers/DevelopersEvents";
import DevelopersLogs from "@/pages/developers/DevelopersLogs";
import DevelopersDocs from "@/pages/developers/DevelopersDocs";
import DevelopersApiKeys from "@/pages/developers/DevelopersApiKeys";
import TransferModal from "@/components/transfers/TransferModal";

const SidebarItem = ({ icon: Icon, label, active, hasSubmenu, subItems = [], onClick, onSubItemClick, activeSubItem }) => {
    const [isOpen, setIsOpen] = useState(active || hasSubmenu);
    // Added specific mobile handling hook or logic here if needed for submenus


    return (
        <div className="w-full">
            <button
                onClick={() => {
                    if (hasSubmenu) {
                        setIsOpen(!isOpen);
                    }
                    if (onClick) {
                        onClick();
                    }
                }}
                className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-[14px] font-medium group",
                    active
                        ? "bg-[#635bff15] text-[#635bff]"
                        : "text-[#4f5b76] hover:bg-gray-100"
                )}
            >
                <Icon className={cn("w-[20px] h-[20px]", active ? "text-[#635bff]" : "text-[#4f5b76]")} />
                <span className="flex-1 text-left">{label}</span>
                {hasSubmenu && (
                    isOpen ? <ChevronUp className="w-4 h-4 opacity-50 transition-transform" /> : <ChevronDown className="w-4 h-4 opacity-50 transition-transform" />
                )}
            </button>
            {hasSubmenu && isOpen && (
                <div className="ml-9 mt-1 space-y-1">
                    {subItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => onSubItemClick && onSubItemClick(item)}
                            className={cn(
                                "w-full text-left py-1.5 text-[13px] transition-colors",
                                activeSubItem === item
                                    ? "text-[#635bff]"
                                    : "text-[#4f5b76] hover:text-[#635bff]"
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const getInitials = (value) => {
    if (!value) return "N";
    const words = value.trim().split(" ").filter(Boolean);
    if (words.length === 1) return words[0][0]?.toUpperCase() || "N";
    return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
};

const CopyableKey = ({ label, value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <div className="text-[11px] text-[#697386] mb-1">{label}</div>
            <div className="flex items-center justify-between bg-white rounded px-2 py-1.5 border border-gray-200 min-w-0">
                <code className="text-[11px] font-mono text-[#32325d] truncate mr-2" title={value}>{value}</code>
                <button
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    title={copied ? "¡Copiado!" : "Copiar al portapapeles"}
                >
                    <Clipboard className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

const MOCK_CUSTOMERS = [
    "Cafe Central",
    "Habana Market",
    "Caribe Tech",
    "Isla Retail",
    "Soluciones Delta",
    "Mar Azul",
    "Pacifico Imports",
    "Vega Logistics"
];

const ERROR_REASONS = [
    { id: "insufficient_funds", label: "Fondos insuficientes", color: "#f97316" },
    { id: "expired_card", label: "Tarjeta vencida", color: "#ef4444" },
    { id: "suspected_fraud", label: "Posible fraude", color: "#0ea5e9" },
    { id: "processor_error", label: "Error del procesador", color: "#10b981" }
];

const FEE_RATE = 0.029;
const FEE_FLAT = 0.3;

const roundToCents = (value) => Math.round(value * 100) / 100;

const startOfDay = (date) => {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    return day;
};

const formatHourLabel = (date) => date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
});

const formatCount = (value) => value.toLocaleString("es-ES");

const formatUsd = (value) => `${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})} US$`;

const generateMockPayments = (seedDate, seedOffset = 0) => {
    const start = startOfDay(seedDate);
    const daySeed = start.getDate() + start.getMonth() * 31 + seedOffset * 7;
    const payments = [];

    for (let hour = 0; hour < 24; hour += 1) {
        const hourStart = new Date(start);
        hourStart.setHours(start.getHours() + hour);
        const paymentsCount = 1 + ((hour + daySeed) % 3);

        for (let index = 0; index < paymentsCount; index += 1) {
            const seed = daySeed + hour * 5 + index * 7;
            const base = 28 + ((hour * 9 + seedOffset * 11) % 70);
            const wave = Math.sin((hour + seedOffset) / 2) * 12;
            const bump = (seed % 10) * 1.4;
            let amount = roundToCents(base + wave + bump);

            if ((seed + hour) % 8 === 0) {
                amount = roundToCents(amount + 55);
            }

            amount = Math.max(12, amount);
            const failureSeed = (seed + hour * 3 + index * 11 + seedOffset * 5) % 13;
            let status = "succeeded";
            let errorReason = null;

            if (failureSeed === 0) {
                status = "failed";
                errorReason = ERROR_REASONS[seed % ERROR_REASONS.length].id;
            }

            const succeeded = status === "succeeded";
            const fee = succeeded ? roundToCents(amount * FEE_RATE + FEE_FLAT) : 0;
            const createdAt = new Date(hourStart.getTime() + (index + 1) * 12 * 60 * 1000);

            payments.push({
                id: `pm_${start.getFullYear()}${String(start.getMonth() + 1).padStart(2, "0")}${String(start.getDate()).padStart(2, "0")}_${hour}_${index}`,
                amount,
                fee,
                netAmount: succeeded ? roundToCents(amount - fee) : 0,
                status,
                errorReason,
                createdAt,
                customer: MOCK_CUSTOMERS[(seed + hour + index) % MOCK_CUSTOMERS.length]
            });
        }
    }

    return payments;
};

const buildHourlySeries = (payments, seedDate) => {
    const start = startOfDay(seedDate);
    const buckets = Array.from({ length: 24 }, (_, hour) => {
        const hourDate = new Date(start);
        hourDate.setHours(start.getHours() + hour);
        return {
            time: formatHourLabel(hourDate),
            gross: 0,
            net: 0,
            payments: 0,
            newCustomers: 0
        };
    });

    const sortedPayments = [...payments].sort((a, b) => a.createdAt - b.createdAt);
    const seenCustomers = new Set();

    sortedPayments.forEach((payment) => {
        const hourIndex = payment.createdAt.getHours();
        const bucket = buckets[hourIndex];

        if (!bucket) {
            return;
        }

        bucket.gross += payment.amount;
        bucket.net += payment.netAmount;
        bucket.payments += 1;

        if (!seenCustomers.has(payment.customer)) {
            seenCustomers.add(payment.customer);
            bucket.newCustomers += 1;
        }
    });

    let runningBalance = 0;
    const series = buckets.map((bucket) => {
        runningBalance = roundToCents(runningBalance + bucket.net);
        return {
            ...bucket,
            gross: roundToCents(bucket.gross),
            net: roundToCents(bucket.net),
            balance: runningBalance
        };
    });

    const totals = {
        gross: roundToCents(series.reduce((sum, item) => sum + item.gross, 0)),
        net: roundToCents(series.reduce((sum, item) => sum + item.net, 0)),
        payments: series.reduce((sum, item) => sum + item.payments, 0),
        customers: series.reduce((sum, item) => sum + item.newCustomers, 0),
        balance: series.length ? series[series.length - 1].balance : 0
    };

    return { series, totals };
};

const BalanceChart = ({ data, timeLabel }) => {
    const lastPoint = data[data.length - 1];
    const label = timeLabel || lastPoint?.time;

    return (
        <div className="relative h-[220px] w-full mb-8">
            <div className="absolute inset-0 flex flex-col justify-between z-0">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="w-full h-[1px] bg-gray-100" />
                ))}
            </div>
            <div className="absolute inset-0 flex justify-between z-0">
                {[...Array(25)].map((_, i) => (
                    <div key={i} className="w-[1px] h-full bg-gray-100" />
                ))}
            </div>
            <div className="absolute inset-0 z-10">
                <ResponsiveContainer>
                    <AreaChart data={data} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                        <defs>
                            <linearGradient id="balance-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#635bff" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#635bff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, (max) => max + 40]} />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="#635bff"
                            strokeWidth={2}
                            fill="url(#balance-gradient)"
                            dot={false}
                        />
                        {lastPoint && (
                            <ReferenceDot
                                x={lastPoint.time}
                                y={lastPoint.balance}
                                r={3}
                                fill="#635bff"
                                stroke="#fff"
                                strokeWidth={1.5}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {label && (
                <div className="absolute bottom-[-20px] right-0 text-[11px] text-[#aab2c4]">{label}</div>
            )}
        </div>
    );
};

const formatPaymentLinkDate = (dateValue) => {
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

const DAY_MS = 24 * 60 * 60 * 1000;
const PAYMENT_LINK_STATUS_STYLES = {
    Activo: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Desactivado: "bg-slate-50 text-slate-700 border-slate-200"
};

const PaymentLinksView = ({ onCreateClick, paymentLinks, onRenameLink, onToggleStatus, testMode }) => {
    const hasLinks = paymentLinks.length > 0;
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showCopyHintId, setShowCopyHintId] = useState(null);
    const [renameTarget, setRenameTarget] = useState(null);
    const [renameValue, setRenameValue] = useState("");
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [statusFilterValue, setStatusFilterValue] = useState("Todo");
    const [appliedFilter, setAppliedFilter] = useState("Todo");
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
    const [exportStep, setExportStep] = useState(null);
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
    const renameInputRef = useRef(null);
    const exportTimerRef = useRef(null);

    // Sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    const exportColumns = ["ID", "Fecha de creación", "Estado", "Moneda", "URL", "Nombre"];
    const exportRangeOptions = [
        "Hoy",
        "Mes en curso",
        "Últimos 7 días",
        "Últimas 4 semanas",
        "Último mes",
        "Todos",
        "Personalizado"
    ];
    const paymentLinksBaseUrl = "https://buy.antillapay.com/";

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
    const buildExportCsv = (rows) => {
        const header = exportColumns.join(",");
        const body = rows.map((link) => {
            const createdAt = new Date(link.createdAt || link.created_at || Date.now());
            const createdAtValue = Number.isNaN(createdAt.getTime()) ? "" : createdAt.toISOString();
            const isActive = link.status === "Activo";
            const values = [
                link.id || "",
                createdAtValue,
                isActive ? "true" : "false",
                link.currencyCode || "",
                link.url || `${paymentLinksBaseUrl}${link.id || ""}`,
                link.name || ""
            ];
            return values.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",");
        }).join("\n");
        return `${header}\n${body}`;
    };
    const buildExportRows = (rows) => rows.map((link) => {
        const createdAt = new Date(link.createdAt || link.created_at || Date.now());
        const createdAtValue = Number.isNaN(createdAt.getTime()) ? "" : createdAt.toISOString();
        const isActive = link.status === "Activo";
        return [
            link.id || "",
            createdAtValue,
            isActive ? "true" : "false",
            link.currencyCode || "",
            link.url || `${paymentLinksBaseUrl}${link.id || ""}`,
            link.name || ""
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
            const rows = paymentLinks.filter((link) => {
                if (startUtcMs == null || endUtcMs == null) {
                    return true;
                }
                const linkDate = new Date(link.createdAt || link.created_at || "");
                if (Number.isNaN(linkDate.getTime())) return false;
                const linkMs = linkDate.getTime();
                return linkMs >= startUtcMs && linkMs <= endUtcMs;
            });

            if (rows.length === 0) {
                setExportStep("empty");
                return;
            }

            const nowParts = getNowPartsForTimezone(exportTimezone);
            const fileDate = `${nowParts.year}-${String(nowParts.month + 1).padStart(2, "0")}-${String(nowParts.day).padStart(2, "0")}`;
            const extension = exportFormat === "xlsx" ? "xlsx" : "csv";
            const filename = `payment-links-${fileDate}.${extension}`;
            let csvContent = "";
            let mimeType = "text/csv;charset=utf-8;";
            if (exportFormat === "xlsx") {
                csvContent = buildSpreadsheetHtml(exportColumns, buildExportRows(rows));
                mimeType = "application/vnd.ms-excel";
            } else {
                csvContent = buildExportCsv(rows);
            }
            setExportCsvContent(csvContent);
            setExportFilename(filename);
            setExportMimeType(mimeType);
            setExportStep("success");
            downloadFile(csvContent, filename, mimeType);
        }, 1200);
    };
    const handleExportDownload = () => {
        if (!exportCsvContent) return;
        downloadFile(exportCsvContent, exportFilename || "payment-links.csv", exportMimeType);
    };
    const cancelExportLoading = () => {
        resetExportFlow();
    };

    const filteredLinks = paymentLinks
        .filter(link => appliedFilter === "Todo" || link.status === appliedFilter)
        .filter(link => {
            if (!appliedDateFilter) return true;

            const linkDate = new Date(link.createdAt || link.created_at || Date.now());

            if (appliedDateFilter.type === "es igual a") {
                const filterDate = appliedDateFilter.date;
                return linkDate.toDateString() === filterDate.toDateString();
            } else if (appliedDateFilter.type === "entre") {
                const start = appliedDateFilter.startDate;
                const end = appliedDateFilter.endDate;
                return linkDate >= start && linkDate <= end;
            } else if (appliedDateFilter.type === "está en los últimos") {
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

                return linkDate >= pastDate;
            } else if (appliedDateFilter.type === "en esa fecha o después") {
                const filterDate = appliedDateFilter.date || new Date();
                return linkDate >= filterDate;
            } else if (appliedDateFilter.type === "es anterior o igual al") {
                const filterDate = appliedDateFilter.date || new Date();
                return linkDate <= filterDate;
            }

            return true;
        });
    const hasActiveFilters = appliedFilter !== "Todo" || Boolean(appliedDateFilter);
    const todayInputValue = getTodayInputValue(exportTimezone);
    const isCustomExportRange = exportRange === "Personalizado";
    const isExportReady = !isCustomExportRange || (exportCustomStart && exportCustomEnd);

    const clearRangeFilter = () => {
        setStartDate(null);
        setEndDate(null);
        setShowStartCalendar(false);
        setShowEndCalendar(false);
        setAppliedDateFilter(null);
    };

    const resetFilters = () => {
        setAppliedFilter("Todo");
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
    }, [openMenuId, showStatusFilter, isStatusDropdownOpen, showDateFilter, isDateDropdownOpen]);

    useEffect(() => {
        return () => {
            if (exportTimerRef.current) {
                clearTimeout(exportTimerRef.current);
            }
        };
    }, []);

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
        if (!renameTarget) return;
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setRenameTarget(null);
            }
        };
        document.addEventListener("keydown", handleEscape);
        requestAnimationFrame(() => renameInputRef.current?.focus());
        return () => document.removeEventListener("keydown", handleEscape);
    }, [renameTarget]);

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
                <h1 className="text-[28px] font-bold text-[#32325d]">Payment Links</h1>
                <Button
                    onClick={onCreateClick}
                    className="bg-[#635bff] hover:bg-[#5851e0] text-white font-semibold rounded-full px-4 py-2 flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    {testMode ? "Crear enlace de pago de prueba" : "Crear enlace de pago"}
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[11px] font-semibold">
                        N
                    </span>
                </Button>
            </div>

            {hasLinks ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-wrap gap-3">
                            {["Fecha de creación", "Estado"].map((label) => (
                                <div key={label} className="relative">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (label === "Estado") {
                                                setShowStatusFilter(!showStatusFilter);
                                                setShowDateFilter(false);
                                            } else if (label === "Fecha de creación") {
                                                setShowDateFilter(!showDateFilter);
                                                setShowStatusFilter(false);
                                            }
                                        }}
                                        className={cn(
                                            "inline-flex items-center gap-2 rounded-full border border-dashed border-gray-200 px-2.5 py-1 text-[12px] text-[#4f5b76] hover:border-[#cbd5f5] transition-colors",
                                            ((label === "Estado" && showStatusFilter) || (label === "Fecha de creación" && showDateFilter)) && "bg-gray-50 border-[#cbd5f5]"
                                        )}
                                    >
                                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-200 text-[11px] text-[#8792a2]">
                                            +
                                        </span>
                                        {label}
                                        {label === "Estado" && appliedFilter !== "Todo" && (
                                            <span className="ml-2 text-[#635bff] text-[11px] font-semibold">
                                                {appliedFilter}
                                            </span>
                                        )}
                                        {label === "Fecha de creación" && (
                                            <>
                                                <ChevronDown className="w-3.5 h-3.5 text-[#635bff]" />
                                                {appliedDateFilter && (
                                                    <span className="ml-2 text-[#635bff] text-[11px] flex items-center gap-1">
                                                        {appliedDateFilter.type === "es igual a"
                                                            ? appliedDateFilter.date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                                            : appliedDateFilter.type === "entre"
                                                                ? `${appliedDateFilter.startDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${appliedDateFilter.endDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                                                                : appliedDateFilter.type === "en esa fecha o después"
                                                                    ? `A partir del ${appliedDateFilter.date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                                                                    : appliedDateFilter.type === "es anterior o igual al"
                                                                        ? `Termina el ${appliedDateFilter.date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
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
                                                            {["Todo", "Activo", "Desactivado"].map((opt) => (
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
                                                    setAppliedFilter(statusFilterValue);
                                                    setShowStatusFilter(false);
                                                }}
                                                className="w-full bg-[#635bff] hover:bg-[#5851e0] text-white font-bold py-1.5 text-[12px] rounded-lg"
                                            >
                                                Aplicar
                                            </Button>
                                        </div>
                                    )}


                                    {label === "Fecha de creación" && showDateFilter && (
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
                                                                    {selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
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
                                                                                    {calendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
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
                                                                                {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(day => (
                                                                                    <div key={day} className="font-semibold text-[#4f5b76] py-1">
                                                                                        {day}
                                                                                    </div>
                                                                                ))}

                                                                                {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => {
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
                                                                                            className={`py-1 px-2 rounded text-xs hover:bg-gray-100 ${isToday ? 'bg-[#635bff] text-white' :
                                                                                                isSelected ? 'bg-[#cbd5f5] text-[#32325d]' :
                                                                                                    'text-[#4f5b76]'
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
                                                                        value={startDate ? startDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : ""}
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
                                                                                                {calendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
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
                                                                                            {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(day => (
                                                                                                <div key={day} className="font-semibold text-[#4f5b76] py-1">
                                                                                                    {day}
                                                                                                </div>
                                                                                            ))}

                                                                                            {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => {
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
                                                                                                        className={`py-1 px-2 rounded text-xs hover:bg-gray-100 ${isInRange ? 'bg-[#cbd5f5] text-[#32325d]' : 'text-[#4f5b76]'
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
                                                                        value={endDate ? endDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : ""}
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
                                                                                                {calendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
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
                                                                                            {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(day => (
                                                                                                <div key={day} className="font-semibold text-[#4f5b76] py-1">
                                                                                                    {day}
                                                                                                </div>
                                                                                            ))}

                                                                                            {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => {
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
                                                                                                        className={`py-1 px-2 rounded text-xs hover:bg-gray-100 ${isInRange ? 'bg-[#cbd5f5] text-[#32325d]' : 'text-[#4f5b76]'
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
                                                                    {selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
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
                                                                                    {calendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
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
                                                                                {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(day => (
                                                                                    <div key={day} className="font-semibold text-[#4f5b76] py-1">
                                                                                        {day}
                                                                                    </div>
                                                                                ))}

                                                                                {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => {
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
                                                                                            className={`py-1 px-2 rounded text-xs hover:bg-gray-100 ${isToday ? 'bg-[#635bff] text-white' :
                                                                                                isSelected ? 'bg-[#cbd5f5] text-[#32325d]' :
                                                                                                    'text-[#4f5b76]'
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
                                                                    {selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
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
                                                                                    {calendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
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
                                                                                {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(day => (
                                                                                    <div key={day} className="font-semibold text-[#4f5b76] py-1">
                                                                                        {day}
                                                                                    </div>
                                                                                ))}

                                                                                {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => {
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
                                                                                            className={`py-1 px-2 rounded text-xs hover:bg-gray-100 ${isToday ? 'bg-[#635bff] text-white' :
                                                                                                isSelected ? 'bg-[#cbd5f5] text-[#32325d]' :
                                                                                                    'text-[#4f5b76]'
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
                            <button
                                onClick={openExportModal}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                            >
                                <Upload className="w-4 h-4 text-[#8792a2]" />
                                Exportar
                            </button>
                        </div>
                    </div>
                    <div className="px-6 pb-6">
                        {filteredLinks.length > 0 && (
                            <div className="grid grid-cols-[2fr_2fr_1fr_auto] gap-4 py-4 text-[13px] font-semibold text-[#6b7280] border-b border-gray-200">
                                <div>Nombre</div>
                                <div>Precio</div>
                                <div>Fecha de creación</div>
                                <div />
                            </div>
                        )}
                        {filteredLinks.length === 0 ? (
                            <div className="py-16 flex flex-col items-center text-center">
                                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                                    <Link2 className="w-6 h-6 text-[#9ca3af]" />
                                </div>
                                <h3 className="text-[18px] font-semibold text-[#32325d]">
                                    No se han encontrado enlaces de pago de prueba
                                </h3>
                                <p className="mt-2 text-[14px] text-[#6b7280] max-w-[360px]">
                                    No se han encontrado resultados para esa consulta. Intenta usar filtros diferentes.
                                </p>
                            </div>
                        ) : (
                            filteredLinks.map((link) => {
                                const isActive = link.status === "Activo";
                                return (
                                    <div
                                        key={link.id}
                                        className="grid grid-cols-[2fr_2fr_1fr_auto] gap-4 py-4 text-[14px] text-[#32325d] border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold">{link.name}</span>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "rounded-full border text-[11px]",
                                                    PAYMENT_LINK_STATUS_STYLES[link.status] || "bg-slate-50 text-slate-700 border-slate-200"
                                                )}
                                            >
                                                {link.status}
                                            </Badge>
                                        </div>
                                        <div className="text-[#4f5b76]">
                                            {link.priceType === "customer_choice"
                                                ? `A elección del cliente (${link.currencyCode})`
                                                : link.priceLabel}
                                        </div>
                                        <div className="text-[#4f5b76]">{formatPaymentLinkDate(link.createdAt)}</div>
                                        <div className="relative flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOpenMenuId(openMenuId === link.id ? null : link.id);
                                                    setShowCopyHintId(null);
                                                }}
                                                className="text-[#aab2c4] text-lg leading-none hover:text-[#6b7280]"
                                            >
                                                ...
                                            </button>
                                            {openMenuId === link.id && (
                                                <div className="absolute right-0 top-6 z-20">
                                                    <div
                                                        ref={menuRef}
                                                        className="w-56 rounded-xl border border-gray-200 bg-white shadow-xl"
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setRenameTarget(link);
                                                                setRenameValue(link.name);
                                                                setOpenMenuId(null);
                                                                setShowCopyHintId(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-[14px] text-[#32325d] hover:bg-gray-50 rounded-t-xl"
                                                        >
                                                            Cambiar nombre
                                                        </button>
                                                        <div
                                                            onMouseEnter={() => setShowCopyHintId(link.id)}
                                                            onMouseLeave={() => setShowCopyHintId(null)}
                                                            className="border-t border-gray-200 relative"
                                                        >
                                                            {showCopyHintId === link.id && (
                                                                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-[220px] bg-white rounded-xl shadow-xl p-4 z-50 border border-gray-100">
                                                                    <div className="absolute -right-[6.5px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-t border-r border-l-0 border-b-0 border-gray-100" />
                                                                    <p className="text-[#4f5b76] text-[13px] leading-relaxed">
                                                                        Para copiar los enlaces de pago al modo activo, activa tu cuenta
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
                                                        <div className="border-t border-gray-200">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    onToggleStatus(link.id);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className={`w-full text-left px-4 py-2.5 text-[14px] rounded-b-xl ${isActive ? "text-[#4f5b76]" : "text-[#635bff]"
                                                                    }`}
                                                            >
                                                                {isActive ? "Desactivar" : "Activar"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-[#f4f5f7] rounded-2xl border border-gray-100 p-8 lg:p-12 shadow-sm min-h-[320px] lg:min-h-[360px]">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">
                        <div className="max-w-xl">
                            <h2 className="text-[32px] lg:text-[36px] font-bold text-[#32325d] leading-tight">
                                Crea una página de un proceso
                                de compra con solo unos clics
                            </h2>
                            <p className="mt-4 text-[15px] text-[#4f5b76] leading-relaxed">
                                Vende productos, ofrece suscripciones o acepta donaciones con un enlace;
                                no se requiere programación.
                            </p>
                            <Button
                                onClick={onCreateClick}
                                className="mt-6 bg-[#635bff] hover:bg-[#5851e0] text-white font-semibold rounded-full px-5 py-2.5 shadow-sm"
                            >
                                Crea un enlace de pago de prueba
                            </Button>
                        </div>

                        <div className="w-full lg:w-[420px] flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-[420px]" aria-hidden="true">
                                <div className="bg-white rounded-2xl shadow-[0_18px_50px_-30px_rgba(15,23,42,0.4)] p-6">
                                    <div className="flex gap-6">
                                        <div className="w-[150px] bg-[#0f8f7e] rounded-xl p-4 flex items-center justify-center">
                                            <div className="bg-white/90 rounded-lg w-full h-full flex items-center justify-center">
                                                <div className="relative w-12 h-12">
                                                    <div className="absolute left-0 bottom-0 w-6 h-6 bg-[#0f8f7e] rounded-sm" />
                                                    <div className="absolute right-0 top-0 w-6 h-6 bg-[#f59e0b] rounded-sm" />
                                                    <div className="absolute right-1 bottom-1 w-4 h-4 bg-white rounded-sm" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="h-3 w-28 bg-[#0f172a] rounded-sm" />
                                            <div className="space-y-2">
                                                <div className="h-2 w-36 bg-gray-100 rounded-full" />
                                                <div className="h-2 w-32 bg-gray-100 rounded-full" />
                                                <div className="h-2 w-28 bg-gray-100 rounded-full" />
                                            </div>
                                            <div className="h-2 w-24 bg-[#0f8f7e] rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-0 sm:absolute sm:-right-6 sm:top-12 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 max-w-[220px]">
                                    <div className="text-[11px] text-[#635bff] font-semibold truncate">buy.antillapay.com/EaUa24H</div>
                                    <div className="mt-2 h-2 w-24 bg-[#635bff] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
            {
                renameTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
                        <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl border border-gray-200">
                            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                                <div className="space-y-1">
                                    <h3 className="text-[20px] font-semibold text-[#1a1f36]">Cambiar nombre</h3>
                                    <p className="text-[14px] text-[#6b7280]">
                                        Este nombre solo aparece en el Dashboard de AntillaPay, y tus clientes no lo verán.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setRenameTarget(null)}
                                    className="rounded-xl border border-[#93c5fd] p-2 text-[#1f2937] hover:bg-[#eff6ff]"
                                    aria-label="Cerrar"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="px-6 py-5 border-b border-gray-200">
                                <label className="block text-[14px] font-semibold text-[#1f2937] mb-2">Nombre</label>
                                <input
                                    ref={renameInputRef}
                                    type="text"
                                    maxLength={250}
                                    value={renameValue}
                                    onChange={(event) => setRenameValue(event.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[14px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                                />
                                <div className="mt-2 text-right text-[12px] text-[#6b7280]">
                                    {renameValue.length}/250 caracteres
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 px-6 py-4">
                                <button
                                    type="button"
                                    onClick={() => setRenameTarget(null)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-[14px] font-semibold text-[#374151] hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    disabled={!renameValue.trim()}
                                    onClick={() => {
                                        const nextName = renameValue.trim();
                                        if (nextName) {
                                            onRenameLink(renameTarget.id, nextName);
                                        }
                                        setRenameTarget(null);
                                    }}
                                    className={`rounded-lg px-4 py-2 text-[14px] font-semibold text-white ${renameValue.trim()
                                        ? "bg-[#635bff] hover:bg-[#5851e0]"
                                        : "bg-[#c4c7ff] cursor-not-allowed"
                                        }`}
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {exportStep && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4">
                    {exportStep === "form" && (
                        <div className="w-full max-w-[600px] rounded-2xl bg-white shadow-2xl border border-gray-200">
                            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-[18px] font-semibold text-[#1a1f36]">Exportar enlaces de pago</h3>
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
        </div >
    );
};

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [environment] = useState("test");
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [showOnboardingBanner, setShowOnboardingBanner] = useState(() => {
        if (typeof window === "undefined") return true;
        const hasShown = window.sessionStorage.getItem("antillapay_onboarding_shown");
        if (!hasShown) {
            window.sessionStorage.setItem("antillapay_onboarding_shown", "true");
            return true;
        }
        return false;
    });
    const [isGuideCollapsed, setIsGuideCollapsed] = useState(false);
    const [isHeaderElevated, setIsHeaderElevated] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const contentRef = useRef(null);
    const [completedTasks, setCompletedTasks] = useState(() => {
        if (typeof window === "undefined") return [];
        const saved = window.localStorage.getItem("antillapay_onboarding_tasks");
        return saved ? JSON.parse(saved) : [];
    });
    const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
    const [showCustomizeModal, setShowCustomizeModal] = useState(false);
    const [customizeStep, setCustomizeStep] = useState("form");
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [paymentLinks, setPaymentLinks] = useState(() => {
        if (typeof window === "undefined") return [];
        const stored = window.localStorage.getItem("antillapay_payment_links");
        return stored ? JSON.parse(stored) : [];
    });
    const [verificationState, setVerificationState] = useState(() => {
        if (typeof window === "undefined") return { currentStep: 1 };
        // Check for full completion flag
        if (window.localStorage.getItem("antillapay_business_verified")) {
            return { currentStep: 9 };
        }
        const saved = window.localStorage.getItem("antillapay_business_verification");
        return saved ? JSON.parse(saved) : { currentStep: 1 };
    });

    useEffect(() => {
        const handleVerificationUpdate = (event) => {
            // Check for full completion first
            if (window.localStorage.getItem("antillapay_business_verified")) {
                setVerificationState({ currentStep: 9 });
                return;
            }

            if (event.detail && event.detail.currentStep) {
                setVerificationState(prev => ({ ...prev, currentStep: event.detail.currentStep }));
            } else {
                const saved = window.localStorage.getItem("antillapay_business_verification");
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        setVerificationState(prev => ({ ...prev, currentStep: parsed.currentStep || 1 }));
                    } catch (e) {
                        console.error("Error parsing verification state", e);
                    }
                }
            }
        };

        window.addEventListener('verificationStateChanged', handleVerificationUpdate);
        window.addEventListener('storage', handleVerificationUpdate);

        return () => {
            window.removeEventListener('verificationStateChanged', handleVerificationUpdate);
            window.removeEventListener('storage', handleVerificationUpdate);
        };
    }, []);
    const [isVerificationExpanded, setIsVerificationExpanded] = useState(true);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [activeView, setActiveView] = useState(() => {
        const path = location.pathname.toLowerCase();
        if (path.startsWith("/dashboard/settings")) {
            return "settings";
        }
        if (path.startsWith("/dashboard/customers/")) {
            return "customer_detail";
        }
        if (path.startsWith("/customers") || path.startsWith("/dashboard/customers")) {
            return "customers";
        }
        if (path.startsWith("/dashboard/transactions") || path.startsWith("/dashboard/transacciones")) {
            return "transactions";
        }
        if (path.startsWith("/dashboard/transfers")) {
            return "transfers";
        }
        if (path.startsWith("/dashboard/payment-links")) {
            return "payments_links";
        }
        if (path.startsWith("/dashboard/balances") || path.startsWith("/dashboard/saldos")) {
            return "saldos";
        }
        if (path.startsWith("/dashboard/balance-report")) {
            return "balance_report";
        }
        return "home";
    });

    // Items dentro de "Verifica tu empresa"
    const verificationSteps = [
        { id: 1, label: "Datos fiscales" },
        { id: 2, label: "Datos de la empresa" },
        { id: 3, label: "Representante de la empresa" },
        { id: 4, label: "Productos y servicios" },
        { id: 5, label: "Datos públicos" }
    ];

    // Items principales (fuera del expandible)
    const mainVerificationItems = [
        { id: 6, label: "Añade tu banco" },
        { id: 7, label: "Asegura tu cuenta" }
    ];

    // Calculate completed verification steps (steps strictly less than current step are definitely done, 
    // or we can assume if currentStep is > id, it's done. 
    // If account is fully verified (step 8 submitted), all are done.
    // For now, based on currentStep: items < currentStep are completed.
    // Contar items completados (5 dentro de Verifica tu empresa + 2 items principales)
    const completedVerificationStepsCount = verificationState.currentStep > 1 ? verificationState.currentStep - 1 : 0;

    // Total tasks = 1 (customize) + 5 (verification steps) + 2 (main items)
    const totalTasks = 1 + verificationSteps.length + mainVerificationItems.length;
    const completedCount = (completedTasks.includes("customize_account") ? 1 : 0) + completedVerificationStepsCount;
    const progressPercent = Math.round((completedCount / totalTasks) * 100);

    useEffect(() => {
        window.localStorage.setItem("antillapay_onboarding_tasks", JSON.stringify(completedTasks));
    }, [completedTasks]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem("antillapay_payment_links", JSON.stringify(paymentLinks));
    }, [paymentLinks]);

    const handleRenamePaymentLink = (id, name) => {
        setPaymentLinks((prev) =>
            prev.map((link) => (link.id === id ? { ...link, name } : link))
        );
    };

    const handleTogglePaymentLinkStatus = (id) => {
        setPaymentLinks((prev) =>
            prev.map((link) =>
                link.id === id
                    ? { ...link, status: link.status === "Activo" ? "Desactivado" : "Activo" }
                    : link
            )
        );
    };

    useEffect(() => {
        const newLink = location.state?.newPaymentLink;
        if (!newLink) return;
        setPaymentLinks((prev) => {
            if (prev.some((link) => link.id === newLink.id)) {
                return prev;
            }
            return [newLink, ...prev];
        });
        navigate(location.pathname, { replace: true, state: null });
    }, [location.state, location.pathname, navigate]);

    useEffect(() => {
        const path = location.pathname.toLowerCase();
        if (path.startsWith("/dashboard/settings")) {
            setActiveView("settings");
            setSelectedProductId(null);
            setSelectedCustomerId(null);
            return;
        }
        if (path.startsWith("/dashboard/customers/")) {
            const parts = path.split("/");
            setSelectedCustomerId(parts[3] || null);
            setActiveView("customer_detail");
            setSelectedProductId(null);
            return;
        }
        if (path.startsWith("/customers") || path.startsWith("/dashboard/customers")) {
            setActiveView("customers");
            setSelectedProductId(null);
            setSelectedCustomerId(null);
            return;
        }
        if (path.startsWith("/dashboard/transactions") || path.startsWith("/dashboard/transacciones")) {
            setActiveView("transactions");
            setSelectedProductId(null);
            setSelectedCustomerId(null);
            return;
        }
        if (path.startsWith("/dashboard/transfers")) {
            setActiveView("transfers");
            setSelectedProductId(null);
            setSelectedCustomerId(null);
            return;
        }
        if (path.startsWith("/dashboard/payment-links")) {
            setActiveView("payments_links");
            setSelectedProductId(null);
            setSelectedCustomerId(null);
            return;
        }
        if (path.startsWith("/dashboard/products/")) {
            const parts = path.split("/");
            setSelectedProductId(parts[3] || null);
            setActiveView("product_detail");
            setSelectedCustomerId(null);
            return;
        }
        if (path.startsWith("/dashboard/product-catalog")) {
            setActiveView("product_catalog");
            setSelectedProductId(null);
            setSelectedCustomerId(null);
            return;
        }
        if (path.startsWith("/dashboard/balances") || path.startsWith("/dashboard/saldos")) {
            setActiveView("saldos");
            setSelectedProductId(null);
            setSelectedCustomerId(null);
            return;
        }
        if (path.startsWith("/dashboard/balance-report")) {
            setActiveView("balance_report");
            setSelectedProductId(null);
            setSelectedCustomerId(null);
            return;
        }
        if (path.startsWith("/dashboard")) {
            if (path.includes("/dashboard/developers/overview")) setActiveView("dev_resumen");
            else if (path.includes("/dashboard/developers/webhooks")) setActiveView("dev_webhooks");
            else if (path.includes("/dashboard/developers/events")) setActiveView("dev_eventos");
            else if (path.includes("/dashboard/developers/logs")) setActiveView("dev_registros");
            else if (path.includes("/dashboard/developers/docs")) setActiveView("dev_docs");
            else if (path.includes("/dashboard/developers/keys")) setActiveView("dev_keys");
            else {
                setActiveView("home");
                setSelectedProductId(null);
                setSelectedCustomerId(null);
            }
        }
    }, [location.pathname]);

    useEffect(() => {
        const container = contentRef.current;
        if (!container) {
            return;
        }
        const handleScroll = () => {
            setIsHeaderElevated(container.scrollTop > 0);
        };
        handleScroll();
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    const completeTask = (taskId) => {
        if (!completedTasks.includes(taskId)) {
            setCompletedTasks(prev => [...prev, taskId]);
        }
    };

    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showDailyDropdown, setShowDailyDropdown] = useState(false);
    const [showCompareDropdown, setShowCompareDropdown] = useState(false);

    const [selectedDaily, setSelectedDaily] = useState("Diario");
    const [selectedCompare, setSelectedCompare] = useState("Período anterior");
    const [companyName, setCompanyName] = useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");
    const [selectedSetupOptions, setSelectedSetupOptions] = useState(["non_recurring"]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showMetricDropdown, setShowMetricDropdown] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState("Volumen neto");
    const [selectedDate] = useState(new Date(2026, 0, 18));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showCalendar && !event.target.closest('.calendar-dropdown')) {
                setShowCalendar(false);
            }
            if (showMetricDropdown && !event.target.closest('.metric-dropdown')) {
                setShowMetricDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showCalendar, showMetricDropdown]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        const saved = window.localStorage.getItem("antillapay_customize");
        if (!saved) {
            return;
        }
        try {
            const parsed = JSON.parse(saved);
            setCompanyName(parsed.companyName ?? "");
            setCompanyWebsite(parsed.companyWebsite ?? "");
            setSelectedSetupOptions(parsed.selectedSetupOptions ?? []);
            setCustomizeStep(parsed.customizeStep ?? "form");
        } catch {
            // Ignore malformed storage for demo.
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        const payload = {
            companyName,
            companyWebsite,
            selectedSetupOptions,
            customizeStep
        };
        window.localStorage.setItem("antillapay_customize", JSON.stringify(payload));
    }, [companyName, companyWebsite, selectedSetupOptions, customizeStep]);

    const metrics = [
        { id: "Volumen bruto", label: "Volumen bruto", isMonetary: true },
        { id: "Clientes nuevos", label: "Clientes nuevos", isMonetary: false },
        { id: "Pagos satisfactorios", label: "Pagos satisfactorios", isMonetary: false },
        { id: "Volumen neto", label: "Volumen neto", isMonetary: true },
    ];

    const {
        balanceSeries,
        totals,
        yesterdayTotals,
        chartTimeLabel
    } = useMemo(() => {
        const todayPayments = generateMockPayments(selectedDate, 0);
        const yesterday = new Date(selectedDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayPayments = generateMockPayments(yesterday, 5);
        const todaySucceeded = todayPayments.filter((payment) => payment.status === "succeeded");
        const yesterdaySucceeded = yesterdayPayments.filter((payment) => payment.status === "succeeded");
        const todaySeries = buildHourlySeries(todaySucceeded, selectedDate);
        const yesterdaySeries = buildHourlySeries(yesterdaySucceeded, yesterday);
        const lastPoint = todaySeries.series[todaySeries.series.length - 1];

        return {
            balanceSeries: todaySeries.series,
            totals: todaySeries.totals,
            yesterdayTotals: yesterdaySeries.totals,
            chartTimeLabel: lastPoint?.time
        };
    }, [selectedDate]);

    const currentMetric = metrics.find(m => m.id === selectedMetric) || metrics[0];
    const metricTotals = {
        "Volumen bruto": totals.gross,
        "Clientes nuevos": totals.customers,
        "Pagos satisfactorios": totals.payments,
        "Volumen neto": totals.net
    };
    const yesterdayMetricTotals = {
        "Volumen bruto": yesterdayTotals.gross,
        "Clientes nuevos": yesterdayTotals.customers,
        "Pagos satisfactorios": yesterdayTotals.payments,
        "Volumen neto": yesterdayTotals.net
    };
    const selectedMetricValue = metricTotals[selectedMetric] ?? 0;
    const selectedYesterdayValue = yesterdayMetricTotals[selectedMetric] ?? 0;
    const metricValue = currentMetric.isMonetary ? formatUsd(selectedMetricValue) : formatCount(selectedMetricValue);
    const yesterdayMetricValue = currentMetric.isMonetary ? formatUsd(selectedYesterdayValue) : formatCount(selectedYesterdayValue);
    const currentTimeLabel = chartTimeLabel || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    const hasFormInfo = companyName.trim().length > 0;
    const hasOptions = selectedSetupOptions.length > 0;
    const canProceedToTest = hasFormInfo && hasOptions;
    const setupOptions = [
        {
            id: "non_recurring",
            title: "Pagos no recurrentes",
            description: "Acepta pagos por productos o servicios a través de facturas o una página de proceso de compra."
        },
        {
            id: "recurring",
            title: "Pagos recurrentes",
            description: "Ofrece suscripciones y factura a los clientes por los servicios y el uso continuo."
        }
    ];

    const toggleSetupOption = (optionId) => {
        setSelectedSetupOptions((prev) => (
            prev.includes(optionId)
                ? prev.filter((id) => id !== optionId)
                : [...prev, optionId]
        ));
    };

    const handleCustomizeNext = () => {
        if (customizeStep === "form") {
            setCustomizeStep("test_environment");
        }
    };

    const handleQuickAction = (label) => {
        window.alert(`Accion no implementada: ${label}`);
    };

    const handleAddProduct = () => handleQuickAction("Agregar producto");
    const handleCreatePaymentLink = () => navigate("/dashboard/payment-links/create");
    const handleHelp = () => handleQuickAction("Ayuda");
    const handleSettings = () => navigate("/dashboard/settings");
    const handleGuide = () => setShowOnboarding(true);
    const handleRequestLive = () => {
        setCustomizeStep("form");
        setShowCustomizeModal(true);
    };
    const currentUser = {
        name: "Clara Alvarez",
        email: "clara@antillapay.com"
    };
    const isTestMode = environment === "test";
    return (
        <div className={cn(
            "flex h-screen w-full overflow-hidden font-sans relative flex-col",
            activeView === "payments_links" || activeView === "product_catalog" || activeView === "product_detail" || activeView === "customers" || activeView === "customer_detail" || activeView === "saldos"
                ? "bg-white"
                : "bg-[#f6f9fc]"
        )}>
            <AnimatePresence>
                {showVerifyEmailModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowVerifyEmailModal(false)}
                            className="fixed inset-0 bg-[#0f172a]/25 backdrop-blur-[1px] z-[120]"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.98 }}
                            className="fixed inset-0 z-[121] flex items-center justify-center px-6"
                        >
                            <div className="w-[520px] max-w-[92vw] rounded-2xl bg-white p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.4)]">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-[22px] font-semibold text-[#32325d]">Verifica tu correo electrónico</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowVerifyEmailModal(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                        aria-label="Cerrar verificación de correo"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                                    Comprueba si recibiste un enlace en{" "}
                                    <span className="font-semibold text-[#32325d]">claalvarezdev@gmail.com</span>{" "}
                                    para verificar tu dirección de correo electrónico.
                                </p>
                                <div className="mt-6 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        className="rounded-md border border-gray-200 px-4 py-2 text-[13px] font-semibold text-[#32325d] hover:bg-gray-50 transition-colors"
                                    >
                                        Reenviar correo electrónico
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            completeTask("verify_email");
                                            setShowVerifyEmailModal(false);
                                        }}
                                        className="rounded-md bg-[#635bff] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#5851e0] transition-colors"
                                    >
                                        Abrir Gmail
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showCustomizeModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCustomizeModal(false)}
                            className="fixed inset-0 bg-[#0f172a]/25 backdrop-blur-[1px] z-[122]"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.98 }}
                            className="fixed inset-0 z-[123] flex items-center justify-center px-6"
                        >
                            <div className="w-[980px] max-w-[96vw] h-[640px] max-h-[90vh] rounded-3xl bg-white shadow-[0_24px_70px_-24px_rgba(15,23,42,0.35)] overflow-hidden relative">
                                <button
                                    onClick={() => {
                                        setShowCustomizeModal(false);
                                        setShowOnboardingBanner(false);
                                    }}
                                    className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="grid h-full grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
                                    <div className="px-12 pt-8 pb-14 h-full">
                                        {customizeStep === "form" ? (
                                            <div className="flex h-full flex-col justify-between gap-10">
                                                <div className="space-y-8 pt-4">
                                                    <div>
                                                        <h3 className="text-[26px] font-semibold text-[#32325d]">
                                                            Te damos la bienvenida a AntillaPay
                                                        </h3>
                                                        <p className="mt-3 text-[14px] text-[#4f5b76] leading-relaxed">
                                                            Responde algunas preguntas sobre tu empresa para personalizar tu configuración.
                                                            Puedes modificar esta información más adelante.
                                                        </p>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
                                                                Nombre de la empresa
                                                            </label>
                                                            <div className="rounded-lg border border-[#9ac6ff] shadow-[0_0_0_3px_rgba(99,91,255,0.15)] bg-white px-3 py-2.5">
                                                                <input
                                                                    type="text"
                                                                    value={companyName}
                                                                    onChange={(event) => setCompanyName(event.target.value)}
                                                                    className="w-full text-[13px] text-[#32325d] outline-none bg-transparent"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-[13px] font-semibold text-[#32325d] mb-1">
                                                                Sitio web de la empresa <span className="text-[#8792a2] font-normal">(opcional)</span>
                                                            </label>
                                                            <p className="text-[12px] text-[#8792a2] mb-2">
                                                                Tu sitio web nos ayuda a hacerte recomendaciones de configuración.
                                                            </p>
                                                            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5">
                                                                <input
                                                                    type="text"
                                                                    value={companyWebsite}
                                                                    onChange={(event) => setCompanyWebsite(event.target.value)}
                                                                    className="w-full text-[13px] text-[#32325d] outline-none bg-transparent"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 flex items-center justify-between">
                                                    <button
                                                        type="button"
                                                        onClick={handleCustomizeNext}
                                                        className="text-[13px] font-semibold text-[#635bff] hover:underline"
                                                    >
                                                        Omítelo por el momento
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCustomizeNext}
                                                        className={cn(
                                                            "rounded-md px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors",
                                                            companyName.trim() ? "bg-[#635bff] hover:bg-[#5851e0]" : "bg-[#b4abff] cursor-not-allowed"
                                                        )}
                                                    >
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex h-full flex-col justify-between">
                                                <div className="space-y-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCustomizeStep("options")}
                                                        className="text-[14px] font-semibold text-[#635bff] hover:underline flex items-center gap-1"
                                                    >
                                                        ← Atrás
                                                    </button>
                                                    <div className="space-y-2">
                                                        <h3 className="text-[32px] font-bold text-[#32325d] leading-tight">
                                                            Empieces a usar tu entorno de prueba
                                                        </h3>
                                                        <p className="text-[15px] text-[#4f5b76] leading-relaxed">
                                                            Tu entorno de pruebas es un entorno seguro para las pruebas. Puedes probar las funciones sin ningún movimiento de dinero real.
                                                        </p>
                                                    </div>

                                                    <div className="space-y-4 pt-0 relative">
                                                        {/* Step tracker line */}
                                                        <div className="absolute left-[13px] top-[24px] bottom-[24px] w-0.5 bg-gray-100" />

                                                        <div className="flex gap-4 relative">
                                                            <div className="w-[28px] h-[28px] rounded-full bg-[#635bff] text-white flex items-center justify-center text-[13px] font-bold shrink-0 z-10">1</div>
                                                            <div className="space-y-0.5">
                                                                <h4 className="text-[15px] font-bold text-[#32325d]">Completa tu configuración</h4>
                                                                <p className="text-[14px] text-[#697386] leading-relaxed">
                                                                    Sigue los pasos en tu guía de configuración para explorar las funciones que se adaptan a las necesidades de tu negocio.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-4 relative">
                                                            <div className="w-[28px] h-[28px] rounded-full bg-[#635bff] text-white flex items-center justify-center text-[13px] font-bold shrink-0 z-10">2</div>
                                                            <div className="space-y-0.5">
                                                                <h4 className="text-[15px] font-bold text-[#32325d]">Cambiar a la cuenta activa</h4>
                                                                <p className="text-[14px] text-[#697386] leading-relaxed">
                                                                    Cuando estés listo para pasar a modo activo, responde algunas preguntas para verificar tu negocio.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-4 relative">
                                                            <div className="w-[28px] h-[28px] rounded-full bg-[#635bff] text-white flex items-center justify-center text-[13px] font-bold shrink-0 z-10">3</div>
                                                            <div className="space-y-0.5">
                                                                <h4 className="text-[15px] font-bold text-[#32325d]">Ya estás listo para empezar</h4>
                                                                <p className="text-[14px] text-[#697386] leading-relaxed">
                                                                    Copia tu trabajo a tu cuenta activa y comienza a vender.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            completeTask("customize_account");
                                                            setShowCustomizeModal(false);
                                                        }}
                                                        className="w-full rounded-lg bg-[#635bff] py-3 text-[15px] font-bold text-white shadow-lg shadow-[#635bff]/20 hover:bg-[#5851e0] transition-all"
                                                    >
                                                        Ir al entorno de prueba
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigate('/activate-account');
                                                        }}
                                                        className="w-full text-center text-[15px] font-bold text-[#635bff] hover:underline"
                                                    >
                                                        Ir a mi cuenta activa ahora
                                                    </button>
                                                    <div className="mt-2 py-1.5 px-4 bg-[#f5f3ff] text-[#635bff] text-[12px] font-bold rounded-full text-center w-fit mx-auto border border-[#e0d7ff] uppercase tracking-wider">
                                                        ¡Ya puedes empezar!
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className="relative h-full overflow-hidden p-12 flex items-center justify-center lg:border-l lg:border-gray-100"
                                    >
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: `linear-gradient(135deg,
                                                  #fdf4ff 0%,
                                                  #fae8ff 10%,
                                                  #e0e7ff 25%,
                                                  #dbeafe 40%,
                                                  #cffafe 55%,
                                                  #d1fae5 70%,
                                                  #fef3c7 85%,
                                                  #ffedd5 100%
                                                )`
                                            }}
                                        />
                                        <div
                                            className="absolute top-0 right-0 h-[70%] w-[70%]"
                                            style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(167, 139, 250, 0.28) 0%, transparent 55%)' }}
                                        />
                                        <div
                                            className="absolute bottom-0 left-0 h-[65%] w-[65%]"
                                            style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(251, 191, 36, 0.2) 0%, transparent 55%)' }}
                                        />

                                        <div className="relative z-10 w-[360px] rounded-[30px] border border-white/70 bg-white/55 shadow-[0_20px_55px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm overflow-hidden">
                                            {customizeStep === "test_environment" ? (
                                                <div className="flex flex-col h-full bg-[#f8fafc]">
                                                    <div className="bg-[#1e293b] p-4">
                                                        <span className="text-[14px] font-bold text-white">Entorno de prueba</span>
                                                    </div>
                                                    <div className="p-6 space-y-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-xl bg-[#e2e8f0] flex items-center justify-center">
                                                                <Home className="w-6 h-6 text-gray-400" />
                                                            </div>
                                                            <span className="text-[16px] font-bold text-[#32325d]">{companyName || "Nueva empresa"}</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="h-3 w-2/3 rounded-full bg-gray-100" />
                                                            <div className="h-3 w-1/2 rounded-full bg-gray-100" />
                                                            <div className="h-3 w-3/4 rounded-full bg-gray-100" />
                                                        </div>
                                                        <div className="pt-4 border-t border-gray-100">
                                                            <div className="h-4 w-24 rounded-full bg-gray-200 mb-4" />
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-3 w-3 rounded-full bg-gray-200" />
                                                                <div className="h-3 w-32 rounded-full bg-gray-100" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-7">
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="h-12 w-12 rounded-2xl bg-white/70" />
                                                        <span className="text-[22px] font-semibold text-[#cbd5e1]">{companyName || "Nueva empresa"}</span>
                                                    </div>
                                                    <div className="relative h-[250px] rounded-3xl border border-white/70 bg-white/60 overflow-hidden">
                                                        <div
                                                            className="absolute inset-8 rounded-2xl border border-white/70 bg-white/50"
                                                            style={{ transform: "skewY(-6deg)" }}
                                                        />
                                                    </div>
                                                    <div className="mt-6 flex items-center justify-between">
                                                        <div className="h-4 w-24 rounded bg-white/70" />
                                                        <span className="text-[12px] font-semibold text-white/70">antillapay</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showOnboardingBanner && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        className="fixed inset-x-0 bottom-0 h-auto min-h-[280px] md:h-[320px] bg-gradient-to-br from-[#f2edff] via-[#d8c3ff] to-[#bfe8ff] z-[101] pointer-events-none"
                    >
                        <div className="h-full max-w-6xl mx-auto px-6 md:px-10 pb-10 flex items-end">
                            <div className="max-w-[420px]">
                                <h2 className="text-[28px] leading-tight font-semibold text-[#32325d]">
                                    A continuación, verifica tu empresa
                                </h2>
                                <p className="mt-3 text-[14px] text-[#4f5b76] leading-relaxed">
                                    Una vez completado el perfil de tu empresa, podrás empezar a aceptar pagos.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setShowOnboardingBanner(false)}
                                    className="pointer-events-auto mt-4 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-[#32325d] shadow-sm hover:bg-gray-50"
                                >
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <EnvironmentBanner
                environment={environment}
                onRequestLive={handleRequestLive}
            />
            <div className="flex flex-1 min-h-0 relative">
                {/* Mobile Sidebar Backdrop */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={cn(
                        "fixed inset-y-0 left-0 w-[280px] bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="p-4 mb-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full flex items-center gap-3 px-2 py-1.5 hover:bg-gray-50 rounded-lg transition-colors group">
                                    <div className="w-8 h-8 rounded bg-[#f1f3f5] flex items-center justify-center text-sm font-bold text-[#4f5b76]">
                                        N
                                    </div>
                                    <div className="flex-1 text-sm font-bold text-[#32325d] text-left">
                                        Naranjito
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-[#aab2c4]" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[300px] p-2 bg-white shadow-2xl rounded-xl border border-gray-100">
                                <div className="flex flex-col items-center px-4 pt-6 pb-4">
                                    <div className="h-12 w-12 bg-[#f8fafc] rounded-lg flex items-center justify-center text-[15px] font-bold text-[#8898aa] mb-3">
                                        ED
                                    </div>
                                    <span className="text-[14px] text-[#8898aa] mt-1">New business</span>
                                </div>

                                <div className="px-2 pb-4 pt-1">
                                    <button
                                        onClick={() => setIsExitModalOpen(true)}
                                        className="w-full border border-gray-200 rounded-lg bg-white text-[13px] font-medium text-[#8898aa] py-1.5 hover:bg-gray-50 hover:border-gray-300 transition-all"
                                    >
                                        Salir del entorno de prueba
                                    </button>
                                </div>

                                <div className="px-1 space-y-0.5">
                                    <button
                                        onClick={handleSettings}
                                        className="w-full h-9 flex items-center gap-3 px-3 rounded-lg hover:bg-gray-50 text-[#32325d] transition-colors text-left group"
                                    >
                                        <Settings className="w-4 h-4 text-[#8898aa] group-hover:text-[#635bff] transition-colors" />
                                        <span className="text-[14px] font-medium">Configuración</span>
                                    </button>
                                </div>

                                <DropdownMenuSeparator className="my-2 bg-gray-100" />

                                <div className="px-1 pt-1 pb-1">
                                    <div className="w-full h-10 flex items-center gap-3 px-3 rounded-lg hover:bg-gray-50 text-[#32325d] transition-colors cursor-pointer group">
                                        <User className="w-4 h-4 text-[#8898aa] group-hover:text-[#635bff] transition-colors" />
                                        <span className="text-[14px] font-medium">{currentUser.name}</span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (typeof window !== "undefined") {
                                                window.sessionStorage.removeItem("antillapay_onboarding_shown");
                                            }
                                            navigate("/login");
                                        }}
                                        className="w-full h-10 flex items-center gap-3 px-3 rounded-lg hover:bg-gray-50 text-[#32325d] transition-colors text-left mt-0.5 group"
                                    >
                                        <LogOut className="w-4 h-4 text-[#8898aa] group-hover:text-red-500 transition-colors" />
                                        <span className="text-[14px] font-medium">Cerrar sesión</span>
                                    </button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                        <SidebarItem
                            icon={Home}
                            label="Inicio"
                            active={activeView === "home"}
                            onClick={() => navigate("/dashboard")}
                        />
                        <SidebarItem
                            icon={DollarSign}
                            label="Saldos"
                            active={activeView === "saldos"}
                            onClick={() => {
                                setActiveView("saldos");
                                navigate("/dashboard/balances");
                            }}
                        />
                        <SidebarItem
                            icon={ArrowLeftRight}
                            label="Cobros"
                            active={activeView === "transactions"}
                            onClick={() => {
                                setActiveView("transactions");
                                navigate("/dashboard/transactions");
                            }}
                        />
                        <SidebarItem
                            icon={Users}
                            label="Clientes"
                            active={activeView === "customers" || activeView === "customer_detail"}
                            onClick={() => navigate("/customers")}
                        />
                        <SidebarItem
                            icon={Package}
                            label="Catálogo de productos"
                            active={activeView === "product_catalog"}
                            onClick={() => navigate("/dashboard/product-catalog")}
                        />

                        <div className="pt-6 pb-2 px-3 text-[12px] font-bold text-[#8792a2] uppercase tracking-wider">
                            Productos
                        </div>

                        <SidebarItem
                            icon={Link2}
                            label="Payment Links"
                            active={activeView === "payments_links"}
                            onClick={() => navigate("/dashboard/payment-links")}
                        />
                        <SidebarItem
                            icon={ArrowLeftRight}
                            label="Transferencia"
                            active={activeView === "transfers"}
                            onClick={() => {
                                setActiveView("transfers");
                                navigate("/dashboard/transfers");
                            }}
                        />
                    </nav>

                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <SidebarItem
                            icon={LayoutDashboard}
                            label="Desarrolladores"
                            hasSubmenu={true}
                            active={activeView && activeView.startsWith("dev_")}
                            subItems={["Resumen", "Webhooks", "Eventos", "Registros", "Documentación", "Claves de API"]}
                            activeSubItem={
                                activeView === "dev_resumen" ? "Resumen" :
                                    activeView === "dev_webhooks" ? "Webhooks" :
                                        activeView === "dev_eventos" ? "Eventos" :
                                            activeView === "dev_registros" ? "Registros" :
                                                activeView === "dev_docs" ? "Documentación" :
                                                    activeView === "dev_keys" ? "Claves de API" : ""
                            }
                            onSubItemClick={(item) => {
                                if (item === "Resumen") { setActiveView("dev_resumen"); navigate("/dashboard/developers/overview"); }
                                if (item === "Webhooks") { setActiveView("dev_webhooks"); navigate("/dashboard/developers/webhooks"); }
                                if (item === "Eventos") { setActiveView("dev_eventos"); navigate("/dashboard/developers/events"); }
                                if (item === "Registros") { setActiveView("dev_registros"); navigate("/dashboard/developers/logs"); }
                                if (item === "Documentación") { setActiveView("dev_docs"); navigate("/dashboard/developers/docs"); }
                                if (item === "Claves de API") { setActiveView("dev_keys"); navigate("/dashboard/developers/keys"); }
                            }}
                        />
                    </div>
                </aside>
                {/* Main Content */}
                <main className="flex-1 flex flex-col relative overflow-hidden min-h-0">
                    <DashboardHeader
                        isElevated={isHeaderElevated}
                        onLogoClick={() => navigate("/dashboard")}
                        onAddProduct={handleAddProduct}
                        onCreatePaymentLink={handleCreatePaymentLink}
                        onHelp={handleHelp}
                        onSettings={handleSettings}
                        onGuide={handleGuide}
                        showGuideButton={!showOnboarding && !showOnboardingBanner}
                        guideProgress={progressPercent}
                        onMenuClick={() => setIsSidebarOpen(true)}
                    />

                    {/* Content Area */}
                    <div
                        ref={contentRef}
                        className={cn(
                            "flex-1 overflow-y-auto",
                            activeView === "payments_links" ||
                                activeView === "product_catalog" ||
                                activeView === "product_detail" ||
                                activeView === "customers" ||
                                activeView === "customer_detail" ||
                                activeView === "saldos" ||
                                activeView === "transactions" ||
                                activeView === "transfers" ||
                                activeView === "settings"
                                ? "p-4 md:p-8 bg-white"
                                : "p-4 md:p-10"
                        )}
                    >
                        <div
                            className={cn(
                                activeView === "payments_links" ||
                                    activeView === "product_catalog" ||
                                    activeView === "product_detail" ||
                                    activeView === "customers" ||
                                    activeView === "customer_detail" ||
                                    activeView === "saldos" ||
                                    activeView === "transactions" ||
                                    activeView === "transfers" ||
                                    activeView === "settings"
                                    ? "w-full"
                                    : "max-w-6xl mx-auto"
                            )}
                        >
                            <AnimatePresence mode="wait">
                                {activeView === "settings" ? (
                                    <motion.div
                                        key="settings-view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {(() => {
                                            const path = location.pathname.toLowerCase();
                                            if (path === "/dashboard/settings" || path === "/dashboard/settings/") return <SettingsPage />;
                                            if (path.startsWith("/dashboard/settings/personal-data")) return <PersonalData />;
                                            if (path.startsWith("/dashboard/settings/communication")) return <Communication />;
                                            if (path.startsWith("/dashboard/settings/business")) return <Business />;
                                            if (path.startsWith("/dashboard/settings/team-security")) return <TeamSecurity />;
                                            if (path.startsWith("/dashboard/settings/compliance")) return <Compliance />;
                                            if (path.startsWith("/dashboard/settings/billing")) return <BillingSettings />;
                                            if (path.startsWith("/dashboard/settings/payments")) return <PaymentsSettings />;
                                            if (path.startsWith("/dashboard/settings/financial-connections")) return <FinancialConnectionsSettings />;
                                            if (path.startsWith("/dashboard/settings/radar")) return <RadarSettings />;
                                            return <SettingsPage />;
                                        })()}
                                    </motion.div>
                                ) : activeView === "home" ? (
                                    <motion.div
                                        key="home-view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="mb-4">
                                            <p className="text-[13px] text-[#697386]">
                                                Los entornos de prueba son el nuevo método recomendado para hacer pruebas <span className="text-[#635bff] cursor-pointer hover:underline">Pruébalos</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h1 className="text-[22px] font-bold text-[#32325d]">Hoy</h1>
                                        </div>
                                        <div className="w-full h-[1px] bg-gray-100 mb-8" />

                                        {/* Main Layout - Matching Image Exactly */}
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            {/* Left Side - Chart and Stats */}
                                            <div className="flex-1">
                                                {/* Top Stats Row */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10 mb-6">
                                                    <div className="metric-dropdown relative">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <button
                                                                onClick={() => setShowMetricDropdown(!showMetricDropdown)}
                                                                className="flex items-center gap-1.5 text-[13px] text-[#697386] hover:text-[#32325d] transition-colors group"
                                                            >
                                                                <span>{selectedMetric}</span>
                                                                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", showMetricDropdown && "rotate-180")} />
                                                            </button>
                                                        </div>
                                                        <div className="text-[24px] font-semibold text-[#32325d]">
                                                            {metricValue}
                                                        </div>
                                                        <div className="text-[11px] text-[#aab2c4] mt-0.5">{currentTimeLabel}</div>

                                                        {/* Metric Selection Dropdown */}
                                                        <AnimatePresence>
                                                            {showMetricDropdown && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    className="absolute top-full left-0 mt-2 w-[240px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 overflow-hidden"
                                                                >
                                                                    {metrics.map((metric) => (
                                                                        <button
                                                                            key={metric.id}
                                                                            onClick={() => {
                                                                                setSelectedMetric(metric.id);
                                                                                setShowMetricDropdown(false);
                                                                            }}
                                                                            className={cn(
                                                                                "w-full px-4 py-2.5 text-left text-[15px] transition-colors flex items-center justify-between group",
                                                                                selectedMetric === metric.id ? "text-[#635bff]" : "text-[#32325d] hover:bg-gray-50"
                                                                            )}
                                                                        >
                                                                            <span>{metric.label}</span>
                                                                            {selectedMetric === metric.id && <Check className="w-4 h-4 text-[#635bff]" />}
                                                                        </button>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    <div className="calendar-dropdown relative">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <button
                                                                onClick={() => setShowCalendar(!showCalendar)}
                                                                className="flex items-center gap-1.5 text-[13px] text-[#697386] hover:text-[#32325d] transition-colors group"
                                                            >
                                                                <span>Ayer</span>
                                                                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", showCalendar && "rotate-180")} />
                                                            </button>
                                                        </div>
                                                        <div className="text-[24px] font-semibold text-[#32325d]">{yesterdayMetricValue}</div>

                                                        {/* Calendar Dropdown - Exactly as in screenshot */}
                                                        <AnimatePresence>
                                                            {showCalendar && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    className="absolute top-full left-0 mt-3 bg-white rounded-2xl shadow-[0_18px_40px_-12px_rgba(0,0,0,0.15)] border border-gray-100 p-5 z-50 min-w-[320px]"
                                                                >
                                                                    {/* Date Input Box */}
                                                                    <div className="mb-5 p-1 bg-[#635bff15] border-2 border-[#635bff30] rounded-xl">
                                                                        <div className="bg-white rounded-[10px] px-4 py-3 flex items-center justify-center">
                                                                            <div className="flex items-center gap-2 text-[15px] font-medium text-[#32325d]">
                                                                                <span className="bg-[#635bff15] px-2 py-0.5 rounded-md text-[#32325d]">18</span>
                                                                                <span className="text-[#aab2c4] font-light">/</span>
                                                                                <span>01</span>
                                                                                <span className="text-[#aab2c4] font-light">/</span>
                                                                                <span>2026</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Month Selector */}
                                                                    <div className="flex items-center justify-between mb-4 px-1">
                                                                        <button className="flex items-center gap-1.5 text-[16px] text-[#32325d] font-semibold hover:text-[#635bff] transition-colors">
                                                                            <span>enero de 2026</span>
                                                                            <ChevronDown className="w-4 h-4 opacity-40" />
                                                                        </button>
                                                                        <div className="flex items-center gap-3">
                                                                            <button className="text-[#aab2c4] hover:text-[#32325d] transition-colors">
                                                                                <ChevronLeft className="w-5 h-5" />
                                                                            </button>
                                                                            <button className="text-[#aab2c4] hover:text-[#32325d] transition-colors">
                                                                                <ChevronRight className="w-5 h-5" />
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {/* Calendar Grid */}
                                                                    <div className="grid grid-cols-7 gap-y-1 text-[13px]">
                                                                        {/* Day labels */}
                                                                        {['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'].map((day) => (
                                                                            <div key={day} className="text-center text-[#8792a2] font-semibold py-2 text-[11px] tracking-wide">
                                                                                {day}
                                                                            </div>
                                                                        ))}

                                                                        {/* Padding days */}
                                                                        {[...Array(3)].map((_, i) => <div key={`empty-${i}`} />)}

                                                                        {/* Calendar days */}
                                                                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                                                            <div key={day} className="flex items-center justify-center py-1.5">
                                                                                <button
                                                                                    className={cn(
                                                                                        "w-9 h-9 flex items-center justify-center rounded-full transition-all text-[13px] font-medium",
                                                                                        day === 18
                                                                                            ? "bg-[#635bff] text-white shadow-lg shadow-[#635bff40]"
                                                                                            : "text-[#32325d] hover:bg-gray-50",
                                                                                        day > 19 && "text-[#aab2c4]"
                                                                                    )}
                                                                                >
                                                                                    {day}
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>

                                                {/* Chart Area */}
                                                <BalanceChart data={balanceSeries} timeLabel={chartTimeLabel} />

                                                {/* Bottom Stats Row */}
                                                <div className="border-t border-gray-100 pt-6">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-16">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="text-[13px] text-[#32325d] mb-1">Saldo en USD</div>
                                                                <div className="text-[20px] font-normal text-[#32325d]">{formatUsd(totals.balance)}</div>
                                                            </div>
                                                            <button
                                                                onClick={() => navigate("/dashboard/balances")}
                                                                className="text-[12px] text-[#635bff] font-semibold hover:underline"
                                                            >
                                                                Ver datos
                                                            </button>
                                                        </div>
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="text-[13px] text-[#32325d] mb-1">Transferencias</div>
                                                                <div className="text-[20px] font-normal text-[#32325d]">—</div>
                                                            </div>
                                                            <button
                                                                onClick={() => navigate("/dashboard/transactions")}
                                                                className="text-[12px] text-[#635bff] font-semibold hover:underline"
                                                            >
                                                                Ver datos
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side - Recommendations and API Keys */}
                                            <div className="w-full lg:w-[340px] space-y-6">
                                                {/* Recommendations Card */}
                                                <div className="bg-[#f7f9fc] rounded-lg p-5 border border-gray-100">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="text-[14px] font-semibold text-[#32325d]">Recomendaciones</h3>
                                                        <button className="text-gray-400 hover:text-gray-600">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-[13px] text-[#4f5b76] leading-relaxed mb-3">
                                                        Utiliza Checkout para integrar un <span className="text-[#635bff] font-medium cursor-pointer hover:underline">formulario de pago</span> en tu sitio web o redirige a tus clientes a una página alojada en AntillaPay.
                                                    </p>
                                                    <p className="text-[13px] text-[#4f5b76] leading-relaxed">
                                                        <span className="text-[#635bff] font-medium cursor-pointer hover:underline">Crea y envía facturas</span> que los clientes puedan pagar al instante.
                                                    </p>

                                                    <div className="space-y-4 pt-4 border-t border-gray-200/60">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-[14px] font-bold text-[#32325d]">Claves de API</h4>
                                                            <span className="text-[12px] text-[#635bff] font-semibold cursor-pointer hover:underline">Consulta la documentación</span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <CopyableKey label="Clave publicable" value="pk_test_51SrAY7P7M..." />
                                                            <CopyableKey label="Clave secreta" value="sk_test_51SrAY7P7M..." />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tu resumen section */}
                                        <div className="mt-20">
                                            <h2 className="text-[22px] font-bold text-[#32325d] mb-6">Resumen de Movimientos</h2>

                                            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                                                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                                    {/* Intervalo de fechas */}
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => {
                                                                setShowDateDropdown(!showDateDropdown);
                                                                setShowDailyDropdown(false);
                                                                setShowCompareDropdown(false);
                                                            }}
                                                            className="flex items-center bg-white border border-gray-200 rounded-full text-[13px] overflow-hidden hover:border-gray-300 transition-colors shadow-sm"
                                                        >
                                                            <span className="px-3 py-1.5 text-[#697386]">Intervalo de fechas</span>
                                                            <div className="w-[1px] h-4 bg-gray-200" />
                                                            <span className="px-3 py-1.5 text-[#635bff] font-semibold flex items-center gap-1.5">
                                                                Últimos 7 días <ChevronDown className="w-3.5 h-3.5" />
                                                            </span>
                                                        </button>

                                                        <AnimatePresence>
                                                            {showDateDropdown && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 p-4 md:p-6 z-[120] w-[calc(100vw-32px)] max-w-[700px] md:w-[700px]"
                                                                >
                                                                    <div className="flex gap-8">
                                                                        {/* Left Sidebar */}
                                                                        <div className="w-32 flex flex-col gap-4">
                                                                            <button className="text-left text-[14px] text-[#32325d] hover:text-[#635bff]">Hoy</button>
                                                                            <button className="text-left text-[14px] text-[#32325d] hover:text-[#635bff]">Siempre</button>
                                                                        </div>

                                                                        {/* Center content */}
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-4 mb-8">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[14px] text-[#697386]">Inicio</span>
                                                                                    <div className="px-3 py-1.5 border-2 border-[#635bff]/30 bg-[#635bff]/5 rounded-lg text-[14px] text-[#32325d]">13 / 01 / 2026</div>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[14px] text-[#697386]">Final</span>
                                                                                    <div className="px-3 py-1.5 border border-gray-200 rounded-lg text-[14px] text-[#32325d]">19 / 01 / 2026</div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex gap-12">
                                                                                {/* Dec 2025 */}
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center justify-between mb-4">
                                                                                        <ChevronLeft className="w-4 h-4 text-gray-400 cursor-pointer" />
                                                                                        <span className="text-[14px] font-semibold text-[#32325d]">diciembre de 2025 <ChevronDown className="w-3 h-3 inline ml-1" /></span>
                                                                                        <div className="w-4" />
                                                                                    </div>
                                                                                    <div className="grid grid-cols-7 gap-y-2 text-center text-[12px]">
                                                                                        {['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'].map(d => <div key={d} className="text-[#aab2c4] font-medium">{d}</div>)}
                                                                                        {Array.from({ length: 31 }).map((_, i) => (
                                                                                            <div key={i} className="py-1 text-[#32325d] hover:bg-gray-50 rounded cursor-pointer">{i + 1}</div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                                {/* Jan 2026 */}
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center justify-between mb-4">
                                                                                        <div className="w-4" />
                                                                                        <span className="text-[14px] font-semibold text-[#32325d]">enero de 2026 <ChevronDown className="w-3 h-3 inline ml-1" /></span>
                                                                                        <ChevronRight className="w-4 h-4 text-gray-400 cursor-pointer" />
                                                                                    </div>
                                                                                    <div className="grid grid-cols-7 gap-y-2 text-center text-[12px]">
                                                                                        {['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'].map(d => <div key={d} className="text-[#aab2c4] font-medium">{d}</div>)}
                                                                                        {Array.from({ length: 31 }).map((_, i) => (
                                                                                            <div key={i} className={cn(
                                                                                                "py-1 rounded cursor-pointer transition-colors",
                                                                                                (i + 1 >= 13 && i + 1 <= 19) ? "bg-[#635bff]/10 text-[#635bff]" : "text-[#32325d] hover:bg-gray-50",
                                                                                                (i + 1 === 13 || i + 1 === 19) && "bg-[#635bff] text-white"
                                                                                            )}>{i + 1}</div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex justify-end gap-2 mt-8">
                                                                                <button onClick={() => setShowDateDropdown(false)} className="px-4 py-1.5 border border-gray-200 rounded-lg text-[14px] text-[#32325d] font-semibold hover:bg-gray-50">Borra</button>
                                                                                <button onClick={() => setShowDateDropdown(false)} className="px-4 py-1.5 bg-[#635bff] text-white rounded-lg text-[14px] font-semibold hover:bg-[#5851e0]">Aplica</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    {/* Diario */}
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => {
                                                                setShowDailyDropdown(!showDailyDropdown);
                                                                setShowDateDropdown(false);
                                                                setShowCompareDropdown(false);
                                                            }}
                                                            className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[13px] text-[#635bff] font-semibold hover:border-gray-300 transition-colors gap-1.5 shadow-sm"
                                                        >
                                                            {selectedDaily} <ChevronDown className="w-3.5 h-3.5 text-[#635bff]" />
                                                        </button>

                                                        <AnimatePresence>
                                                            {showDailyDropdown && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[120] w-[180px]"
                                                                >
                                                                    {["Por hora", "Diario"].map((opt) => (
                                                                        <button
                                                                            key={opt}
                                                                            onClick={() => {
                                                                                setSelectedDaily(opt);
                                                                                setShowDailyDropdown(false);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-[14px] text-[#32325d] hover:bg-gray-50 flex items-center justify-between"
                                                                        >
                                                                            {opt}
                                                                            {selectedDaily === opt && <div className="w-4 h-4 bg-[#4a5568] rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                                                                        </button>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    <div className="relative">
                                                        <button
                                                            onClick={() => {
                                                                setShowCompareDropdown(!showCompareDropdown);
                                                                setShowDateDropdown(false);
                                                                setShowDailyDropdown(false);
                                                            }}
                                                            className="flex items-center bg-white border border-gray-200 rounded-full text-[13px] overflow-hidden hover:border-gray-300 transition-colors shadow-sm"
                                                        >
                                                            <div className="px-3 py-1.5 flex items-center gap-2 border-r border-gray-200 bg-gray-50/30">
                                                                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <X className="w-2.5 h-2.5 text-gray-500" />
                                                                </div>
                                                                <span className="text-[#697386] font-medium">Compara</span>
                                                            </div>
                                                            <span className="px-3 py-1.5 text-[#635bff] font-semibold flex items-center gap-1.5 hover:bg-gray-50">
                                                                {selectedCompare} <ChevronDown className="w-3.5 h-3.5" />
                                                            </span>
                                                        </button>

                                                        <AnimatePresence>
                                                            {showCompareDropdown && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[120] w-[220px]"
                                                                >
                                                                    {["Período anterior", "Semana anterior", "Mes anterior", "Año anterior", "Custom"].map((opt) => (
                                                                        <button
                                                                            key={opt}
                                                                            onClick={() => {
                                                                                setSelectedCompare(opt);
                                                                                setShowCompareDropdown(false);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-[14px] text-[#32325d] hover:bg-gray-50 flex items-center justify-between"
                                                                        >
                                                                            {opt}
                                                                            {selectedCompare === opt && <div className="w-4 h-4 bg-[#4a5568] rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                                                                        </button>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </div>

                                            <DashboardCardsSection referenceDate={selectedDate} />
                                        </div>
                                    </motion.div>
                                ) : activeView === "payments_links" ? (
                                    <motion.div
                                        key="payments_links_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <PaymentLinksView
                                            onCreateClick={() => navigate("/dashboard/payment-links/create")}
                                            paymentLinks={paymentLinks}
                                            onRenameLink={handleRenamePaymentLink}
                                            onToggleStatus={handleTogglePaymentLinkStatus}
                                            testMode={isTestMode}
                                        />
                                    </motion.div>
                                ) : activeView === "customers" ? (
                                    <motion.div
                                        key="customers-view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <CustomersPage />
                                    </motion.div>
                                ) : activeView === "product_catalog" ? (
                                    <motion.div
                                        key="product_catalog_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ProductCatalog />
                                    </motion.div>
                                ) : activeView === "product_detail" ? (
                                    <motion.div
                                        key="product_detail_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ProductDetail productId={selectedProductId} />
                                    </motion.div>
                                ) : activeView === "customer_detail" ? (
                                    <motion.div
                                        key="customer_detail_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <CustomerDetail customerId={selectedCustomerId} />
                                    </motion.div>
                                ) : activeView === "dev_resumen" ? (
                                    <motion.div
                                        key="dev_resumen_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <DevelopersOverview />
                                    </motion.div>
                                ) : activeView === "dev_webhooks" ? (
                                    <motion.div
                                        key="dev_webhooks_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <DevelopersWebhooks />
                                    </motion.div>
                                ) : activeView === "dev_eventos" ? (
                                    <motion.div
                                        key="dev_eventos_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <DevelopersEvents />
                                    </motion.div>
                                ) : activeView === "dev_registros" ? (
                                    <motion.div
                                        key="dev_registros_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <DevelopersLogs />
                                    </motion.div>
                                ) : activeView === "dev_docs" ? (
                                    <motion.div
                                        key="dev_docs_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <DevelopersDocs />
                                    </motion.div>
                                ) : activeView === "dev_keys" ? (
                                    <motion.div
                                        key="dev_keys_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <DevelopersApiKeys />
                                    </motion.div>
                                ) : activeView === "saldos" ? (
                                    <motion.div
                                        key="balances_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <BalancesPage onOpenReport={() => navigate("/dashboard/balance-report")} />
                                    </motion.div>
                                ) : activeView === "transactions" ? (
                                    <motion.div
                                        key="transactions_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <TransactionsPage />
                                    </motion.div>
                                ) : activeView === "transfers" ? (
                                    <motion.div
                                        key="transfers_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <TransfersPage />
                                    </motion.div>
                                ) : activeView === "balance_report" ? (
                                    <motion.div
                                        key="balance_report_view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <BalanceSummaryReport onBack={() => navigate("/dashboard/balances")} />
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showOnboarding && (
                            <motion.div
                                key="onboarding-card"
                                className={cn(
                                    "fixed bottom-6 right-6 w-[320px] bg-[#f7f9fc] rounded-xl shadow-2xl overflow-hidden transition-all duration-500 z-[102]",
                                    "ring-4 ring-[#635bff]/20",
                                    showOnboardingBanner && "pointer-events-none opacity-50"
                                )}
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                            >
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-[13px] font-bold text-[#32325d]">Guía de configuración</h3>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsGuideCollapsed(!isGuideCollapsed)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label={isGuideCollapsed ? "Expandir guía de configuración" : "Colapsar guía de configuración"}
                                        >
                                            <Maximize2 className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => setShowOnboarding(false)}><X className="w-3 h-3 text-gray-400 hover:text-gray-600" /></button>
                                    </div>
                                </div>
                                {isGuideCollapsed ? (
                                    <div className="px-4 py-4">
                                        <div className="w-full h-1 bg-gray-200 rounded-full mb-3 relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercent}%` }}
                                                className="absolute left-0 top-0 h-full bg-[#635bff] rounded-full"
                                            />
                                            <motion.div
                                                animate={{ left: `${progressPercent}%` }}
                                                className="absolute top-[-3px] w-2 h-2 bg-[#635bff] rounded-full border-2 border-white"
                                            />
                                        </div>
                                        <div className="text-[13px] text-[#4f5b76]">
                                            Siguiente:{" "}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!completedTasks.includes("customize_account")) {
                                                        setCustomizeStep("form");
                                                        setShowCustomizeModal(true);
                                                    } else if (!completedTasks.includes("verify_email")) {
                                                        setShowVerifyEmailModal(true);
                                                    }
                                                }}
                                                className="text-[#635bff] font-semibold hover:underline"
                                            >
                                                {!completedTasks.includes("customize_account")
                                                    ? "Personaliza tu configuración"
                                                    : !completedTasks.includes("verify_email")
                                                        ? "Verifica tu correo electrónico"
                                                        : "Completa tu perfil"}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="px-4 py-5">
                                        <div className="w-full h-1 bg-gray-200 rounded-full mb-5 relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercent}%` }}
                                                className="absolute left-0 top-0 h-full bg-[#635bff] rounded-full"
                                            />
                                            <motion.div
                                                animate={{ left: `${progressPercent}%` }}
                                                className="absolute top-[-3px] w-2 h-2 bg-[#635bff] rounded-full border-2 border-white"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCustomizeStep("form");
                                                    setShowCustomizeModal(true);
                                                }}
                                                className="w-full bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#cbd5f5] transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors border",
                                                        completedTasks.includes("customize_account") ? "bg-[#635bff] border-[#635bff]" : "bg-gray-50 border-gray-100"
                                                    )}>
                                                        {completedTasks.includes("customize_account") && <Check className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                    <span className="text-[13px] font-bold text-[#32325d]">
                                                        Personaliza tu configuración
                                                    </span>
                                                </div>
                                                <div className="w-5 h-5 rounded-full bg-[#635bff] text-white flex items-center justify-center">
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => navigate('/activate-account', { state: { targetStep: 1 } })}
                                                className="w-full bg-white/50 rounded-lg p-3 border border-transparent flex items-center justify-between group hover:border-[#cbd5f5] transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors border",
                                                        verificationState.currentStep > 5 ? "bg-[#635bff] border-[#635bff]" : "bg-gray-50 border-gray-100"
                                                    )}>
                                                        {verificationState.currentStep > 5 && <Check className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                    <span className={cn(
                                                        "text-[13px] font-semibold",
                                                        verificationState.currentStep > 5 ? "text-[#635bff]" : "text-[#32325d]"
                                                    )}>
                                                        Verifica tu empresa
                                                    </span>
                                                </div>
                                                {verificationState.currentStep <= 5 && (
                                                    <div className="px-2 py-0.5 bg-[#635bff]/10 rounded text-[11px] font-medium text-[#635bff]">
                                                        En curso
                                                    </div>
                                                )}
                                            </button>

                                            {/* Items principales fuera del expandible */}
                                            {mainVerificationItems.map((item) => {
                                                const isItemCompleted = verificationState.currentStep > item.id;
                                                const isAccessible = verificationState.currentStep >= item.id;

                                                return (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => {
                                                            if (isAccessible) {
                                                                navigate('/activate-account', { state: { targetStep: item.id } });
                                                            }
                                                        }}
                                                        disabled={!isAccessible}
                                                        className={cn(
                                                            "w-full bg-white/50 rounded-lg p-3 border border-transparent flex items-center justify-between group hover:border-[#cbd5f5] transition-colors",
                                                            !isAccessible && "opacity-40 cursor-not-allowed hover:border-transparent"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors border",
                                                                isItemCompleted ? "bg-[#635bff] border-[#635bff]" : "bg-gray-50 border-gray-100"
                                                            )}>
                                                                {isItemCompleted && <Check className="w-2.5 h-2.5 text-white" />}
                                                            </div>
                                                            <span className={cn(
                                                                "text-[13px] font-semibold",
                                                                isItemCompleted ? "text-[#635bff]" : isAccessible ? "text-[#32325d]" : "text-[#4f5b76]"
                                                            )}>
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>


                </main>
            </div>

            {/* Exit Test Mode Modal */}
            <Dialog open={isExitModalOpen} onOpenChange={setIsExitModalOpen}>
                <DialogContent className="w-[95%] sm:max-w-[580px] rounded-2xl p-5 sm:p-8">
                    <DialogHeader>
                        <DialogTitle className="text-[20px] sm:text-[32px] font-bold text-[#32325d] leading-tight mb-3 sm:mb-4">
                            Verifica tu empresa para salir del entorno de prueba
                        </DialogTitle>
                        <DialogDescription className="text-[13px] sm:text-[16px] text-[#4f5b76] leading-relaxed">
                            Debes verificar tu empresa para poder acceder a tu cuenta activa y comenzar a aceptar pagos reales.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 mt-5 sm:mt-6">
                        <button
                            onClick={() => setIsExitModalOpen(false)}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 sm:px-6 sm:py-3 text-[13px] sm:text-[15px] font-semibold text-[#32325d] hover:bg-gray-50 transition-colors"
                        >
                            Quedarse en el entorno de prueba
                        </button>
                        <button
                            onClick={() => {
                                navigate('/activate-account');
                                setIsExitModalOpen(false);
                            }}
                            className="flex-1 rounded-lg bg-[#635bff] px-3 py-2 sm:px-6 sm:py-3 text-[13px] sm:text-[15px] font-semibold text-white hover:bg-[#5851e0] transition-colors"
                        >
                            Verificar empresa
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Transfer Modal */}
            <TransferModal
                open={showTransferModal}
                onOpenChange={setShowTransferModal}
            />
        </div>
    );
}
