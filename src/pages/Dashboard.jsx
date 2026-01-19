import React, { useState } from 'react';
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
    ExternalLink,
    ChevronRight,
    MoreHorizontal,
    Info,
    ChevronUp,
    LayoutDashboard,
    FileText,
    DollarSign
} from 'lucide-react';
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

export default function Dashboard() {
    const [testMode, setTestMode] = useState(true);

    return (
        <div className="flex h-screen w-full bg-[#f6f9fc] overflow-hidden">
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
                        subItems={["Pagos", "Transmisiones", "Disputas"]}
                    />
                    <SidebarItem
                        icon={FileText}
                        label="Facturación"
                        hasSubmenu
                        subItems={["Suscripciones", "Facturas", "Presupuestos"]}
                    />
                </nav>

                <div className="p-4 border-t border-gray-100">
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
                        <div className="flex items-center gap-2 pr-4 border-r border-gray-100">
                            <span className="text-sm font-medium text-[#4f5b76]">Modo de prueba</span>
                            <button
                                onClick={() => setTestMode(!testMode)}
                                className={cn(
                                    "w-10 h-5 rounded-full relative transition-colors duration-200",
                                    testMode ? "bg-[#635bff]" : "bg-gray-200"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200",
                                    testMode ? "left-6" : "left-1"
                                )} />
                            </button>
                        </div>

                        <button className="text-[#4f5b76] hover:text-[#32325d] transition-colors"><HelpCircle className="w-5 h-5" /></button>
                        <button className="text-[#4f5b76] hover:text-[#32325d] transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <button className="text-[#4f5b76] hover:text-[#32325d] transition-colors"><Settings className="w-5 h-5" /></button>
                        <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-bold">AV</AvatarFallback>
                        </Avatar>
                        <button className="w-7 h-7 bg-[#635bff] text-white rounded-full flex items-center justify-center hover:bg-[#5851e0] transition-colors">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-10 bg-gradient-to-br from-white via-[#f6f9fc] to-[#f6f9fc]">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-bold text-[#32325d]">Hoy</h1>
                            <div className="flex items-center gap-3">
                                <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-semibold text-[#4f5b76] hover:bg-gray-50 flex items-center gap-2">
                                    Entornos de prueba <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[14px] font-semibold text-[#697386]">Volumen bruto</span>
                                    <Info className="w-4 h-4 text-gray-300" />
                                </div>
                                <div className="text-2xl font-bold text-[#32325d]">0,00 US$</div>
                                <div className="mt-2 text-[12px] text-[#8792a2]">Sin datos previos</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[14px] font-semibold text-[#697386]">Ayer</span>
                                    <Info className="w-4 h-4 text-gray-300" />
                                </div>
                                <div className="text-2xl font-bold text-[#32325d]">0,00 US$</div>
                                <div className="mt-2 text-[12px] text-[#8792a2]">Para el mismo día</div>
                            </div>
                        </div>

                        {/* Empty State / Onboarding */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden mb-12"
                        >
                            <div className="flex flex-col lg:flex-row">
                                <div className="lg:w-[60%] p-12">
                                    <h2 className="text-3xl font-bold text-[#32325d] mb-6">A continuación, verifica tu empresa</h2>
                                    <p className="text-lg text-[#4f5b76] mb-8 leading-relaxed max-w-lg">
                                        Una vez completado el perfil de tu empresa, podrás empezar a aceptar pagos y acceder a todas las funciones financieras de AntillaPay.
                                    </p>
                                    <Button className="h-11 px-8 bg-[#32325d] hover:bg-black text-white font-bold rounded-lg transition-transform active:scale-[0.98]">
                                        Entendido
                                    </Button>
                                </div>
                                <div className="lg:w-[40%] bg-[#f7f9fc] p-12 border-l border-gray-100">
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-sm font-bold text-[#32325d] uppercase tracking-wider mb-4">Guía de configuración</h3>
                                            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="w-1/3 h-full bg-[#635bff]"></div>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <button className="w-full flex items-center justify-between group p-4 bg-white rounded-xl border-2 border-transparent hover:border-[#635bff30] transition-all shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-5 h-5 rounded-full border-2 border-[#635bff] flex items-center justify-center">
                                                        <div className="w-2.5 h-2.5 bg-[#635bff] rounded-full"></div>
                                                    </div>
                                                    <span className="font-bold text-[#32325d]">Personaliza tu configuración</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-[#635bff15] flex items-center justify-center text-[#635bff] group-hover:bg-[#635bff] group-hover:text-white transition-all">
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </button>

                                            <div className="w-full p-4 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                                    <span className="text-[#4f5b76] font-medium">Verifica tu empresa</span>
                                                    <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
                                                </div>
                                                <div className="ml-5.5 space-y-4 pt-2 border-l border-gray-200 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full border border-gray-300"></div>
                                                        <span className="text-sm text-[#4f5b76]">Verifica tu correo electrónico</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full border border-gray-300"></div>
                                                        <span className="text-sm text-[#4f5b76]">Completa tu perfil</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
