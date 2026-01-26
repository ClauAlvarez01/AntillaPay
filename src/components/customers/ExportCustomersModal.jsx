import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
                className="sm:max-w-[520px]"
                aria-labelledby="export-customers-title"
                aria-describedby="export-customers-description"
            >
                <DialogHeader>
                    <DialogTitle id="export-customers-title">Exportar clientes</DialogTitle>
                    <DialogDescription id="export-customers-description">
                        Elige el formato y el alcance de los datos.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="text-[12px] font-semibold text-[#4f5b76] uppercase tracking-wide">
                            Formato
                        </div>
                        <RadioGroup value={format} onValueChange={setFormat} className="grid gap-3">
                            {[
                                { value: "csv", label: "CSV" },
                                { value: "xlsx", label: "Excel (.xlsx)" }
                            ].map((option) => (
                                <div key={option.value} className="flex items-center gap-3">
                                    <RadioGroupItem value={option.value} id={`format-${option.value}`} />
                                    <Label htmlFor={`format-${option.value}`} className="text-[13px] text-[#32325d]">
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-3">
                        <div className="text-[12px] font-semibold text-[#4f5b76] uppercase tracking-wide">
                            Alcance
                        </div>
                        <RadioGroup value={scope} onValueChange={setScope} className="grid gap-3">
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="all" id="scope-all" />
                                <Label htmlFor="scope-all" className="text-[13px] text-[#32325d]">
                                    Todos los clientes
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="filtered" id="scope-filtered" />
                                <Label htmlFor="scope-filtered" className="text-[13px] text-[#32325d]">
                                    Solo resultados filtrados
                                </Label>
                            </div>
                            <div className={cn("flex items-center gap-3", !hasSelection && "opacity-50")}>
                                <RadioGroupItem value="selected" id="scope-selected" disabled={!hasSelection} />
                                <Label htmlFor="scope-selected" className="text-[13px] text-[#32325d]">
                                    Solo seleccionados
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-3">
                        <div className="text-[12px] font-semibold text-[#4f5b76] uppercase tracking-wide">
                            Columnas
                        </div>
                        <div className="flex items-start gap-3">
                            <Checkbox
                                id="use-current-columns"
                                checked={useCurrentColumns}
                                onCheckedChange={(value) => setUseCurrentColumns(Boolean(value))}
                            />
                            <div className="space-y-1">
                                <Label htmlFor="use-current-columns" className="text-[13px] text-[#32325d]">
                                    Usar la configuración actual de columnas
                                </Label>
                                <p className="text-[12px] text-[#8792a2]">
                                    Exporta las columnas visibles y el orden actual.
                                </p>
                            </div>
                        </div>
                        {!useCurrentColumns && (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {COLUMN_OPTIONS.map((column) => (
                                    <div key={column.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`column-${column.id}`}
                                            checked={selectedColumns.includes(column.id)}
                                            onCheckedChange={() => handleToggleColumn(column.id)}
                                        />
                                        <Label htmlFor={`column-${column.id}`} className="text-[12px] text-[#4f5b76]">
                                            {column.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-md border-gray-200"
                        onClick={() => onOpenChange(false)}
                        disabled={isExporting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        className="rounded-md bg-[#635bff] text-white hover:bg-[#5851e0]"
                        onClick={handleExport}
                        disabled={isExportDisabled}
                    >
                        {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Exportar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
