import React, { useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";

export const processTransfer = async (options) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    void options;
};

export default function TransferModal({
    open,
    onOpenChange
}) {
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const persistTransfer = (transfer) => {
        if (typeof window === "undefined") return;
        const key = "antillapay_transfers";
        try {
            const stored = window.localStorage.getItem(key);
            const parsed = stored ? JSON.parse(stored) : [];
            const next = [transfer, ...(Array.isArray(parsed) ? parsed : [])];
            window.localStorage.setItem(key, JSON.stringify(next));
            window.dispatchEvent(new CustomEvent("antillapay_transfers_updated"));
        } catch {
            window.localStorage.setItem(key, JSON.stringify([transfer]));
            window.dispatchEvent(new CustomEvent("antillapay_transfers_updated"));
        }
    };

    const handleTransfer = async () => {
        if (!email || !amount) {
            toast.error("Por favor completa todos los campos");
            return;
        }

        if (!email.includes("@")) {
            toast.error("Por favor ingresa un correo electrónico válido");
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error("Por favor ingresa un monto válido");
            return;
        }

        setIsProcessing(true);
        try {
            await processTransfer({
                email,
                amount: numAmount
            });

            const now = new Date().toISOString();
            persistTransfer({
                id: `tr_${Date.now()}`,
                email,
                amount: numAmount,
                grossAmount: numAmount,
                netAmount: numAmount,
                currency: "USD",
                status: "pendiente",
                date: now,
                createdAt: now,
                executedAt: null,
                failedAt: null,
                destination: `Transferencia a ${email}`,
                failureReason: null
            });

            toast.success("Transferencia procesada exitosamente");
            setEmail("");
            setAmount("");
            onOpenChange(false);
        } catch (error) {
            toast.error("Error al procesar la transferencia");
        } finally {
            setIsProcessing(false);
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
                            Nueva transferencia
                        </h3>
                        <p className="text-[13px] text-[#6b7280] mt-1">
                            Ingresa los datos para realizar una transferencia.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl border border-transparent p-1.5 text-[#9ca3af] hover:text-[#4b5563]"
                        aria-label="Cerrar"
                        disabled={isProcessing}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-6">
                    <div>
                        <label htmlFor="email" className="text-[13px] font-semibold text-[#32325d] mb-2 block">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@correo.com"
                            className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent"
                            disabled={isProcessing}
                        />
                    </div>

                    <div>
                        <label htmlFor="amount" className="text-[13px] font-semibold text-[#32325d] mb-2 block">
                            Monto
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#6b7280]">
                                $
                            </span>
                            <input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-7 pr-3 py-2 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent"
                                disabled={isProcessing}
                            />
                        </div>
                    </div>

                    <div className="bg-[#f7f9fc] p-4 rounded-xl border border-gray-100">
                        <p className="text-[12px] text-[#4f5b76] leading-relaxed">
                            La transferencia se procesará de forma inmediata y el destinatario recibirá una notificación por correo electrónico.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-[13px] font-semibold text-[#374151] hover:bg-gray-50"
                        disabled={isProcessing}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleTransfer}
                        disabled={isProcessing}
                        className={`rounded-lg px-4 py-2 text-[13px] font-semibold text-white flex items-center ${isProcessing
                            ? "bg-[#c4c7ff] cursor-not-allowed"
                            : "bg-[#635bff] hover:bg-[#5851e0]"
                            }`}
                    >
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Transferir
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
