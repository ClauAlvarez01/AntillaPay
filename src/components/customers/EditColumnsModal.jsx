import React, { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";

const cloneColumns = (columns) => columns.map((column) => ({ ...column }));

export default function EditColumnsModal({
    open,
    onOpenChange,
    columns,
    defaultColumns,
    isLoading,
    onSave
}) {
    const [draftColumns, setDraftColumns] = useState([]);

    useEffect(() => {
        if (open) {
            setDraftColumns(cloneColumns(columns ?? defaultColumns ?? []));
        }
    }, [columns, defaultColumns, open]);

    const configurableColumns = useMemo(
        () => draftColumns.filter((column) => !column.locked),
        [draftColumns]
    );

    const visibleConfigurableCount = configurableColumns.filter((column) => column.visible).length;
    const hasConfigurableColumns = configurableColumns.length > 0;

    const reorderableKeys = useMemo(
        () => configurableColumns.map((column) => column.key),
        [configurableColumns]
    );

    const handleToggleVisibility = (key) => {
        setDraftColumns((prev) => {
            const currentVisibleCount = prev.filter((column) => !column.locked && column.visible).length;
            return prev.map((column) => {
                if (column.key !== key || column.locked) {
                    return column;
                }
                if (column.visible && currentVisibleCount <= 1) {
                    return column;
                }
                return { ...column, visible: !column.visible };
            });
        });
    };

    const moveColumn = (key, direction) => {
        setDraftColumns((prev) => {
            const reorderable = prev.filter((column) => !column.locked);
            const locked = prev.filter((column) => column.locked);
            const index = reorderable.findIndex((column) => column.key === key);
            if (index === -1) {
                return prev;
            }
            const nextIndex = direction === "up" ? index - 1 : index + 1;
            if (nextIndex < 0 || nextIndex >= reorderable.length) {
                return prev;
            }
            const nextReorderable = [...reorderable];
            [nextReorderable[index], nextReorderable[nextIndex]] = [
                nextReorderable[nextIndex],
                nextReorderable[index]
            ];
            return [...nextReorderable, ...locked];
        });
    };

    const handleReset = () => {
        setDraftColumns(cloneColumns(defaultColumns ?? []));
    };

    const handleSave = () => {
        if (!draftColumns.length) {
            onOpenChange(false);
            return;
        }
        onSave(cloneColumns(draftColumns));
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] max-h-[80vh] rounded-2xl border border-gray-200 p-0 overflow-hidden [&>button]:hidden">
                <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-200">
                    <div className="space-y-1">
                        <h3 className="text-[18px] font-semibold text-[#1a1f36]">Editar columnas</h3>
                        <p className="text-[13px] text-[#6b7280]">
                            Controla qué columnas se muestran y en qué orden aparecen.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="text-[12px] font-semibold text-[#635bff] hover:text-[#5851e0]"
                        onClick={handleReset}
                        disabled={isLoading}
                    >
                        Restablecer
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-4">
                    {isLoading ? (
                        <div className="py-6 text-center text-[13px] text-[#8792a2]">
                            Cargando preferencias...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="text-[12px] font-semibold text-[#635bff] uppercase tracking-wide">
                                    Visibilidad
                                </div>
                                {draftColumns.length === 0 ? (
                                    <p className="text-[13px] text-[#8792a2]">
                                        No hay columnas disponibles.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {!hasConfigurableColumns && (
                                            <p className="text-[13px] text-[#8792a2]">
                                                No hay columnas configurables.
                                            </p>
                                        )}
                                        {draftColumns.map((column) => {
                                            const isLocked = column.locked;
                                            const disableToggle =
                                                isLocked || (column.visible && visibleConfigurableCount <= 1);
                                            return (
                                                <div
                                                    key={column.key}
                                                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2"
                                                >
                                                    <div className="flex items-center gap-3">
                                                    <label
                                                        htmlFor={`visibility-${column.key}`}
                                                        className={cn(
                                                            "flex items-center gap-3",
                                                            disableToggle && "opacity-50 cursor-not-allowed"
                                                        )}
                                                    >
                                                        <input
                                                            id={`visibility-${column.key}`}
                                                            type="checkbox"
                                                            checked={column.visible}
                                                            disabled={disableToggle}
                                                            onChange={() => handleToggleVisibility(column.key)}
                                                            className="peer sr-only"
                                                        />
                                                        <span className="h-4 w-4 rounded-full border border-gray-400 bg-white flex items-center justify-center transition-colors peer-checked:border-[#1a6cff] after:content-[''] after:h-2 after:w-2 after:rounded-full after:bg-[#1a6cff] after:opacity-0 peer-checked:after:opacity-100" />
                                                        <span className="text-[13px] text-[#32325d]">{column.label}</span>
                                                    </label>
                                                    {isLocked && (
                                                        <span className="text-[11px] font-semibold text-[#8792a2] uppercase">
                                                            Fija
                                                        </span>
                                                    )}
                                                    </div>
                                                    {!isLocked && column.visible && visibleConfigurableCount <= 1 && (
                                                        <span className="text-[11px] text-[#8792a2]">
                                                            Debe quedar al menos una visible
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="text-[12px] font-semibold text-[#635bff] uppercase tracking-wide">
                                    Orden
                                </div>
                                {draftColumns.length === 0 ? (
                                    <p className="text-[13px] text-[#8792a2]">
                                        No hay columnas disponibles.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {!hasConfigurableColumns && (
                                            <p className="text-[13px] text-[#8792a2]">
                                                No hay columnas configurables.
                                            </p>
                                        )}
                                        {draftColumns.map((column) => {
                                            const isLocked = column.locked;
                                            const index = reorderableKeys.indexOf(column.key);
                                            const canMoveUp = !isLocked && index > 0;
                                            const canMoveDown = !isLocked && index !== -1 && index < reorderableKeys.length - 1;

                                            return (
                                                <div
                                                    key={column.key}
                                                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[13px] text-[#32325d]">{column.label}</span>
                                                        {isLocked && (
                                                            <span className="text-[11px] font-semibold text-[#8792a2] uppercase">
                                                                Fija al final
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => moveColumn(column.key, "up")}
                                                            disabled={!canMoveUp}
                                                            className={cn(
                                                                "h-8 w-8 rounded-md border border-gray-200 text-[#4f5b76] transition-colors",
                                                                canMoveUp ? "hover:text-[#32325d] hover:border-gray-300" : "opacity-40"
                                                            )}
                                                            aria-label={`Subir ${column.label}`}
                                                        >
                                                            <ArrowUp className="h-4 w-4 mx-auto" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => moveColumn(column.key, "down")}
                                                            disabled={!canMoveDown}
                                                            className={cn(
                                                                "h-8 w-8 rounded-md border border-gray-200 text-[#4f5b76] transition-colors",
                                                                canMoveDown ? "hover:text-[#32325d] hover:border-gray-300" : "opacity-40"
                                                            )}
                                                            aria-label={`Bajar ${column.label}`}
                                                        >
                                                            <ArrowDown className="h-4 w-4 mx-auto" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-md border-gray-200"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        className="rounded-md bg-[#635bff] text-white hover:bg-[#5851e0]"
                        onClick={handleSave}
                        disabled={isLoading || draftColumns.length === 0}
                    >
                        Guardar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
