import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Plus, Search, Upload, User } from "lucide-react";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import ExportCustomersModal from "@/components/customers/ExportCustomersModal";
import EditColumnsModal from "@/components/customers/EditColumnsModal";
import useColumnPreferences from "@/components/customers/useColumnPreferences";

const INITIAL_CUSTOMERS = [
    {
        id: "cus_001",
        name: "Mariana Perez",
        email: "mariana@habanamarket.cu",
        createdAt: "2026-01-18",
        type: "Empresa",
        balance: 1240.5,
        status: "Activo"
    },
    {
        id: "cus_002",
        name: "Luis Alvarez",
        email: "luis.alvarez@mail.com",
        createdAt: "2026-01-12",
        type: "Individual",
        balance: 0,
        status: "Nuevo"
    },
    {
        id: "cus_003",
        name: "Caribe Tech Solutions",
        email: "finance@caribetech.io",
        createdAt: "2025-12-28",
        type: "Empresa",
        balance: 560.75,
        status: "Activo"
    },
    {
        id: "cus_004",
        name: "Ariana Nunez",
        email: "ariana.nunez@correo.cu",
        createdAt: "2026-01-05",
        type: "Individual",
        balance: 89.25,
        status: "Moroso"
    },
    {
        id: "cus_005",
        name: "Vega Logistics",
        email: "billing@vegalogistics.com",
        createdAt: "2025-12-15",
        type: "Empresa",
        balance: 2100,
        status: "Activo"
    },
    {
        id: "cus_006",
        name: "Sofia Gomez",
        email: "sofia.gomez@outlook.com",
        createdAt: "2026-01-20",
        type: "Individual",
        balance: 35.9,
        status: "Activo"
    }
];

const STATUS_STYLES = {
    Activo: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Moroso: "bg-rose-50 text-rose-700 border-rose-200",
    Nuevo: "bg-blue-50 text-blue-700 border-blue-200"
};

const FILTERS = [
    { id: "email", label: "Correo" },
    { id: "name", label: "Nombre" },
    { id: "created", label: "Fecha de creacion" },
    { id: "type", label: "Tipo" },
    { id: "more", label: "Mas filtros" }
];

const DEFAULT_COLUMNS = [
    { key: "name", label: "Nombre", visible: true },
    { key: "email", label: "Correo", visible: true },
    { key: "createdAt", label: "Creado", visible: true },
    { key: "type", label: "Tipo", visible: true },
    { key: "balance", label: "Saldo", visible: true },
    { key: "status", label: "Estado", visible: true },
    { key: "actions", label: "Acciones", visible: true, locked: true }
];

const COLUMN_USER_ID = "anon";
const COLUMN_STORAGE_KEY = `customers_table_columns_v1_${COLUMN_USER_ID}`;

const formatDate = (value) => new Date(value).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
});

const formatCurrency = (value) => `${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})} US$`;

const FilterPill = ({ label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
            active
                ? "border-[#635bff] bg-[#635bff] text-white"
                : "border-gray-200 bg-white text-[#4f5b76] hover:border-gray-300"
        )}
    >
        <Plus className="h-3.5 w-3.5" />
        {label}
    </button>
);

const EmptyState = ({ onAdd }) => (
    <div className="flex flex-col items-center text-center gap-3 py-16">
        <div className="w-12 h-12 rounded-xl bg-[#f4f5f7] flex items-center justify-center">
            <User className="h-5 w-5 text-[#aab2c4]" />
        </div>
        <h3 className="text-[18px] font-semibold text-[#32325d]">Agrega tu primer cliente de prueba</h3>
        <p className="max-w-md text-[14px] text-[#697386]">
            Cobra a clientes con facturas unicas o recurrentes, o suscripciones.
        </p>
        <a href="#" className="text-[13px] font-semibold text-[#635bff] hover:underline">
            Aprender mas ->
        </a>
        <Button
            type="button"
            onClick={onAdd}
            className="mt-2 rounded-full bg-[#635bff] px-4 text-white hover:bg-[#5851e0]"
        >
            <Plus className="h-4 w-4" />
            Agregar un cliente de prueba
        </Button>
    </div>
);

