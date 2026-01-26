import React from "react";
import {
    HelpCircle,
    MoreHorizontal,
    Plus,
    Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const IconButton = ({ label, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="relative h-9 w-9 rounded-full text-[#4f5b76] transition-colors hover:text-[#32325d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff]/40"
    >
        {children}
    </button>
);

const ActionMenu = ({ onAddProduct, onCreatePaymentLink }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                type="button"
                aria-label="Crear nueva accion"
                className="h-9 w-9 rounded-full bg-[#635bff] text-white shadow-sm hover:bg-[#5851e0]"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
            <DropdownMenuLabel>Acciones rapidas</DropdownMenuLabel>
            <DropdownMenuItem onSelect={onAddProduct}>Agregar producto</DropdownMenuItem>
            <DropdownMenuItem onSelect={onCreatePaymentLink}>Crear Payment Link</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const OverflowMenu = ({ onHelp, onSettings, onGuide }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button
                type="button"
                aria-label="Mas opciones"
                className="h-9 w-9 rounded-full text-[#4f5b76] transition-colors hover:text-[#32325d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff]/40"
            >
                <MoreHorizontal className="h-5 w-5" />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[220px]">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onSelect={onHelp}>Ayuda</DropdownMenuItem>
            <DropdownMenuItem onSelect={onSettings}>Configuracion</DropdownMenuItem>
            <DropdownMenuItem onSelect={onGuide}>Guia de configuracion</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

export default function DashboardHeader({
    isElevated,
    onLogoClick,
    onAddProduct,
    onCreatePaymentLink,
    onHelp,
    onSettings,
    onGuide
}) {
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
                        onClick={onLogoClick}
                        aria-label="Ir al dashboard"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#635bff] text-white shadow-sm"
                    >
                        <span className="text-sm font-bold">A</span>
                    </button>
                    <span className="hidden sm:block text-[14px] font-semibold text-[#32325d]">
                        AntillaPay
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <ActionMenu onAddProduct={onAddProduct} onCreatePaymentLink={onCreatePaymentLink} />
                    <div className="hidden md:flex items-center gap-2">
                        <IconButton label="Ayuda" onClick={onHelp}>
                            <HelpCircle className="h-5 w-5" />
                        </IconButton>
                        <IconButton label="Configuracion" onClick={onSettings}>
                            <Settings className="h-5 w-5" />
                        </IconButton>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onGuide}
                            className="rounded-full border-gray-200 text-[12px] text-[#4f5b76] hover:text-[#32325d]"
                        >
                            Guia de configuracion
                        </Button>
                    </div>
                    <div className="md:hidden">
                        <OverflowMenu
                            onHelp={onHelp}
                            onSettings={onSettings}
                            onGuide={onGuide}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
