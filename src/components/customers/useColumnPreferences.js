import { useEffect, useState } from "react";

/**
 * @typedef {"name" | "email" | "createdAt" | "type" | "balance" | "status" | "actions"} ColumnKey
 *
 * @typedef {Object} ColumnConfig
 * @property {ColumnKey} key
 * @property {string} label
 * @property {boolean} visible
 * @property {boolean} [locked]
 */

const buildVisibilityMap = (columns) =>
    columns.reduce((acc, column) => {
        acc[column.key] = column.visible;
        return acc;
    }, {});

const normalizeColumns = (defaultColumns, stored) => {
    const defaultMap = new Map(defaultColumns.map((column) => [column.key, column]));
    const defaultOrder = defaultColumns.map((column) => column.key);
    const storedOrder = Array.isArray(stored?.order) ? stored.order : defaultOrder;
    const storedVisible = stored?.visible && typeof stored.visible === "object" ? stored.visible : {};

    const order = [];
    storedOrder.forEach((key) => {
        if (defaultMap.has(key) && !order.includes(key)) {
            order.push(key);
        }
    });
    defaultOrder.forEach((key) => {
        if (!order.includes(key)) {
            order.push(key);
        }
    });

    let columns = order.map((key) => {
        const base = defaultMap.get(key);
        const locked = Boolean(base.locked);
        const storedValue = storedVisible[key];
        const visible = locked ? true : typeof storedValue === "boolean" ? storedValue : base.visible;
        return { ...base, locked, visible };
    });

    const actionIndex = columns.findIndex((column) => column.key === "actions");
    if (actionIndex !== -1 && actionIndex !== columns.length - 1) {
        const actionColumn = columns[actionIndex];
        columns = [...columns.slice(0, actionIndex), ...columns.slice(actionIndex + 1), actionColumn];
    }

    const configurableVisibleCount = columns.filter((column) => !column.locked && column.visible).length;
    if (configurableVisibleCount === 0) {
        const firstConfigurable = columns.find((column) => !column.locked);
        if (firstConfigurable) {
            columns = columns.map((column) =>
                column.key === firstConfigurable.key ? { ...column, visible: true } : column
            );
        }
    }

    return columns;
};

export default function useColumnPreferences({ storageKey, defaultColumns }) {
    const [columns, setColumns] = useState(null);

    useEffect(() => {
        if (typeof window === "undefined") {
            setColumns(defaultColumns);
            return;
        }

        const raw = window.localStorage.getItem(storageKey);
        let stored = null;
        if (raw) {
            try {
                stored = JSON.parse(raw);
            } catch (error) {
                stored = null;
            }
        }
        setColumns(normalizeColumns(defaultColumns, stored));
    }, [defaultColumns, storageKey]);

    const persistColumns = (nextColumns) => {
        const normalized = normalizeColumns(defaultColumns, {
            order: nextColumns.map((column) => column.key),
            visible: buildVisibilityMap(nextColumns)
        });
        setColumns(normalized);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(
                storageKey,
                JSON.stringify({
                    order: normalized.map((column) => column.key),
                    visible: buildVisibilityMap(normalized)
                })
            );
        }
    };

    const resetColumns = () => {
        const normalized = normalizeColumns(defaultColumns, null);
        setColumns(normalized);
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(storageKey);
        }
    };

    return {
        columns,
        isLoading: columns === null,
        setColumns: persistColumns,
        resetColumns
    };
}