export default function CustomersPage() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState(() => {
        if (typeof window === "undefined") return INITIAL_CUSTOMERS;
        const stored = window.localStorage.getItem("antillapay_customers");
        return stored ? JSON.parse(stored) : INITIAL_CUSTOMERS;
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [chipFilters, setChipFilters] = useState(() => ({
        email: false,
        name: false,
        created: false,
        type: false,
        more: false
    }));
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [balanceFilter, setBalanceFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("desc");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isEditColumnsOpen, setIsEditColumnsOpen] = useState(false);
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        type: "Individual"
    });
    const [selectedCustomerIds] = useState([]);
    const {
        columns,
        isLoading: isColumnsLoading,
        setColumns: setColumnPreferences
    } = useColumnPreferences({
        storageKey: COLUMN_STORAGE_KEY,
        defaultColumns: DEFAULT_COLUMNS
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem("antillapay_customers", JSON.stringify(customers));
    }, [customers]);

    const activeColumns = columns ?? DEFAULT_COLUMNS;
    const visibleColumns = activeColumns.filter((column) => column.visible || column.locked);

    const handleToggleFilter = (filterId) => {
        setChipFilters((prev) => ({
            ...prev,
            [filterId]: !prev[filterId]
        }));
    };

    const handleEditColumns = () => {
        setIsEditColumnsOpen(true);
    };

    const filteredCustomers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const onlyName = chipFilters.name && !chipFilters.email;
        const onlyEmail = chipFilters.email && !chipFilters.name;
        const recentThreshold = new Date();
        recentThreshold.setDate(recentThreshold.getDate() - 30);

        return customers
            .filter((customer) => {
                if (balanceFilter === "positive" && customer.balance <= 0) {
                    return false;
                }
                if (balanceFilter === "zero" && customer.balance !== 0) {
                    return false;
                }
                if (chipFilters.type && typeFilter !== "all" && customer.type !== typeFilter) {
                    return false;
                }
                if (chipFilters.more && statusFilter !== "all" && customer.status !== statusFilter) {
                    return false;
                }
                if (chipFilters.created && new Date(customer.createdAt) < recentThreshold) {
                    return false;
                }
                if (!query) {
                    return true;
                }
                if (onlyName) {
                    return customer.name.toLowerCase().includes(query);
                }
                if (onlyEmail) {
                    return customer.email.toLowerCase().includes(query);
                }
                return (
                    customer.name.toLowerCase().includes(query) ||
                    customer.email.toLowerCase().includes(query)
                );
            })
            .sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
            });
    }, [balanceFilter, chipFilters, customers, searchQuery, sortOrder, statusFilter, typeFilter]);

    const renderHeaderCell = (column, index) => {
        const baseClass = "text-[12px] font-semibold text-[#8792a2]";
        const isFirst = index === 0;
        const isActions = column.key === "actions";
        const headerClass = cn(
            baseClass,
            isFirst && "px-6",
            isActions && "text-right pr-6"
        );

        if (column.key === "createdAt") {
            return (
                <TableHead key={column.key} className={headerClass}>
                    <button
                        type="button"
                        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                        className="flex items-center gap-1 text-left text-[12px] font-semibold text-[#8792a2] hover:text-[#32325d]"
                    >
                        Creado
                        <span className="text-[10px]">{sortOrder === "desc" ? "↓" : "↑"}</span>
                    </button>
                </TableHead>
            );
        }

        if (isActions) {
            return (
                <TableHead key={column.key} className={headerClass}>
                    <span className="sr-only">Acciones</span>
                </TableHead>
            );
        }

        return (
            <TableHead key={column.key} className={headerClass}>
                {column.label}
            </TableHead>
        );
    };

    const renderBodyCell = (column, customer, index) => {
        const addLeftPadding = index === 0 && column.key !== "name";

        switch (column.key) {
            case "name":
                return (
                    <TableCell key={column.key} className="px-6 py-4 text-[14px] font-semibold text-[#32325d]">
                        {customer.name}
                    </TableCell>
                );
            case "email":
                return (
                    <TableCell key={column.key} className={cn("py-4 text-[13px] text-[#4f5b76]", addLeftPadding && "px-6")}>
                        {customer.email}
                    </TableCell>
                );
            case "createdAt":
                return (
                    <TableCell key={column.key} className={cn("py-4 text-[13px] text-[#4f5b76]", addLeftPadding && "px-6")}>
                        {formatDate(customer.createdAt)}
                    </TableCell>
                );
            case "type":
                return (
                    <TableCell key={column.key} className={cn("py-4 text-[13px] text-[#4f5b76]", addLeftPadding && "px-6")}>
                        {customer.type}
                    </TableCell>
                );
            case "balance":
                return (
                    <TableCell key={column.key} className={cn("py-4 text-[13px] font-semibold text-[#32325d]", addLeftPadding && "px-6")}>
                        {formatCurrency(customer.balance)}
                    </TableCell>
                );
            case "status":
                return (
                    <TableCell key={column.key} className={cn("py-4", addLeftPadding && "px-6")}>
                        <Badge
                            variant="outline"
                            className={cn("rounded-full border text-[11px]", STATUS_STYLES[customer.status])}
                        >
                            {customer.status}
                        </Badge>
                    </TableCell>
                );
            case "actions":
                return (
                    <TableCell key={column.key} className="py-4 text-right pr-6">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="text-[#aab2c4] hover:text-[#32325d] transition-colors"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[220px] rounded-xl p-1 shadow-xl border-gray-100">
                                <DropdownMenuItem
                                    onClick={() => {
                                        navigate(`/dashboard/customers/${customer.id}`, { state: { customer } });
                                    }}
                                    className="rounded-lg py-2.5 text-[14px] text-[#32325d] cursor-pointer"
                                >
                                    Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleCopyText(customer.email)}
                                    className="rounded-lg py-2.5 text-[14px] text-[#32325d] cursor-pointer"
                                >
                                    Copiar email
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleCopyText(customer.id)}
                                    className="rounded-lg py-2.5 text-[14px] text-[#32325d] cursor-pointer"
                                >
                                    Copiar ID del cliente
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                );
            default:
                return null;
        }
    };

    const handleCopyText = (value) => {
        if (!value) return;
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(value);
            return;
        }
        const input = document.createElement("input");
        input.value = value;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
    };

    const handleSaveCustomer = () => {
        if (!formState.name.trim() || !formState.email.trim()) {
            return;
        }

        const newCustomer = {
            id: `cus_${Date.now()}`,
            name: formState.name.trim(),
            email: formState.email.trim(),
            createdAt: new Date().toISOString().slice(0, 10),
            type: formState.type,
            balance: 0,
            status: "Nuevo"
        };

        setCustomers((prev) => [newCustomer, ...prev]);
        setIsDialogOpen(false);
        setFormState({ name: "", email: "", type: "Individual" });
    };

    return (
        <div className="w-full space-y-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-[28px] font-bold text-[#32325d]">Clientes</h1>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="inline-flex h-9 items-center rounded-full border border-[#635bff] bg-[#635bff] px-4 text-[13px] font-semibold text-white">
                        Todos
                    </div>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab2c4]" />
                        <Input
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Buscar clientes"
                            className="h-9 rounded-full border-gray-200 bg-white pl-10 text-[13px]"
                        />
                    </div>
                    <div className="w-full sm:w-[220px]">
                        <Select value={balanceFilter} onValueChange={setBalanceFilter}>
                            <SelectTrigger className="h-9 rounded-full border-gray-200 bg-white text-[13px]">
                                <SelectValue placeholder="Saldos pendientes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Saldos pendientes</SelectItem>
                                <SelectItem value="positive">Saldo &gt; 0</SelectItem>
                                <SelectItem value="zero">Saldo = 0</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {FILTERS.map((filter) => (
                    <FilterPill
                        key={filter.id}
                        label={filter.label}
                        active={chipFilters[filter.id]}
                        onClick={() => handleToggleFilter(filter.id)}
                    />
                ))}
                {chipFilters.type && (
                    <div className="min-w-[160px]">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="h-8 rounded-full border-gray-200 bg-white text-[12px]">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                <SelectItem value="Individual">Individual</SelectItem>
                                <SelectItem value="Empresa">Empresa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {chipFilters.more && (
                    <div className="min-w-[160px]">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-8 rounded-full border-gray-200 bg-white text-[12px]">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="Activo">Activo</SelectItem>
                                <SelectItem value="Moroso">Moroso</SelectItem>
                                <SelectItem value="Nuevo">Nuevo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[13px] text-[#697386]">
                    Mostrando {filteredCustomers.length} clientes
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                        onClick={() => setIsExportModalOpen(true)}
                    >
                        <Upload className="w-4 h-4 text-[#8792a2]" />
                        Exportar
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-[13px] font-semibold text-[#32325d] hover:border-[#cbd5f5]"
                        onClick={handleEditColumns}
                    >
                        Editar columnas
                    </Button>
                </div>
            </div>

            {customers.length === 0 ? (
                <EmptyState onAdd={() => setIsDialogOpen(true)} />
            ) : (
                <div className="rounded-2xl border border-gray-100 bg-white">
                    <div className="max-h-[520px] overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-white">
                                <TableRow className="border-b border-gray-100">
                                    {visibleColumns.map((column, index) => renderHeaderCell(column, index))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={Math.max(visibleColumns.length, 1)}
                                            className="py-12 text-center text-[13px] text-[#8792a2]"
                                        >
                                            No hay clientes que coincidan con los filtros.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <TableRow key={customer.id} className="border-b border-gray-100">
                                            {visibleColumns.map((column, index) => renderBodyCell(column, customer, index))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[460px]">
                    <DialogHeader>
                        <DialogTitle>Crear cliente</DialogTitle>
                        <DialogDescription>
                            Agrega un cliente de prueba para empezar a llevar facturas y saldos.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[12px] font-semibold text-[#4f5b76]">Nombre</label>
                            <Input
                                value={formState.name}
                                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                                placeholder="Nombre del cliente"
                                className="h-9 rounded-md border-gray-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[12px] font-semibold text-[#4f5b76]">Correo</label>
                            <Input
                                value={formState.email}
                                onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                                placeholder="nombre@correo.com"
                                className="h-9 rounded-md border-gray-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[12px] font-semibold text-[#4f5b76]">Tipo</label>
                            <Select
                                value={formState.type}
                                onValueChange={(value) => setFormState((prev) => ({ ...prev, type: value }))}
                            >
                                <SelectTrigger className="h-9 rounded-md border-gray-200">
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Individual">Individual</SelectItem>
                                    <SelectItem value="Empresa">Empresa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-md border-gray-200"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            className="rounded-md bg-[#635bff] text-white hover:bg-[#5851e0]"
                            onClick={handleSaveCustomer}
                        >
                            Guardar cliente
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <ExportCustomersModal
                open={isExportModalOpen}
                onOpenChange={setIsExportModalOpen}
                totalCount={customers.length}
                filteredCount={filteredCustomers.length}
                selectedIds={selectedCustomerIds}
            />
            <EditColumnsModal
                open={isEditColumnsOpen}
                onOpenChange={setIsEditColumnsOpen}
                columns={activeColumns}
                defaultColumns={DEFAULT_COLUMNS}
                isLoading={isColumnsLoading}
                onSave={setColumnPreferences}
            />
            <Toaster position="bottom-right" />
        </div>
    );
}
