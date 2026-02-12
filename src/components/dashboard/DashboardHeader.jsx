import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MoreHorizontal,
    Plus,
    LogOut,
    User,
    ChevronDown,
    Info,
    Box,
    ChevronRight,
    Menu,
    Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/i18n/LanguageContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

const languageNames = {
    es: "Español",
    en: "English"
};

const IconButton = ({ label, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="relative h-9 w-9 rounded-lg text-[#4f5b76] transition-colors hover:text-[#32325d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff]/40"
    >
        {children}
    </button>
);

const ActionMenu = ({ onAddProduct, onCreatePaymentLink, onCreateTransfer }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                type="button"
                aria-label="Crear nueva accion"
                className="h-9 w-9 rounded-lg bg-[#635bff] text-white shadow-sm hover:bg-[#5851e0]"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
            <DropdownMenuLabel>Acciones rapidas</DropdownMenuLabel>
            <DropdownMenuItem onSelect={onAddProduct}>Agregar producto</DropdownMenuItem>
            <DropdownMenuItem onSelect={onCreatePaymentLink}>Crear Payment Link</DropdownMenuItem>
            <DropdownMenuItem onSelect={onCreateTransfer}>Realizar transferencia</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const OverflowMenu = ({ onSettings, onGuide }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button
                type="button"
                aria-label="Mas opciones"
                className="h-9 w-9 rounded-lg text-[#4f5b76] transition-colors hover:text-[#32325d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff]/40"
            >
                <MoreHorizontal className="h-5 w-5" />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[220px]">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onSelect={onSettings}>Información de mi cuenta</DropdownMenuItem>
            <DropdownMenuItem onSelect={onGuide}>Guia de configuracion</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const ExitTestModeModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleActivateAccount = () => {
        navigate('/dashboard/business-verification');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[460px] rounded-2xl">
                <DialogHeader>
                    <div className="flex flex-col items-center text-center px-4 pt-4">
                        <div className="h-14 w-14 bg-[#f8fafc] rounded-xl flex items-center justify-center text-[18px] font-bold text-[#8898aa] mb-4">
                            ED
                        </div>
                        <DialogTitle className="text-[20px] font-semibold text-[#32325d] mb-2">
                            Entorno de prueba de New business
                        </DialogTitle>
                        <DialogDescription className="text-[14px] text-[#4f5b76]">
                            New business
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <div className="px-6 pb-6 pt-2">
                    <button
                        onClick={handleActivateAccount}
                        className="w-full rounded-lg bg-[#635bff] px-4 py-3 text-[14px] font-semibold text-white hover:bg-[#5851e0] transition-colors"
                    >
                        Activar tu cuenta
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const AccountDropdown = ({ onSettings, currentUser }) => {
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="flex items-center gap-2.5 p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none group"
                    >
                        <div className="h-6 w-6 rounded bg-[#f1f3f5] flex items-center justify-center text-[10px] font-bold text-[#4f5b76]">
                            N
                        </div>
                        <span className="text-[14px] font-bold text-[#32325d]">Naranjito</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#aab2c4] group-hover:text-[#32325d] transition-colors" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[300px] p-2 bg-white shadow-2xl rounded-xl border border-gray-100" sideOffset={8}>
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
                            onClick={onSettings}
                            className="w-full h-9 flex items-center gap-3 px-3 rounded-lg hover:bg-gray-50 text-[#32325d] transition-colors text-left group"
                        >
                            <Info className="w-4 h-4 text-[#8898aa] group-hover:text-[#635bff] transition-colors" />
                            <span className="text-[14px] font-medium">Información de mi cuenta</span>
                        </button>
                    </div>

                    <DropdownMenuSeparator className="my-2 bg-gray-100" />

                    <div className="px-1 pt-1 pb-1">
                        <div className="w-full h-10 flex items-center gap-3 px-3 rounded-lg hover:bg-gray-50 text-[#32325d] transition-colors cursor-pointer group">
                            <User className="w-4 h-4 text-[#8898aa] group-hover:text-[#635bff] transition-colors" />
                            <span className="text-[14px] font-medium">{currentUser?.name || "Usuario"}</span>
                        </div>

                        <button className="w-full h-10 flex items-center gap-3 px-3 rounded-lg hover:bg-gray-50 text-[#32325d] transition-colors text-left mt-0.5 group">
                            <LogOut className="w-4 h-4 text-[#8898aa] group-hover:text-red-500 transition-colors" />
                            <span className="text-[14px] font-medium">Cerrar sesión</span>
                        </button>
                    </div>

                </DropdownMenuContent>
            </DropdownMenu>
            <ExitTestModeModal isOpen={isExitModalOpen} onClose={() => setIsExitModalOpen(false)} />
        </>
    );
};

export default function DashboardHeader({
    isElevated,
    onLogoClick,
    onAddProduct,
    onCreatePaymentLink,
    onCreateTransfer,
    onHelp,
    onSettings,
    onGuide,
    showGuideButton,
    guideProgress,
    onMenuClick
}) {
    const { language, changeLanguage } = useLanguage();
    const [showLangMenu, setShowLangMenu] = useState(false);

    return (
        <header
            className={cn(
                "sticky top-0 z-30 bg-white border-b border-gray-200",
                isElevated && "shadow-[0_2px_10px_-6px_rgba(15,23,42,0.35)]"
            )}
        >
            <div className="h-16 px-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
                        onClick={onMenuClick}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    {/* Logo or other left content if needed */}
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <button
                            type="button"
                            onClick={() => setShowLangMenu((current) => !current)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100/60 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="hidden xl:inline">{languageNames[language]}</span>
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {showLangMenu && (
                            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[140px]">
                                {Object.entries(languageNames).map(([code, name]) => (
                                    <button
                                        key={code}
                                        onClick={() => {
                                            changeLanguage(code);
                                            setShowLangMenu(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                                            language === code
                                                ? "text-violet-600 font-medium bg-violet-50"
                                                : "text-gray-700"
                                        )}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <ActionMenu
                        onAddProduct={onAddProduct}
                        onCreatePaymentLink={onCreatePaymentLink}
                        onCreateTransfer={onCreateTransfer}
                    />
                    <div className="hidden md:flex items-center gap-2">
                        <IconButton label="Información de mi cuenta" onClick={onSettings}>
                            <Info className="h-5 w-5" />
                        </IconButton>
                        {showGuideButton && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onGuide}
                                className="rounded-lg border-gray-200 text-[12px] text-[#4f5b76] hover:text-[#32325d] relative overflow-hidden pl-3 pr-3"
                            >
                                <div className="absolute left-0 top-0 bottom-0 bg-[#635bff]/10 transition-all duration-500" style={{ width: `${guideProgress}%` }} />
                                <span className="relative z-10 flex items-center gap-2">
                                    Guía de configuración
                                </span>
                            </Button>
                        )}
                    </div>
                    <div className="md:hidden">
                        <OverflowMenu
                            onSettings={onSettings}
                            onGuide={onGuide}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
