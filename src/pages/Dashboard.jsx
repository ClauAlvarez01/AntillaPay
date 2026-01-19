import React, { useState, useEffect } from 'react';
import {
    Home,
    CreditCard,
    ArrowLeftRight,
    Users,
    Package,
    Search,
    HelpCircle,
    Bell,
    Settings,
    Plus,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    MoreHorizontal,
    Info,
    ChevronUp,
    LayoutDashboard,
    FileText,
    DollarSign,
    X,
    Maximize2,
    Check,
    EyeOff,
    BarChart3,
    MoreVertical,
    Clipboard
} from 'lucide-react';
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const SidebarItem = ({ icon: Icon, label, active, hasSubmenu, subItems = [] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full">
            <button
                onClick={() => hasSubmenu && setIsOpen(!isOpen)}
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
                    isOpen ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />
                )}
            </button>
            {hasSubmenu && isOpen && (
                <div className="ml-9 mt-1 space-y-1">
                    {subItems.map((item, idx) => (
                        <button key={idx} className="w-full text-left py-1.5 text-[13px] text-[#4f5b76] hover:text-[#635bff] transition-colors">
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

export default function Dashboard() {
    const [testMode, setTestMode] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [showTestAlert, setShowTestAlert] = useState(false);
    const [isGuideCollapsed, setIsGuideCollapsed] = useState(false);
    const [completedTasks, setCompletedTasks] = useState(() => {
        if (typeof window === "undefined") return [];
        const saved = window.localStorage.getItem("antillapay_onboarding_tasks");
        return saved ? JSON.parse(saved) : [];
    });
    const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
    const [showCustomizeModal, setShowCustomizeModal] = useState(false);
    const [customizeStep, setCustomizeStep] = useState("form");

    const totalTasks = 3;
    const progressPercent = Math.round((completedTasks.length / totalTasks) * 100);

    useEffect(() => {
        window.localStorage.setItem("antillapay_onboarding_tasks", JSON.stringify(completedTasks));
    }, [completedTasks]);

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

    const currentMetric = metrics.find(m => m.id === selectedMetric);
    const metricValue = currentMetric.isMonetary ? "0,00 US$" : "0";
    const currentTimeLabel = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
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

    return (
        <div className="flex h-screen w-full bg-[#f6f9fc] overflow-hidden font-sans relative">

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
                    <SidebarItem icon={Home} label="Inicio" active />
                    <SidebarItem icon={DollarSign} label="Saldos" />
                    <SidebarItem icon={ArrowLeftRight} label="Transacciones" />
                    <SidebarItem icon={Users} label="Clientes" />
                    <SidebarItem icon={Package} label="Catálogo de productos" />

                    <div className="pt-6 pb-2 px-3 text-[12px] font-bold text-[#8792a2] uppercase tracking-wider">
                        Productos
                    </div>

                    <SidebarItem
                        icon={CreditCard}
                        label="Pagos"
                        hasSubmenu
                        subItems={["Payments Links"]}
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
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Test Mode Banner */}
                <div className="bg-[#e96b34] text-white px-6 py-2.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Modo de prueba</span>
                        <span className="opacity-90">Estás usando datos de prueba. Para aceptar pagos, completa el perfil de tu empresa.</span>
                    </div>
                    <button className="flex items-center gap-1 font-bold hover:underline">
                        Completar perfil <ExternalLink className="w-4 h-4" />
                    </button>
                </div>

                {/* Header */}
                <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#635bff] transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar"
                                className="w-full h-9 pl-10 pr-4 bg-[#f6f9fc] rounded-md border-none text-sm focus:ring-2 focus:ring-[#635bff15] outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 pr-4 border-r border-gray-100 relative">
                            <span className="text-sm font-medium text-[#4f5b76]">Modo de prueba</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowTestAlert(!showTestAlert);
                                }}
                                className={cn(
                                    "w-10 h-5 rounded-full relative transition-colors duration-200",
                                    testMode ? "bg-[#e2a884]" : "bg-gray-200"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200",
                                    testMode ? "left-6" : "left-1"
                                )} />
                            </button>

                            {/* Test Alert Popover */}
                            <AnimatePresence>
                                {showTestAlert && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowTestAlert(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                            className="absolute top-full right-0 mt-2 w-[340px] bg-white rounded-xl shadow-2xl p-6 z-50 border border-gray-100"
                                        >
                                            <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100" />
                                            <p className="text-[#32325d] leading-relaxed text-[15px]">
                                                Esta cuenta está en <span className="text-[#635bff] font-semibold cursor-pointer hover:underline">modo de prueba</span>. <span className="text-[#635bff] font-semibold cursor-pointer hover:underline">completa tu perfil de empresa</span> para aceptar pagos activos.
                                            </p>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <button className="text-[#4f5b76] hover:text-[#32325d] transition-colors"><Maximize2 className="w-4.4 h-4.4" /></button>
                        <button className="text-[#4f5b76] hover:text-[#32325d] transition-colors"><HelpCircle className="w-5 h-5" /></button>
                        <button className="text-[#4f5b76] hover:text-[#32325d] transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#635bff] rounded-full border-2 border-white"></span>
                        </button>
                        <button className="text-[#4f5b76] hover:text-[#32325d] transition-colors"><Settings className="w-5 h-5" /></button>
                        <button className="w-7 h-7 bg-[#635bff] text-white rounded-[6px] flex items-center justify-center hover:bg-[#5851e0] transition-colors shadow-sm">
                            <Plus className="w-5 h-5" />
                        </button>

                        <AnimatePresence>
                            {!showOnboarding && (
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onClick={() => setShowOnboarding(true)}
                                    className="ml-2 flex items-center gap-3 px-4 py-2 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-gray-100 rounded-full transition-all group"
                                >
                                    <span className="text-[13px] font-semibold text-[#4f5b76] group-hover:text-[#32325d]">Guía de configuración</span>
                                    <div className="relative w-5 h-5">
                                        <svg className="w-5 h-5 -rotate-90">
                                            <circle
                                                cx="10"
                                                cy="10"
                                                r="8"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                fill="transparent"
                                                className="text-gray-100"
                                            />
                                            <circle
                                                cx="10"
                                                cy="10"
                                                r="8"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                fill="transparent"
                                                strokeDasharray={2 * Math.PI * 8}
                                                strokeDashoffset={2 * Math.PI * 8 * (1 - progressPercent / 100)}
                                                className="text-[#635bff] transition-all duration-700"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-10">
                    <div className="max-w-6xl mx-auto">
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
                                        <div className="text-[24px] font-semibold text-[#32325d]">{metricValue}</div>

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
                                <div className="relative h-[220px] w-full mb-8">
                                    {/* Grid lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between">
                                        {[...Array(2)].map((_, i) => (
                                            <div key={i} className="w-full h-[1px] bg-gray-100" />
                                        ))}
                                    </div>
                                    {/* Vertical grid lines */}
                                    <div className="absolute inset-0 flex justify-between">
                                        {[...Array(25)].map((_, i) => (
                                            <div key={i} className="w-[1px] h-full bg-gray-100" />
                                        ))}
                                    </div>
                                    {/* Blue dot indicator */}
                                    <div className="absolute left-2 top-[180px] w-1.5 h-1.5 bg-[#635bff] rounded-full" />
                                    {/* Time label */}
                                    <div className="absolute bottom-[-20px] right-0 text-[11px] text-[#aab2c4]">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                                </div>

                                {/* Bottom Stats Row */}
                                <div className="border-t border-gray-100 pt-6">
                                    <div className="grid grid-cols-2 gap-16">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-[13px] text-[#32325d] mb-1">Saldo en USD</div>
                                                <div className="text-[20px] font-normal text-[#32325d]">0,00 US$</div>
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
                                        Utiliza Checkout para integrar un <span className="text-[#635bff] font-medium cursor-pointer hover:underline">formulario de pago</span> en tu sitio web o redirige a tus clientes a una página alojada en Stripe.
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
                            <h2 className="text-[22px] font-bold text-[#32325d] mb-6">Tu resumen</h2>

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

                            <div className="space-y-6">
                                {/* First Row: 3 cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { title: "Payments", icon: <EyeOff className="w-3.5 h-3.5 text-gray-400" />, showMoreInfo: false },
                                        { title: "Volumen bruto", icon: <Info className="w-3.5 h-3.5 text-gray-400" />, showMoreInfo: true },
                                        { title: "Volumen neto", icon: <Info className="w-3.5 h-3.5 text-gray-400" />, showMoreInfo: true }
                                    ].map((card, idx) => (
                                        <div key={idx} className="bg-white border border-gray-100 rounded-xl p-6 transition-all hover:shadow-md h-[340px] flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-1.5 mb-6">
                                                    <span className="text-[14px] font-bold text-[#32325d]">{card.title}</span>
                                                    <button className="hover:text-gray-600 transition-colors">{card.icon}</button>
                                                </div>
                                                <div className="w-full h-[180px] border border-dashed border-gray-200 rounded-xl mb-4 relative flex items-center justify-center group/card">
                                                    <div className="absolute inset-0 bg-[#f7f9fc]/40 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                                    <div className="px-4 py-2 bg-[#f7f9fc] border border-gray-100 rounded-lg text-[13px] text-[#697386] relative z-10 font-medium">No hay datos</div>
                                                </div>
                                            </div>
                                            {card.showMoreInfo && (
                                                <div className="flex justify-end">
                                                    <button className="text-[12px] text-[#aab2c4] hover:text-[#635bff] font-semibold transition-colors">Más información</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Second Row: 2 cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                                    {/* Errores en los pagos */}
                                    <div className="bg-white border border-gray-100 rounded-xl p-6 transition-all hover:shadow-md h-[400px] flex flex-col">
                                        <div className="flex items-center gap-1.5 mb-6">
                                            <span className="text-[14px] font-bold text-[#32325d]">Errores en los pagos</span>
                                            <button className="hover:text-gray-600 transition-colors"><Info className="w-3.5 h-3.5 text-gray-400" /></button>
                                        </div>
                                        <div className="flex-1 border border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                                            <div className="px-5 py-2.5 bg-[#f7f9fc] border border-gray-100 rounded-lg text-[13px] text-[#697386] font-medium">No hay datos</div>
                                        </div>
                                    </div>

                                    {/* Principales clientes por gasto */}
                                    <div className="bg-white border border-gray-100 rounded-xl p-6 transition-all hover:shadow-md h-[400px] flex flex-col">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[14px] font-bold text-[#32325d]">Principales clientes por gasto</span>
                                                <button className="hover:text-gray-600 transition-colors"><EyeOff className="w-3.5 h-3.5 text-gray-400" /></button>
                                            </div>
                                            <span className="text-[12px] text-[#aab2c4] font-medium uppercase tracking-wider">Siempre</span>
                                        </div>

                                        <div className="space-y-6">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="flex items-center justify-between group/row">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                                                            <Users className="w-4 h-4 text-gray-300" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="h-2.5 w-24 bg-gray-100 rounded-full" />
                                                            <div className="h-2 w-32 bg-gray-50 rounded-full" />
                                                        </div>
                                                    </div>
                                                    <div className="h-3 w-12 bg-gray-50 rounded-full" />
                                                </div>
                                            ))}
                                            <div className="pt-4 border-t border-gray-50">
                                                <div className="h-2 w-20 bg-gray-50 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
    );
}
