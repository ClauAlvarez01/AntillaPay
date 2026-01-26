import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";

const COLUMN_OPTIONS = [
    { id: "name", label: "Nombre" },
    { id: "email", label: "Correo" },
    { id: "created", label: "Creado" },
    { id: "type", label: "Tipo" },
    { id: "balance", label: "Saldo" },
    { id: "status", label: "Estado" }
];

/**
 * @typedef {Object} ExportOptions
 * @property {"csv" | "xlsx"} format
 * @property {"all" | "filtered" | "selected"} scope
 * @property {boolean} useCurrentColumns
 * @property {string[]} columns
 * @property {number} totalCount
 * @property {number} filteredCount
 * @property {string[]} selectedIds
 */

/**
 * @param {ExportOptions} options
 * @returns {Promise<void>}
 */
export const exportCustomers = async (options) => {
    // Stub for backend integration.
    await new Promise((resolve) => setTimeout(resolve, 800));
    void options;
};

export default function ExportCustomersModal({
    open,
    onOpenChange,
    totalCount = 0,
    filteredCount = 0,
    selectedIds = []
}) {
    const [format, setFormat] = useState("csv");
    const [scope, setScope] = useState("all");
    const [useCurrentColumns, setUseCurrentColumns] = useState(true);
    const [selectedColumns, setSelectedColumns] = useState(() => COLUMN_OPTIONS.map((column) => column.id));
    const [isExporting, setIsExporting] = useState(false);

    const hasSelection = selectedIds.length > 0;

    useEffect(() => {
        if (!hasSelection && scope === "selected") {
            setScope("all");
        }
    }, [hasSelection, scope]);

    const canExportColumns = useCurrentColumns || selectedColumns.length > 0;
    const isExportDisabled = isExporting || !canExportColumns;

    const handleToggleColumn = (columnId) => {
        setSelectedColumns((prev) => (
            prev.includes(columnId)
                ? prev.filter((id) => id !== columnId)
                : [...prev, columnId]
        ));
    };

    const handleExport = async () => {
        if (isExportDisabled) {
            return;
        }
        setIsExporting(true);
        try {
            await exportCustomers({
                format,
                scope,
                useCurrentColumns,
                columns: useCurrentColumns ? [] : selectedColumns,
                totalCount,
                filteredCount,
                selectedIds
            });
            toast.success("Exportación iniciada");
            onOpenChange(false);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[600px] rounded-2xl border border-gray-200 p-0 [&>button]:hidden"
                aria-labelledby="export-customers-title"
                aria-describedby="export-customers-description"
            >
                <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                    <div>
                        <h3 id="export-customers-title" className="text-[18px] font-semibold text-[#1a1f36]">
                            Exportar clientes
                        </h3>
                        <p id="export-customers-description" className="text-[13px] text-[#6b7280] mt-1">
                            Elige el formato y el alcance de los datos.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl border border-transparent p-1.5 text-[#9ca3af] hover:text-[#4b5563]"
                        aria-label="Cerrar"
                        disabled={isExporting}
                    >
                        <X className="h-4 w-4" />
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
                                    checked={format === "csv"}
                                    onChange={(event) => setFormat(event.target.value)}
                                    className="w-4 h-4 text-[#635bff] border-gray-300 focus:ring-[#93c5fd]"
                                />
                                <span className="text-[12px] text-[#4f5b76]">CSV</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="export-format"
                                    value="xlsx"
                                    checked={format === "xlsx"}
                                    onChange={(event) => setFormat(event.target.value)}
                                    className="w-4 h-4 text-[#635bff] border-gray-300 focus:ring-[#93c5fd]"
                                />
                                <span className="text-[12px] text-[#4f5b76]">Excel (.xlsx)</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <div className="text-[13px] font-semibold text-[#32325d] mb-2">Alcance</div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="export-scope"
                                    value="all"
                                    checked={scope === "all"}
                                    onChange={(event) => setScope(event.target.value)}
                                    className="w-4 h-4 text-[#635bff] border-gray-300 focus:ring-[#93c5fd]"
                                />
                                <span className="text-[13px] text-[#32325d]">Todos los clientes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="export-scope"
                                    value="filtered"
                                    checked={scope === "filtered"}
                                    onChange={(event) => setScope(event.target.value)}
                                    className="w-4 h-4 text-[#635bff] border-gray-300 focus:ring-[#93c5fd]"
                                />
                                <span className="text-[13px] text-[#32325d]">Solo resultados filtrados</span>
                            </label>
                            <label className={cn("flex items-center gap-2 cursor-pointer", !hasSelection && "opacity-50")}>
                                <input
                                    type="radio"
                                    name="export-scope"
                                    value="selected"
                                    checked={scope === "selected"}
                                    onChange={(event) => setScope(event.target.value)}
                                    className="w-4 h-4 text-[#635bff] border-gray-300 focus:ring-[#93c5fd]"
                                    disabled={!hasSelection}
                                />
                                <span className="text-[13px] text-[#32325d]">Solo seleccionados</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <div className="text-[13px] font-semibold text-[#32325d] mb-2">Columnas</div>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useCurrentColumns}
                                onChange={(event) => setUseCurrentColumns(event.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#635bff] focus:ring-[#93c5fd]"
                            />
                            <div className="space-y-1">
                                <span className="text-[13px] text-[#32325d]">
                                    Usar la configuración actual de columnas
                                </span>
                                <p className="text-[12px] text-[#8792a2]">
                                    Exporta las columnas visibles y el orden actual.
                                </p>
                            </div>
                        </label>
                        {!useCurrentColumns && (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mt-3">
                                {COLUMN_OPTIONS.map((column) => (
                                    <label key={column.id} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedColumns.includes(column.id)}
                                            onChange={() => handleToggleColumn(column.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-[#635bff] focus:ring-[#93c5fd]"
                                        />
                                        <span className="text-[12px] text-[#4f5b76]">{column.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-[13px] font-semibold text-[#374151] hover:bg-gray-50"
                        disabled={isExporting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleExport}
                        disabled={isExportDisabled}
                        className={`rounded-lg px-4 py-2 text-[13px] font-semibold text-white ${isExportDisabled
                            ? "bg-[#c4c7ff] cursor-not-allowed"
                            : "bg-[#635bff] hover:bg-[#5851e0]"
                            }`}
                    >
                        {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Exportar
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
