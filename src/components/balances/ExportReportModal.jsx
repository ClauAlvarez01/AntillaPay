import React, { useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";

/**
 * @param {Object} options
 * @returns {Promise<void>}
 */
export const exportReport = async (options) => {
    // Stub for backend integration.
    await new Promise((resolve) => setTimeout(resolve, 800));
    void options;
};

export default function ExportReportModal({
    open,
    onOpenChange,
    reportName = "Resumen del saldo"
}) {
    const [format, setFormat] = useState("csv");
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportReport({
                format,
                reportName
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
                className="w-[95%] sm:max-w-[500px] rounded-2xl border border-gray-200 p-0 max-h-[85vh] overflow-y-auto [&>button]:hidden"
            >
                <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                    <div>
                        <h3 className="text-[18px] font-semibold text-[#1a1f36]">
                            Exportar {reportName}
                        </h3>
                        <p className="text-[13px] text-[#6b7280] mt-1">
                            Elige el formato para exportar los datos de este informe.
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

                    <div className="bg-[#f7f9fc] p-4 rounded-xl border border-gray-100">
                        <p className="text-[12px] text-[#4f5b76] leading-relaxed">
                            Este informe se exportará con la zona horaria <span className="font-bold">America - Havana (GMT-5)</span> y el intervalo de fechas <span className="font-bold">25 ene 2026 – 25 ene 2026</span>.
                        </p>
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
                        disabled={isExporting}
                        className={`rounded-lg px-4 py-2 text-[13px] font-semibold text-white ${isExporting
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
