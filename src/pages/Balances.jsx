import React, { useState } from "react";
import {
    ArrowLeftRight,
    Banknote,
    Check,
    ChevronDown,
    Clock,
    CreditCard,
    DollarSign,
    ExternalLink,
    HelpCircle,
    Info,
    MoreHorizontal,
    Plus,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const INITIAL_TRANSFERS = [
    {
        id: "tr_001",
        amount: 450.00,
        status: "completada",
        date: "2026-01-15T10:30:00Z",
        destination: "Banco Metropolitano ****4567",
        type: "Manual"
    },
    {
        id: "tr_002",
        amount: 120.50,
        status: "pendiente",
        date: "2026-01-20T14:45:00Z",
        destination: "Banco de Crédito ****8821",
        type: "Manual"
    },
    {
        id: "tr_003",
        amount: 890.00,
        status: "fallida",
        date: "2026-01-10T09:15:00Z",
        destination: "Banco Metropolitano ****4567",
        type: "Automática"
    }
];

const INITIAL_BANK_ACCOUNTS = [
    {
        id: "ba_001",
        bankName: "Banco Metropolitano",
        last4: "4567",
        isDefault: true,
        holderName: "Clara Alvarez",
        currency: "USD"
    },
    {
        id: "ba_002",
        bankName: "Banco de Crédito",
        last4: "8821",
        isDefault: false,
        holderName: "Clara Alvarez",
        currency: "USD"
    }
];

const STATUS_STYLES = {
    completada: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pendiente: "bg-amber-50 text-amber-700 border-amber-200",
    procesando: "bg-blue-50 text-blue-700 border-blue-200",
    fallida: "bg-rose-50 text-rose-700 border-rose-200"
};

const formatCurrency = (value) => `${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})} US$`;

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

export default function BalancesPage() {
    const [transfers, setTransfers] = useState(INITIAL_TRANSFERS);
    const [bankAccounts, setBankAccounts] = useState(INITIAL_BANK_ACCOUNTS);
    const [availableBalance] = useState(1240.50);
    const [pendingBalance] = useState(350.25);

    // Modals
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isManageBanksModalOpen, setIsManageBanksModalOpen] = useState(false);
    const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

    // Form states
    const [transferAmount, setTransferAmount] = useState("");
    const [selectedBankId, setSelectedBankId] = useState(bankAccounts.find(b => b.isDefault)?.id || "");
    const [newBankName, setNewBankName] = useState("");
    const [newBankLast4, setNewBankLast4] = useState("");
    const [transferType, setTransferType] = useState("manual");

    const handleTransfer = () => {
        if (!transferAmount || isNaN(transferAmount) || parseFloat(transferAmount) <= 0) return;

        const selectedBank = bankAccounts.find(b => b.id === selectedBankId);
        const newTransfer = {
            id: `tr_${Date.now()}`,
            amount: parseFloat(transferAmount),
            status: "procesando",
            date: new Date().toISOString(),
            destination: `${selectedBank?.bankName} ****${selectedBank?.last4}`,
            type: "Manual"
        };

        setTransfers([newTransfer, ...transfers]);
        setIsTransferModalOpen(false);
        setTransferAmount("");
    };

    const handleAddBank = () => {
        if (!newBankName || !newBankLast4) return;

        const newBank = {
            id: `ba_${Date.now()}`,
            bankName: newBankName,
            last4: newBankLast4,
            isDefault: bankAccounts.length === 0,
            holderName: "Clara Alvarez",
            currency: "USD"
        };

        setBankAccounts([...bankAccounts, newBank]);
        setIsAddBankModalOpen(false);
        setNewBankName("");
        setNewBankLast4("");
    };

    const setDefaultBank = (id) => {
        setBankAccounts(prev => prev.map(bank => ({
            ...bank,
            isDefault: bank.id === id
        })));
    };

    const removeBank = (id) => {
        setBankAccounts(prev => prev.filter(bank => bank.id !== id));
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-[28px] font-bold text-[#32325d]">
                    <h1>Saldos {formatCurrency(availableBalance)}</h1>
                    <HelpCircle className="w-5 h-5 text-[#aab2c4] cursor-help" />
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsTransferModalOpen(true)}
                        className="h-8 rounded-md bg-white border border-gray-200 text-[#32325d] text-[13px] font-semibold hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
                    >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        Transferir
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="h-8 rounded-md bg-white border border-gray-200 text-[#32325d] text-[13px] font-semibold hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
                            >
                                Gestionar las transferencias
                                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[280px] rounded-xl p-1 shadow-xl border-gray-100">
                            <DropdownMenuItem
                                onClick={() => setIsCalendarModalOpen(true)}
                                className="rounded-lg py-2.5 text-[14px] text-[#32325d] cursor-pointer"
                            >
                                Gestionar calendario de transferencias
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setIsManageBanksModalOpen(true)}
                                className="rounded-lg py-2.5 text-[14px] text-[#32325d] cursor-pointer"
                            >
                                Gestionar cuentas bancarias
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                <div className="space-y-12">
                    {/* Balance Summary */}
                    <section className="space-y-6">
                        <h2 className="text-[17px] font-bold text-[#32325d]">Resumen del saldo</h2>

                        <div className="space-y-0 relative">
                            {/* Horizontal Bar Visualizer */}
                            <div className="h-2 w-full bg-[#e3e8ee] rounded-full overflow-hidden mb-6">
                                <div
                                    className="h-full bg-[#635bff]"
                                    style={{ width: `${(availableBalance / (availableBalance + pendingBalance)) * 100}%` }}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded bg-[#aab2c4]" />
                                        <span className="text-[14px] text-[#4f5b76]">Entrante</span>
                                    </div>
                                    <span className="text-[14px] font-semibold text-[#32325d]">{formatCurrency(pendingBalance)}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded bg-[#635bff]" />
                                        <span className="text-[14px] text-[#4f5b76]">Disponible</span>
                                    </div>
                                    <span className="text-[14px] font-semibold text-[#32325d]">{formatCurrency(availableBalance)}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Recent Activity */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-100">
                            <div className="flex gap-8">
                                <button className="pb-3 text-[14px] font-semibold text-[#635bff] border-b-2 border-[#635bff]">
                                    Transferencias
                                </button>
                                <button className="pb-3 text-[14px] font-semibold text-[#4f5b76] hover:text-[#32325d] transition-colors">
                                    Recargas
                                </button>
                                <button className="pb-3 text-[14px] font-semibold text-[#4f5b76] hover:text-[#32325d] transition-colors">
                                    Toda la actividad
                                </button>
                            </div>
                        </div>

                        {transfers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                                <p className="text-[14px] text-[#8792a2]">No se han encontrado transferencias</p>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead className="px-6 py-3 text-[12px] font-bold text-[#8792a2] uppercase tracking-wider">Importe</TableHead>
                                            <TableHead className="py-3 text-[12px] font-bold text-[#8792a2] uppercase tracking-wider">Estado</TableHead>
                                            <TableHead className="py-3 text-[12px] font-bold text-[#8792a2] uppercase tracking-wider">Fecha</TableHead>
                                            <TableHead className="py-3 text-[12px] font-bold text-[#8792a2] uppercase tracking-wider">Destino</TableHead>
                                            <TableHead className="pr-6 py-3 text-right" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transfers.map((transfer) => (
                                            <TableRow key={transfer.id} className="hover:bg-gray-50 transition-colors">
                                                <TableCell className="px-6 py-4 text-[14px] font-semibold text-[#32325d]">
                                                    {formatCurrency(transfer.amount)}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge variant="outline" className={cn("text-[11px] font-bold uppercase tracking-wider px-2 py-0.5", STATUS_STYLES[transfer.status])}>
                                                        {transfer.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 text-[13px] text-[#4f5b76]">
                                                    {formatDate(transfer.date)}
                                                </TableCell>
                                                <TableCell className="py-4 text-[13px] text-[#4f5b76]">
                                                    {transfer.destination}
                                                </TableCell>
                                                <TableCell className="pr-6 py-4 text-right">
                                                    <button className="text-[#aab2c4] hover:text-[#32325d] transition-colors">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Links */}
                <div className="space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-[13px] font-bold text-[#8792a2] uppercase tracking-wider">Informes</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#635bff]/10 transition-colors">
                                    <Clock className="w-4 h-4 text-gray-500 group-hover:text-[#635bff]" />
                                </div>
                                <div className="text-left">
                                    <div className="text-[13px] font-semibold text-[#32325d]">Resumen del saldo</div>
                                    <div className="text-[11px] text-[#8792a2]">ene 2026</div>
                                </div>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#635bff]/10 transition-colors">
                                    <ArrowLeftRight className="w-4 h-4 text-gray-500 group-hover:text-[#635bff]" />
                                </div>
                                <div className="text-left">
                                    <div className="text-[13px] font-semibold text-[#32325d]">Conciliación de transferencias</div>
                                </div>
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            {/* Modal: Transfer / Withdraw */}
            <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[20px] font-bold text-[#32325d]">Transferir a la cuenta bancaria</h2>
                            <button onClick={() => setIsTransferModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-[#4f5b76]">Importe</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#32325d] font-semibold">US$</div>
                                    <input
                                        type="number"
                                        value={transferAmount}
                                        onChange={(e) => setTransferAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all text-[16px] font-medium"
                                    />
                                    <button
                                        onClick={() => setTransferAmount(availableBalance.toString())}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#635bff] hover:text-[#5851e0]"
                                    >
                                        USAR MÁXIMO
                                    </button>
                                </div>
                                <p className="text-[12px] text-[#8792a2]">Máximo disponible: {formatCurrency(availableBalance)}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-[#4f5b76]">Enviar a</label>
                                <div className="space-y-2">
                                    {bankAccounts.map((account) => (
                                        <button
                                            key={account.id}
                                            onClick={() => setSelectedBankId(account.id)}
                                            className={cn(
                                                "w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group",
                                                selectedBankId === account.id
                                                    ? "border-[#635bff] bg-[#f5f3ff] shadow-sm"
                                                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                                    selectedBankId === account.id ? "bg-white shadow-sm" : "bg-gray-100"
                                                )}>
                                                    <CreditCard className={cn("w-5 h-5", selectedBankId === account.id ? "text-[#635bff]" : "text-gray-400")} />
                                                </div>
                                                <div>
                                                    <div className="text-[14px] font-semibold text-[#32325d]">{account.bankName}</div>
                                                    <div className="text-[12px] text-[#4f5b76]">**** {account.last4} • {account.holderName}</div>
                                                </div>
                                            </div>
                                            {selectedBankId === account.id && (
                                                <div className="w-5 h-5 rounded-full bg-[#635bff] flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setIsAddBankModalOpen(true)}
                                        className="w-full p-4 rounded-xl border border-dashed border-gray-200 text-[#635bff] font-semibold text-[14px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Añadir cuenta bancaria
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f7f9fc] p-8 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-[12px] text-[#697386]">
                            <Info className="w-4 h-4" />
                            <span>Las transferencias tardan de 1 a 3 días hábiles.</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => setIsTransferModalOpen(false)}
                                variant="outline"
                                className="h-10 px-6 rounded-lg text-[14px] font-bold text-[#4f5b76]"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleTransfer}
                                disabled={!transferAmount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > availableBalance}
                                className="h-10 px-6 rounded-lg bg-[#635bff] hover:bg-[#5851e0] text-white text-[14px] font-bold shadow-lg shadow-[#635bff]/20"
                            >
                                Transferir fondos
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal: Manage Bank Accounts */}
            <Dialog open={isManageBanksModalOpen} onOpenChange={setIsManageBanksModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[20px] font-bold text-[#32325d]">Cuentas bancarias</h2>
                            <button onClick={() => setIsManageBanksModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {bankAccounts.length === 0 ? (
                            <div className="text-center py-12 space-y-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                    <CreditCard className="w-8 h-8 text-[#aab2c4]" />
                                </div>
                                <p className="text-[14px] text-[#4f5b76]">No se han añadido cuentas bancarias</p>
                                <Button
                                    onClick={() => setIsAddBankModalOpen(true)}
                                    variant="outline"
                                    className="h-10 px-4 rounded-lg flex items-center gap-2 mx-auto"
                                >
                                    <Plus className="w-4 h-4" />
                                    Añadir cuenta bancaria
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {bankAccounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="p-4 rounded-xl border border-gray-100 flex items-center justify-between bg-white hover:border-[#cbd5f5] transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                                <CreditCard className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[14px] font-semibold text-[#32325d]">{account.bankName}</span>
                                                    {account.isDefault && (
                                                        <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] uppercase font-bold px-1.5 py-0">Predeterminada</Badge>
                                                    )}
                                                </div>
                                                <div className="text-[12px] text-[#4f5b76]">**** {account.last4} • {account.currency}</div>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="text-[#aab2c4] hover:text-[#32325d] transition-colors p-1">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[200px] rounded-xl p-1 shadow-xl">
                                                {!account.isDefault && (
                                                    <DropdownMenuItem onClick={() => setDefaultBank(account.id)} className="rounded-lg py-2 text-[14px] text-[#32325d] cursor-pointer">
                                                        Marcar predeterminada
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem onClick={() => removeBank(account.id)} className="rounded-lg py-2 text-[14px] text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer">
                                                    Eliminar cuenta
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))}
                                <Button
                                    onClick={() => setIsAddBankModalOpen(true)}
                                    variant="ghost"
                                    className="w-full h-12 rounded-xl border-2 border-dashed border-gray-100 text-[#635bff] font-semibold hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Añadir otra cuenta
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#f7f9fc] p-6 flex justify-end">
                        <Button
                            onClick={() => setIsManageBanksModalOpen(false)}
                            className="bg-[#635bff] hover:bg-[#5851e0] text-white h-10 px-8 rounded-lg font-bold"
                        >
                            Hecho
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal: Add Bank Account */}
            <Dialog open={isAddBankModalOpen} onOpenChange={setIsAddBankModalOpen}>
                <DialogContent className="sm:max-w-[460px] rounded-3xl p-8 border-none shadow-2xl">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-[20px] font-bold text-[#32325d]">Añadir cuenta bancaria</DialogTitle>
                        <DialogDescription className="text-[14px] text-[#4f5b76]">
                            Introduce los datos de la cuenta bancaria donde recibirás tus fondos.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-[#4f5b76]">Nombre del banco</label>
                            <input
                                value={newBankName}
                                onChange={(e) => setNewBankName(e.target.value)}
                                placeholder="Ej. Banco Metropolitano"
                                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#635bff]/10 focus:border-[#635bff] transition-all text-[14px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-[#4f5b76]">Últimos 4 dígitos</label>
                            <input
                                value={newBankLast4}
                                onChange={(e) => setNewBankLast4(e.target.value)}
                                maxLength={4}
                                placeholder="0000"
                                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#635bff]/10 focus:border-[#635bff] transition-all text-[14px]"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3">
                        <Button
                            onClick={() => setIsAddBankModalOpen(false)}
                            variant="outline"
                            className="h-10 px-6 rounded-lg font-semibold"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleAddBank}
                            disabled={!newBankName || !newBankLast4}
                            className="h-10 px-8 rounded-lg bg-[#635bff] hover:bg-[#5851e0] text-white font-bold"
                        >
                            Guardar cuenta
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal: Transfer Calendar */}
            <Dialog open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
                <DialogContent className="sm:max-w-[540px] rounded-3xl p-8 border-none shadow-2xl overflow-hidden">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-[22px] font-bold text-[#32325d]">Calendario de transferencias</h2>
                            <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                                Define un calendario personalizado para la transferencia de fondos a tu cuenta bancaria.{" "}
                                <a href="#" className="text-[#635bff] font-semibold hover:underline">Consultar documentación</a>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <label
                                onClick={() => setTransferType("manual")}
                                className={cn(
                                    "flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all",
                                    transferType === "manual" ? "border-[#635bff] bg-[#f5f3ff]" : "border-gray-100 hover:bg-gray-50"
                                )}
                            >
                                <div className={cn(
                                    "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    transferType === "manual" ? "border-[#635bff] bg-[#635bff]" : "border-gray-300"
                                )}>
                                    {transferType === "manual" && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[15px] font-bold text-[#32325d]">Transferencias manuales</div>
                                    <div className="text-[13px] text-[#4f5b76]">Envía transferencias cuando quieras.</div>
                                </div>
                            </label>

                            <label
                                onClick={() => setTransferType("auto")}
                                className={cn(
                                    "flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all",
                                    transferType === "auto" ? "border-[#635bff] bg-[#f5f3ff]" : "border-gray-100 hover:bg-gray-50"
                                )}
                            >
                                <div className={cn(
                                    "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    transferType === "auto" ? "border-[#635bff] bg-[#635bff]" : "border-gray-300"
                                )}>
                                    {transferType === "auto" && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div className="space-y-1">
                                        <div className="text-[15px] font-bold text-[#32325d]">Transferencias automáticas</div>
                                        <div className="text-[13px] text-[#4f5b76]">
                                            Recibe transferencias de forma periódica. Ya sea semanal o mensualmente, puedes seleccionar más de un día de transferencias durante esos periodos.
                                        </div>
                                    </div>

                                    {transferType === "auto" && (
                                        <div className="w-full max-w-[200px]">
                                            <div className="relative">
                                                <select className="w-full h-10 pl-4 pr-10 rounded-xl border border-gray-200 bg-white appearance-none text-[14px] font-medium text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#635bff]/10">
                                                    <option>Diarias</option>
                                                    <option>Semanales</option>
                                                    <option>Mensuales</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </label>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                            <Button
                                onClick={() => setIsCalendarModalOpen(false)}
                                variant="outline"
                                className="h-10 px-6 rounded-lg font-semibold text-[#4f5b76]"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => setIsCalendarModalOpen(false)}
                                className="h-10 px-8 rounded-lg bg-[#635bff] hover:bg-[#5851e0] text-white font-bold"
                            >
                                Guardar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
