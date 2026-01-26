import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    CreditCard,
    ArrowLeftRight,
    Users,
    Package,
    Plus,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    LayoutDashboard,
    FileText,
    DollarSign,
    X,
    Maximize2,
    Check,
    Clipboard
} from 'lucide-react';
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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

const SidebarItem = ({ icon: Icon, label, active, hasSubmenu, subItems = [], onClick, onSubItemClick, activeSubItem }) => {
    const [isOpen, setIsOpen] = useState(active || hasSubmenu);

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
            <div className="flex items-center justify-between bg-white rounded px-2 py-1.5 border border-gray-200">
                <code className="text-[11px] font-mono text-[#32325d]">{value}</code>
                <button
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
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

const PaymentLinksView = ({ onCreateClick }) => {
    return (
        <div className="w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
                <h1 className="text-[28px] font-bold text-[#32325d]">Payment Links</h1>
                <Button
                    onClick={onCreateClick}
                    className="bg-[#635bff] hover:bg-[#5851e0] text-white font-semibold rounded-full px-4 py-2 flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    Crear enlace de pago
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[11px] font-semibold">
                        N
                    </span>
                </Button>
            </div>

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
        </div>
    );
};

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [environment] = useState("test");
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [isGuideCollapsed, setIsGuideCollapsed] = useState(false);
    const [isHeaderElevated, setIsHeaderElevated] = useState(false);
    const contentRef = useRef(null);
    const [completedTasks, setCompletedTasks] = useState(() => {
        if (typeof window === "undefined") return [];
        const saved = window.localStorage.getItem("antillapay_onboarding_tasks");
        return saved ? JSON.parse(saved) : [];
    });
    const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
    const [showCustomizeModal, setShowCustomizeModal] = useState(false);
    const [customizeStep, setCustomizeStep] = useState("form");
    const [activeView, setActiveView] = useState(() => {
        const path = location.pathname.toLowerCase();
        if (path.startsWith("/customers") || path.startsWith("/dashboard/customers")) {
            return "customers";
        }
        if (path.startsWith("/dashboard/payment-links")) {
            return "payments_links";
        }
        return "home";
    });

    const totalTasks = 3;
    const progressPercent = Math.round((completedTasks.length / totalTasks) * 100);

    useEffect(() => {
        window.localStorage.setItem("antillapay_onboarding_tasks", JSON.stringify(completedTasks));
    }, [completedTasks]);

    useEffect(() => {
        const path = location.pathname.toLowerCase();
        if (path.startsWith("/customers") || path.startsWith("/dashboard/customers")) {
            setActiveView("customers");
            return;
        }
        if (path.startsWith("/dashboard/payment-links")) {
            setActiveView("payments_links");
            return;
        }
        if (path.startsWith("/dashboard")) {
            setActiveView("home");
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
    const [selectedSetupOptions, setSelectedSetupOptions] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showMetricDropdown, setShowMetricDropdown] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState("Volumen neto");
    const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 18));

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
        } catch (error) {
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
        },
        {
            id: "platform",
            title: "Crea una plataforma o un marketplace",
            description: "Usa Connect para habilitar el movimiento de dinero entre varias partes."
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
            setCustomizeStep("options");
        } else if (customizeStep === "options" && canProceedToTest) {
            setCustomizeStep("test_environment");
        }
    };

    const handleQuickAction = (label) => {
        window.alert(`Accion no implementada: ${label}`);
    };

    const handleAddProduct = () => handleQuickAction("Agregar producto");
    const handleCreatePaymentLink = () => navigate("/dashboard/payment-links/create");
    const handleHelp = () => handleQuickAction("Ayuda");
    const handleSettings = () => handleQuickAction("Configuracion");
    const handleGuide = () => setShowOnboarding(true);
    const handleRequestLive = () => {
        setCustomizeStep("form");
        setShowCustomizeModal(true);
    };
    return (
        <div className="flex h-screen w-full bg-[#f6f9fc] overflow-hidden font-sans relative flex-col">

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
                            <div className="w-[980px] max-w-[96vw] h-[640px] max-h-[90vh] rounded-3xl bg-white shadow-[0_24px_70px_-24px_rgba(15,23,42,0.35)] overflow-hidden">
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
                                        ) : customizeStep === "options" ? (
                                            <div className="flex h-full flex-col justify-between gap-8">
                                                <div className="space-y-6">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCustomizeStep("form")}
                                                        className="text-[13px] font-semibold text-[#635bff] hover:underline"
                                                    >
                                                        ← Atrás
                                                    </button>
                                                    <div>
                                                        <h3 className="text-[24px] font-semibold text-[#32325d]">
                                                            ¿Cómo quieres empezar?
                                                        </h3>
                                                        <p className="mt-2 text-[14px] text-[#4f5b76] leading-relaxed">
                                                            Puedes añadir otras funciones más adelante si las necesitas.
                                                        </p>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {setupOptions.slice(0, 2).map((option) => {
                                                            const isSelected = selectedSetupOptions.includes(option.id);
                                                            return (
                                                                <button
                                                                    key={option.id}
                                                                    type="button"
                                                                    onClick={() => toggleSetupOption(option.id)}
                                                                    className={cn(
                                                                        "w-full rounded-xl border px-4 py-3 text-left transition-all",
                                                                        isSelected
                                                                            ? "border-[#635bff] bg-[#f5f3ff]"
                                                                            : "border-gray-100 bg-white hover:border-[#cbd5f5]"
                                                                    )}
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <span
                                                                            className={cn(
                                                                                "mt-0.5 flex h-4 w-4 items-center justify-center rounded border",
                                                                                isSelected
                                                                                    ? "border-[#635bff] bg-[#635bff]"
                                                                                    : "border-gray-200 bg-white"
                                                                            )}
                                                                        >
                                                                            {isSelected && <Check className="h-3 w-3 text-white" />}
                                                                        </span>
                                                                        <div>
                                                                            <div className="text-[14px] font-semibold text-[#32325d]">
                                                                                {option.title}
                                                                            </div>
                                                                            <div className="text-[13px] text-[#4f5b76]">
                                                                                {option.description}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    <p className="text-[13px] text-[#4f5b76]">
                                                        Incluye herramientas para el onboarding y para verificar la identidad del vendedor
                                                    </p>

                                                    <div>
                                                        {setupOptions.slice(2).map((option) => {
                                                            const isSelected = selectedSetupOptions.includes(option.id);
                                                            return (
                                                                <button
                                                                    key={option.id}
                                                                    type="button"
                                                                    onClick={() => toggleSetupOption(option.id)}
                                                                    className={cn(
                                                                        "w-full rounded-xl border px-4 py-3 text-left transition-all",
                                                                        isSelected
                                                                            ? "border-[#635bff] bg-[#f5f3ff]"
                                                                            : "border-gray-100 bg-white hover:border-[#cbd5f5]"
                                                                    )}
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <span
                                                                            className={cn(
                                                                                "mt-0.5 flex h-4 w-4 items-center justify-center rounded border",
                                                                                isSelected
                                                                                    ? "border-[#635bff] bg-[#635bff]"
                                                                                    : "border-gray-200 bg-white"
                                                                            )}
                                                                        >
                                                                            {isSelected && <Check className="h-3 w-3 text-white" />}
                                                                        </span>
                                                                        <div>
                                                                            <div className="text-[14px] font-semibold text-[#32325d]">
                                                                                {option.title}
                                                                            </div>
                                                                            <div className="text-[13px] text-[#4f5b76]">
                                                                                {option.description}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="pt-4 flex items-center justify-between">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCustomizeModal(false)}
                                                        className="text-[13px] font-semibold text-[#635bff] hover:underline"
                                                    >
                                                        Omítelo por el momento
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCustomizeNext}
                                                        className={cn(
                                                            "rounded-md px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors",
                                                            canProceedToTest ? "bg-[#635bff] hover:bg-[#5851e0]" : "bg-[#b4abff] cursor-not-allowed"
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
                                                        Vayas al entorno de prueba
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            completeTask("customize_account");
                                                            setShowCustomizeModal(false);
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
                {showOnboarding && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        className="fixed inset-x-0 bottom-0 h-[320px] bg-gradient-to-br from-[#f2edff] via-[#d8c3ff] to-[#bfe8ff] z-[101] pointer-events-none"
                    >
                        <div className="h-full max-w-6xl mx-auto px-10 pb-10 flex items-end">
                            <div className="max-w-[420px]">
                                <h2 className="text-[28px] leading-tight font-semibold text-[#32325d]">
                                    A continuación, verifica tu empresa
                                </h2>
                                <p className="mt-3 text-[14px] text-[#4f5b76] leading-relaxed">
                                    Una vez completado el perfil de tu empresa, podrás empezar a aceptar pagos.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setShowOnboarding(false)}
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
            <div className="flex flex-1 min-h-0">
                {/* Sidebar */}
                <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col z-30">
                    <div className="p-4 mb-4">
                        <div className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">N</div>
                            <div className="flex-1 text-sm font-bold text-[#32325d]">Nueva empresa</div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                        <SidebarItem
                            icon={Home}
                            label="Inicio"
                            active={activeView === "home"}
                            onClick={() => navigate("/dashboard")}
                        />
                        <SidebarItem icon={DollarSign} label="Saldos" />
                        <SidebarItem icon={ArrowLeftRight} label="Transacciones" />
                        <SidebarItem
                            icon={Users}
                            label="Clientes"
                            active={activeView === "customers"}
                            onClick={() => navigate("/customers")}
                        />
                        <SidebarItem icon={Package} label="Catálogo de productos" />

                        <div className="pt-6 pb-2 px-3 text-[12px] font-bold text-[#8792a2] uppercase tracking-wider">
                            Productos
                        </div>

                        <SidebarItem
                            icon={CreditCard}
                            label="Pagos"
                            hasSubmenu
                            subItems={["Payments Links"]}
                            active={false}
                            onSubItemClick={(item) => {
                                if (item === "Payments Links") {
                                    navigate("/dashboard/payment-links");
                                }
                            }}
                            activeSubItem={activeView === "payments_links" ? "Payments Links" : null}
                        />
                        <SidebarItem
                            icon={FileText}
                            label="Facturación"
                            hasSubmenu
                            subItems={["Suscripciones"]}
                        />
                    </nav>

                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <SidebarItem icon={LayoutDashboard} label="Desarrolladores" />
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
                    />

                    {/* Content Area */}
                    <div ref={contentRef} className="flex-1 overflow-y-auto p-10">
                        <div className="max-w-6xl mx-auto">
                            <AnimatePresence mode="wait">
                                {activeView === "home" ? (
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
                                            <div className="grid grid-cols-2 gap-10 mb-6">
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
                                                <div className="grid grid-cols-2 gap-16">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="text-[13px] text-[#32325d] mb-1">Saldo en USD</div>
                                                            <div className="text-[20px] font-normal text-[#32325d]">{formatUsd(totals.balance)}</div>
                                                        </div>
                                                        <button className="text-[12px] text-[#635bff] font-semibold hover:underline">Ver datos</button>
                                                    </div>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="text-[13px] text-[#32325d] mb-1">Transferencias</div>
                                                            <div className="text-[20px] font-normal text-[#32325d]">—</div>
                                                        </div>
                                                        <button className="text-[12px] text-[#635bff] font-semibold hover:underline">Ver datos</button>
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

                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-2">
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
                                                                className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 p-6 z-[120] w-[700px]"
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
                            ) : (
                                <motion.div
                                    key="payments_links_view"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <PaymentLinksView onCreateClick={() => navigate("/dashboard/payment-links/create")} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <AnimatePresence>
                    {showOnboarding && (
                        <motion.div
                            key="onboarding-card"
                            className={cn(
                                "fixed bottom-6 right-6 w-[320px] bg-[#f7f9fc] rounded-xl shadow-2xl overflow-hidden transition-all duration-500 z-[102]",
                                "ring-4 ring-[#635bff]/20"
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

                                        <div className="bg-white/50 rounded-lg p-3 border border-transparent">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[13px] text-[#32325d] font-semibold">Verifica tu empresa</span>
                                                <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                                            </div>
                                            <div className="space-y-2 ml-1 border-l border-gray-100 pl-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowVerifyEmailModal(true)}
                                                    className="flex items-center gap-2 text-[12px] text-[#4f5b76] hover:text-[#32325d] transition-colors group"
                                                >
                                                    <div className={cn(
                                                        "w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors border",
                                                        completedTasks.includes("verify_email") ? "bg-[#635bff] border-[#635bff]" : "bg-gray-50 border-gray-100"
                                                    )}>
                                                        {completedTasks.includes("verify_email") && <Check className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                    <span>
                                                        Verifica tu correo electrónico
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => completeTask("complete_profile")}
                                                    className="flex items-center gap-2 text-[12px] text-[#4f5b76] hover:text-[#32325d] transition-colors group text-left"
                                                >
                                                    <div className={cn(
                                                        "w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors border",
                                                        completedTasks.includes("complete_profile") ? "bg-[#635bff] border-[#635bff]" : "bg-gray-50 border-gray-100"
                                                    )}>
                                                        {completedTasks.includes("complete_profile") && <Check className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                    <span>
                                                        Completa tu perfil
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
        </div>
    );
}
