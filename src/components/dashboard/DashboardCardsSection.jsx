import React, { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    Info,
    TrendingUp,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import {
    computeDashboardMetrics,
    generateMockPayments
} from "@/lib/dashboardMetrics";

const formatCount = (value) => value.toLocaleString("es-ES");

const formatUsd = (value) => `${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})} US$`;

const formatPercent = (value) => `${value.toLocaleString("es-ES", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
})}%`;

const formatRatio = (value) => value.toLocaleString("es-ES", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
});

const getDeltaMeta = (current, previous) => {
    if (!previous) {
        return { label: "—", trend: "neutral" };
    }
    const diff = current - previous;
    if (diff === 0) {
        return { label: "0,0%", trend: "neutral" };
    }
    const percent = Math.abs((diff / previous) * 100);
    const formatted = percent.toLocaleString("es-ES", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
    return {
        label: `${diff > 0 ? "+" : "-"}${formatted}%`,
        trend: diff > 0 ? "positive" : "negative"
    };
};

const CardShell = ({ children, className }) => (
    <div className={cn("bg-white border border-gray-100 rounded-xl p-6 shadow-sm h-full overflow-hidden", className)}>
        {children}
    </div>
);

const CardHeader = ({ title, tooltip, action }) => (
    <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-[#32325d]">{title}</span>
            {tooltip && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                aria-label={`Definicion de ${title}`}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Info className="h-3.5 w-3.5" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>{tooltip}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
        {action}
    </div>
);

const CardDelta = ({ delta }) => {
    const tone = {
        positive: "text-emerald-600",
        negative: "text-rose-500",
        neutral: "text-gray-400"
    }[delta.trend || "neutral"];

    return (
        <div className="mt-1 flex items-center gap-2">
            <span className={cn("text-[12px] font-semibold", tone)}>{delta.label}</span>
            <span className="text-[12px] text-[#aab2c4]">vs ayer</span>
        </div>
    );
};

const CardState = ({ title, description, actionLabel, onAction, icon: Icon }) => (
    <div className="flex flex-1 flex-col items-center justify-center text-center text-[#4f5b76] gap-2">
        {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f4f5f7]">
                <Icon className="h-4 w-4 text-[#aab2c4]" />
            </div>
        )}
        <div className="text-[14px] font-semibold text-[#32325d]">{title}</div>
        <p className="text-[12px] text-[#697386] max-w-[220px]">{description}</p>
        {actionLabel && (
            <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onAction}
                className="rounded-lg border-gray-200 text-[12px]"
            >
                {actionLabel}
            </Button>
        )}
    </div>
);

const MetricCardSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-20" />
        <div className="space-y-2">
            {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-3 w-full" />
            ))}
        </div>
    </div>
);

