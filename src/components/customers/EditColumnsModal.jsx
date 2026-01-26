import React, { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
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
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <DialogTitle>Editar columnas</DialogTitle>
                            <DialogDescription>
                                Controla qué columnas se muestran y en qué orden aparecen.
                            </DialogDescription>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-[12px] text-[#635bff] hover:text-[#5851e0]"
                            onClick={handleReset}
                            disabled={isLoading}
                        >
                            Restablecer
                        </Button>
                    </div>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-10 text-center text-[13px] text-[#8792a2]">
                        Cargando preferencias...
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="text-[12px] font-semibold text-[#4f5b76] uppercase tracking-wide">
                                Visibilidad
                            </div>
                            {draftColumns.length === 0 ? (
                                <p className="text-[13px] text-[#8792a2]">
                                    No hay columnas disponibles.
                                </p>
                            ) : (
                                <div className="space-y-3">
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
                                                    <Checkbox
                                                        id={`visibility-${column.key}`}
                                                        checked={column.visible}
                                                        disabled={disableToggle}
                                                        onCheckedChange={() => handleToggleVisibility(column.key)}
                                                    />
                                                    <Label htmlFor={`visibility-${column.key}`} className="text-[13px] text-[#32325d]">
                                                        {column.label}
                                                    </Label>
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

                        <div className="space-y-3">
                            <div className="text-[12px] font-semibold text-[#4f5b76] uppercase tracking-wide">
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
                                                    <GripVertical className="h-4 w-4 text-[#aab2c4]" />
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

                <DialogFooter className="gap-2">
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
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