const MetricCard = ({
    title,
    tooltip,
    value,
    delta,
    items,
    status,
    emptyState,
    onMoreInfo,
    onRetry
}) => (
    <CardShell className="flex flex-col min-h-[320px]">
        <CardHeader
            title={title}
            tooltip={tooltip}
            action={
                onMoreInfo && (
                    <button
                        type="button"
                        onClick={onMoreInfo}
                        className="text-[12px] text-[#aab2c4] hover:text-[#635bff] font-semibold"
                    >
                        Mas informacion
                    </button>
                )
            }
        />
        {status === "loading" && <MetricCardSkeleton />}
        {status === "error" && (
            <CardState
                icon={AlertTriangle}
                title="No se pudieron cargar los datos"
                description="Revisa la conexion o intenta de nuevo."
                actionLabel="Reintentar"
                onAction={onRetry}
            />
        )}
        {status === "empty" && (
            <CardState
                icon={TrendingUp}
                title={emptyState.title}
                description={emptyState.description}
                actionLabel={emptyState.actionLabel}
                onAction={emptyState.onAction}
            />
        )}
        {status === "ready" && (
            <div className="mt-4 flex flex-1 flex-col">
                <div className="text-[20px] sm:text-[26px] font-semibold text-[#32325d] truncate" title={value}>{value}</div>
                <CardDelta delta={delta} />
                <div className="mt-6 space-y-3">
                    {items.map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-[12px] text-[#4f5b76] gap-2">
                            <span className="truncate flex-1">{item.label}</span>
                            <span className="font-semibold text-[#32325d] shrink-0">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </CardShell>
);

const ListCardSkeleton = () => (
    <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-24" />
        <div className="space-y-3">
            {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2 w-full" />
                </div>
            ))}
        </div>
    </div>
);

const ListCard = ({
    title,
    tooltip,
    value,
    delta,
    items,
    status,
    emptyState,
    onMoreInfo,
    onRetry
}) => {
    const maxValue = items.length ? Math.max(...items.map((item) => item.rawValue)) : 0;

    return (
        <CardShell className="flex flex-col min-h-[320px]">
            <CardHeader
                title={title}
                tooltip={tooltip}
                action={
                    onMoreInfo && (
                        <button
                            type="button"
                            onClick={onMoreInfo}
                            className="text-[12px] text-[#aab2c4] hover:text-[#635bff] font-semibold"
                        >
                            Mas informacion
                        </button>
                    )
                }
            />
            {status === "loading" && <ListCardSkeleton />}
            {status === "error" && (
                <CardState
                    icon={AlertTriangle}
                    title="No se pudieron cargar los datos"
                    description="Revisa la conexion o intenta de nuevo."
                    actionLabel="Reintentar"
                    onAction={onRetry}
                />
            )}
            {status === "empty" && (
                <CardState
                    icon={Users}
                    title={emptyState.title}
                    description={emptyState.description}
                    actionLabel={emptyState.actionLabel}
                    onAction={emptyState.onAction}
                />
            )}
            {status === "ready" && (
                <div className="mt-4 flex flex-1 flex-col">
                    <div className="text-[20px] sm:text-[26px] font-semibold text-[#32325d] truncate" title={value}>{value}</div>
                    <CardDelta delta={delta} />
                    <div className="mt-6 space-y-4">
                        {items.map((item) => (
                            <div key={item.label} className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-semibold text-[#32325d] truncate" title={item.label}>{item.label}</div>
                                    <div className="mt-2 h-1.5 w-full rounded-lg bg-gray-100 overflow-hidden">
                                        <div
                                            className="h-full rounded-lg bg-[#635bff]"
                                            style={{
                                                width: `${maxValue ? (item.rawValue / maxValue) * 100 : 0}%`
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="text-[12px] font-semibold text-[#32325d] shrink-0">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </CardShell>
    );
};

const ErrorBreakdownCard = ({
    title,
    tooltip,
    errors,
    status,
    emptyState,
    onMoreInfo,
    onRetry
}) => (
    <CardShell className="flex flex-col min-h-[360px]">
        <CardHeader
            title={title}
            tooltip={tooltip}
            action={
                onMoreInfo && (
                    <button
                        type="button"
                        onClick={onMoreInfo}
                        className="text-[12px] text-[#aab2c4] hover:text-[#635bff] font-semibold"
                    >
                        Mas informacion
                    </button>
                )
            }
        />
        {status === "loading" && <MetricCardSkeleton />}
        {status === "error" && (
            <CardState
                icon={AlertTriangle}
                title="No se pudieron cargar los datos"
                description="Revisa la conexion o intenta de nuevo."
                actionLabel="Reintentar"
                onAction={onRetry}
            />
        )}
        {status === "empty" && (
            <CardState
                icon={AlertTriangle}
                title={emptyState.title}
                description={emptyState.description}
                actionLabel={emptyState.actionLabel}
                onAction={emptyState.onAction}
            />
        )}
        {status === "ready" && (
            <div className="mt-4 flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-[26px] font-semibold text-[#32325d]">{formatCount(errors.count)}</div>
                        <div className="text-[12px] text-[#aab2c4]">
                            Tasa de error {formatPercent(errors.rate)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[11px] text-[#697386]">Volumen rechazado</div>
                        <div className="text-[14px] font-semibold text-[#32325d]">
                            {formatUsd(errors.volume)}
                        </div>
                        <div className="text-[11px] text-[#aab2c4]">{formatCount(errors.attempts)} intentos</div>
                    </div>
                </div>
                <div className="mt-6 space-y-4">
                    {errors.breakdown.map((reason) => (
                        <div key={reason.id} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-lg" style={{ backgroundColor: reason.color }} />
                                <span className="text-[13px] text-[#32325d]">{reason.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[12px] text-[#697386] font-medium">{formatCount(reason.count)}</span>
                                <div className="w-24 h-1.5 bg-gray-100 rounded-lg overflow-hidden">
                                    <div
                                        className="h-full rounded-lg"
                                        style={{ width: `${reason.percent}%`, backgroundColor: reason.color }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </CardShell>
);

const TopProductsCard = ({
    title,
    tooltip,
    range,
    onRangeChange,
    total,
    items,
    status,
    emptyState,
    onMoreInfo,
    onRetry
}) => {
    const maxValue = items.length ? Math.max(...items.map((item) => item.total)) : 0;

    return (
        <CardShell className="flex flex-col min-h-[360px]">
            <CardHeader
                title={title}
                tooltip={tooltip}
                action={
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50/60 text-[11px] font-semibold">
                            {[
                                { id: "always", label: "Siempre" },
                                { id: "30d", label: "30 dias" }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => onRangeChange(item.id)}
                                    className={cn(
                                        "px-2.5 py-1 rounded-lg transition-colors",
                                        range === item.id
                                            ? "bg-white text-[#32325d] shadow-sm"
                                            : "text-[#8792a2] hover:text-[#32325d]"
                                    )}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        {onMoreInfo && (
                            <button
                                type="button"
                                onClick={onMoreInfo}
                                className="text-[12px] text-[#aab2c4] hover:text-[#635bff] font-semibold"
                            >
                                Mas informacion
                            </button>
                        )}
                    </div>
                }
            />
            {status === "loading" && <MetricCardSkeleton />}
            {status === "error" && (
                <CardState
                    icon={AlertTriangle}
                    title="No se pudieron cargar los datos"
                    description="Revisa la conexion o intenta de nuevo."
                    actionLabel="Reintentar"
                    onAction={onRetry}
                />
            )}
            {status === "empty" && (
                <CardState
                    icon={TrendingUp}
                    title={emptyState.title}
                    description={emptyState.description}
                    actionLabel={emptyState.actionLabel}
                    onAction={emptyState.onAction}
                />
            )}
            {status === "ready" && (
                <div className="mt-4 flex flex-1 flex-col">
                    <div className="text-[13px] text-[#697386]">Total del periodo</div>
                    <div className="text-[18px] sm:text-[22px] font-semibold text-[#32325d] truncate" title={formatUsd(total)}>{formatUsd(total)}</div>
                    <div className="mt-6 space-y-4">
                        {items.map((item) => (
                            <div key={item.productId} className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between text-[13px] text-[#32325d] font-semibold gap-2">
                                        <span className="truncate">{item.name}</span>
                                        <span className="shrink-0">{formatUsd(item.total)}</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-3">
                                        <div className="h-1.5 w-full rounded-lg bg-gray-100 overflow-hidden">
                                            <div
                                                className="h-full rounded-lg bg-[#635bff]"
                                                style={{
                                                    width: `${maxValue ? (item.total / maxValue) * 100 : 0}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-[11px] text-[#8792a2] font-semibold shrink-0">
                                            {formatPercent(item.percent)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </CardShell>
    );
};

export default function DashboardCardsSection({ referenceDate }) {
    const [status, setStatus] = useState("loading");
    const [hasError, setHasError] = useState(false);
    const [spendersRange, setSpendersRange] = useState("always");
    const [productsRange, setProductsRange] = useState("always");

    useEffect(() => {
        setStatus("loading");
        const timer = setTimeout(() => setStatus("ready"), 450);
        return () => clearTimeout(timer);
    }, [referenceDate]);

    const payments = useMemo(
        () => generateMockPayments(referenceDate ?? new Date(), 60),
        [referenceDate]
    );
    const metrics = useMemo(
        () => computeDashboardMetrics(payments, { referenceDate, topCustomersCount: 3, topSpendersCount: 5 }),
        [payments, referenceDate]
    );

    const resolvedStatus = hasError ? "error" : payments.length === 0 ? "empty" : status;

    const newCustomersDelta = getDeltaMeta(metrics.today.newCustomers, metrics.yesterday.newCustomers);
    const topCustomersDelta = getDeltaMeta(metrics.topCustomers.total, metrics.topCustomers.yesterdayTotal);
    const topProductsDelta = getDeltaMeta(metrics.topProducts.total, metrics.topProducts.yesterdayTotal);
    const topCustomersItems = metrics.topCustomers.list.map((customer) => ({
        label: customer.name,
        value: formatUsd(customer.total),
        rawValue: customer.total
    }));
    const topProductsItems = metrics.topProducts.list.map((product) => ({
        label: product.name,
        value: formatUsd(product.total),
        rawValue: product.total
    }));
    const topSpendersData =
        spendersRange === "always" ? metrics.topSpenders.all : metrics.topSpenders.last30Days;
    const topProductsData =
        productsRange === "always" ? metrics.topSpenders.all : metrics.topSpenders.last30Days;

    const handleRetry = () => {
        setHasError(false);
        setStatus("loading");
        setTimeout(() => setStatus("ready"), 450);
    };

    const handleMoreInfo = (label) => {
        window.alert(`Vista detallada: ${label}`);
    };

    const emptyState = {
        title: "Sin datos disponibles",
        description: "Agrega pagos de prueba para ver estas metricas.",
        actionLabel: "Agregar pagos",
        onAction: () => window.alert("Accion no implementada")
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
            <MetricCard
                title="Nuevos clientes"
                tooltip="Clientes cuyo primer pago exitoso ocurrio hoy."
                value={formatCount(metrics.today.newCustomers)}
                delta={newCustomersDelta}
                items={[
                    {
                        label: "Clientes recurrentes",
                        value: formatCount(metrics.today.returningCustomers)
                    },
                    {
                        label: "Pagos por cliente",
                        value: formatRatio(metrics.today.paymentsPerCustomer)
                    },
                    {
                        label: "Volumen promedio",
                        value: formatUsd(metrics.today.averageCustomerVolume)
                    }
                ]}
                status={resolvedStatus}
                emptyState={emptyState}
                onMoreInfo={() => handleMoreInfo("Nuevos clientes")}
                onRetry={handleRetry}
            />
            <ListCard
                title="Clientes con mayores pagos"
                tooltip="Suma total pagada hoy por los clientes con mayor volumen."
                value={formatUsd(metrics.topCustomers.total)}
                delta={topCustomersDelta}
                items={topCustomersItems}
                status={resolvedStatus}
                emptyState={emptyState}
                onMoreInfo={() => handleMoreInfo("Clientes con mayores pagos")}
                onRetry={handleRetry}
            />
            <ErrorBreakdownCard
                title="Errores en los pagos"
                tooltip="Transacciones fallidas hoy y sus principales causas."
                errors={metrics.errors}
                status={resolvedStatus}
                emptyState={{
                    ...emptyState,
                    title: "Sin errores registrados",
                    description: "No se detectaron errores en el periodo actual."
                }}
                onMoreInfo={() => handleMoreInfo("Errores en los pagos")}
                onRetry={handleRetry}
            />
            <TopProductsCard
                title="Productos con mayores ventas"
                tooltip="Ranking de productos por mayor volumen de ventas."
                range={productsRange}
                onRangeChange={setProductsRange}
                total={metrics.topProducts.total}
                items={metrics.topProducts.list}
                status={resolvedStatus}
                emptyState={emptyState}
                onMoreInfo={() => handleMoreInfo("Productos con mayores ventas")}
                onRetry={handleRetry}
            />
        </div>
    );
}
