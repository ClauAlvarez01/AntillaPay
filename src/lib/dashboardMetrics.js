/**
 * @typedef {Object} Customer
 * @property {string} id
 * @property {string} name
 * @property {number} weight
 * @property {number} startOffset
 */

/**
 * @typedef {Object} Payment
 * @property {string} id
 * @property {string} customerId
 * @property {string} customerName
 * @property {number} amount
 * @property {string} currency
 * @property {"succeeded"|"failed"} status
 * @property {string|null} failureReason
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ErrorBreakdownItem
 * @property {string} id
 * @property {string} label
 * @property {string} color
 * @property {number} count
 * @property {number} percent
 * @property {number} volume
 */

/**
 * @typedef {Object} CustomerTotal
 * @property {string} customerId
 * @property {string} name
 * @property {number} total
 * @property {number} count
 * @property {number} percent
 */

/**
 * @typedef {Object} DashboardMetrics
 * @property {Object} today
 * @property {number} today.newCustomers
 * @property {number} today.returningCustomers
 * @property {number} today.paymentsPerCustomer
 * @property {number} today.averageCustomerVolume
 * @property {number} today.customersPaid
 * @property {number} today.successCount
 * @property {number} today.successVolume
 * @property {Object} yesterday
 * @property {number} yesterday.newCustomers
 * @property {Object} topCustomers
 * @property {number} topCustomers.total
 * @property {CustomerTotal[]} topCustomers.list
 * @property {number} topCustomers.yesterdayTotal
 * @property {Object} errors
 * @property {number} errors.count
 * @property {number} errors.rate
 * @property {number} errors.volume
 * @property {number} errors.attempts
 * @property {ErrorBreakdownItem[]} errors.breakdown
 * @property {Object} topSpenders
 * @property {{ total: number, list: CustomerTotal[] }} topSpenders.all
 * @property {{ total: number, list: CustomerTotal[] }} topSpenders.last30Days
 */

const MOCK_CUSTOMERS = [
  { id: "cus_001", name: "Habana Market", weight: 1.6, startOffset: 60 },
  { id: "cus_002", name: "Caribe Tech", weight: 1.3, startOffset: 45 },
  { id: "cus_003", name: "Isla Retail", weight: 1.1, startOffset: 30 },
  { id: "cus_004", name: "Soluciones Delta", weight: 1.25, startOffset: 20 },
  { id: "cus_005", name: "Vega Logistics", weight: 1.8, startOffset: 60 },
  { id: "cus_006", name: "Mar Azul", weight: 1.05, startOffset: 15 },
  { id: "cus_007", name: "Pacifico Imports", weight: 1.45, startOffset: 25 },
  { id: "cus_008", name: "Cafe Central", weight: 1.15, startOffset: 10 },
  { id: "cus_009", name: "Tierra Firme", weight: 1.2, startOffset: 5 },
  { id: "cus_010", name: "Atlas Services", weight: 1.35, startOffset: 3 },
  { id: "cus_011", name: "Bambu Studio", weight: 1.0, startOffset: 1 },
  { id: "cus_012", name: "Luna Partners", weight: 1.05, startOffset: 0 }
];

const FAILURE_REASONS = [
  { id: "processor_error", label: "Error del procesador", color: "#f97316" },
  { id: "insufficient_funds", label: "Fondos insuficientes", color: "#f43f5e" },
  { id: "expired_card", label: "Tarjeta vencida", color: "#ef4444" },
  { id: "fraud_suspected", label: "Fraude sospechoso", color: "#0ea5e9" },
  { id: "network_error", label: "Error de red", color: "#8b5cf6" }
];

const roundToCents = (value) => Math.round(value * 100) / 100;

const toDate = (value) => (value instanceof Date ? value : new Date(value));

const startOfDay = (value) => {
  const date = toDate(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const addDays = (value, diff) => {
  const date = new Date(value);
  date.setDate(date.getDate() + diff);
  return date;
};

const isSameDay = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();

const isWithinRange = (date, start, end) => {
  const time = toDate(date).getTime();
  return time >= start.getTime() && time < end.getTime();
};

const buildCustomerTotals = (payments) => {
  const totals = new Map();
  payments.forEach((payment) => {
    const current = totals.get(payment.customerId) || {
      customerId: payment.customerId,
      name: payment.customerName,
      total: 0,
      count: 0
    };
    totals.set(payment.customerId, {
      ...current,
      total: roundToCents(current.total + payment.amount),
      count: current.count + 1
    });
  });

  return Array.from(totals.values()).sort((a, b) => b.total - a.total);
};

const toPercent = (value) => Math.round(value * 1000) / 10;

/**
 * Genera pagos mock con estados variados para los ultimos dias simulados.
 * @param {Date} referenceDate
 * @param {number} days
 * @returns {Payment[]}
 */
export const generateMockPayments = (referenceDate = new Date(), days = 60) => {
  const anchorDate = startOfDay(referenceDate);
  const payments = [];

  for (let dayOffset = 0; dayOffset < days; dayOffset += 1) {
    const dayDate = addDays(anchorDate, -dayOffset);
    const daySeed = dayDate.getDate() + dayDate.getMonth() * 31 + dayOffset * 7;
    const availableCustomers = MOCK_CUSTOMERS.filter((customer) => dayOffset <= customer.startOffset);
    const dayCount = 14 + (daySeed % 9);

    for (let i = 0; i < dayCount; i += 1) {
      const customer = availableCustomers[(daySeed + i * 3) % availableCustomers.length];
      const hour = (daySeed + i * 2) % 24;
      const minute = (daySeed * 7 + i * 11) % 60;
      const base = 38 + ((daySeed * 11 + i * 13) % 140);
      const spike = (i % 7 === 0 ? 80 : 0) + (i % 13 === 0 ? 120 : 0);
      const amount = roundToCents((base + spike + (hour % 4) * 6) * customer.weight);
      const failureSeed = (daySeed + i * 5) % 12;
      const failed = failureSeed === 0 || failureSeed === 9;
      const failureReason = failed
        ? FAILURE_REASONS[(daySeed + i) % FAILURE_REASONS.length].id
        : null;
      const createdAt = new Date(dayDate);
      createdAt.setHours(hour, minute, 0, 0);

      payments.push({
        id: `pay_${dayDate.getFullYear()}${String(dayDate.getMonth() + 1).padStart(2, "0")}${String(
          dayDate.getDate()
        ).padStart(2, "0")}_${i}`,
        customerId: customer.id,
        customerName: customer.name,
        amount,
        currency: "USD",
        status: failed ? "failed" : "succeeded",
        failureReason,
        createdAt: createdAt.toISOString()
      });
    }
  }

  return payments;
};

/**
 * Agrega pagos para mostrar las cards del dashboard.
 * @param {Payment[]} payments
 * @param {{ referenceDate?: Date, topCustomersCount?: number, topSpendersCount?: number }} options
 * @returns {DashboardMetrics}
 */
export const computeDashboardMetrics = (payments, options = {}) => {
  const referenceDate = options.referenceDate ? startOfDay(options.referenceDate) : startOfDay(new Date());
  const todayEnd = addDays(referenceDate, 1);
  const yesterdayStart = addDays(referenceDate, -1);
  const yesterdayEnd = referenceDate;
  const last30Start = addDays(referenceDate, -29);
  const topCustomersCount = options.topCustomersCount ?? 3;
  const topSpendersCount = options.topSpendersCount ?? 5;

  const succeeded = payments.filter((payment) => payment.status === "succeeded");
  const failed = payments.filter((payment) => payment.status === "failed");

  const succeededToday = succeeded.filter((payment) => isSameDay(payment.createdAt, referenceDate));
  const succeededYesterday = succeeded.filter((payment) => isSameDay(payment.createdAt, yesterdayStart));
  const failedToday = failed.filter((payment) => isSameDay(payment.createdAt, referenceDate));

  const totalSuccessVolumeToday = roundToCents(succeededToday.reduce((sum, payment) => sum + payment.amount, 0));
  const customersPaidToday = new Set(succeededToday.map((payment) => payment.customerId));

  const firstSuccessByCustomer = new Map();
  succeeded.forEach((payment) => {
    const dayTime = startOfDay(payment.createdAt).getTime();
    const current = firstSuccessByCustomer.get(payment.customerId);
    if (!current || dayTime < current) {
      firstSuccessByCustomer.set(payment.customerId, dayTime);
    }
  });

  const newCustomersToday = Array.from(firstSuccessByCustomer.values()).filter(
    (time) => time === referenceDate.getTime()
  ).length;
  const newCustomersYesterday = Array.from(firstSuccessByCustomer.values()).filter(
    (time) => time === yesterdayStart.getTime()
  ).length;

  const successesLast30 = succeeded.filter((payment) => isWithinRange(payment.createdAt, last30Start, todayEnd));
  const successCountsLast30 = new Map();
  successesLast30.forEach((payment) => {
    const current = successCountsLast30.get(payment.customerId) || 0;
    successCountsLast30.set(payment.customerId, current + 1);
  });

  const returningCustomers = Array.from(customersPaidToday).filter(
    (customerId) => (successCountsLast30.get(customerId) || 0) >= 2
  ).length;

  const paymentsPerCustomer = customersPaidToday.size
    ? succeededToday.length / customersPaidToday.size
    : 0;
  const averageCustomerVolume = customersPaidToday.size
    ? roundToCents(totalSuccessVolumeToday / customersPaidToday.size)
    : 0;

  const topCustomersToday = buildCustomerTotals(succeededToday).slice(0, topCustomersCount);
  const topCustomersYesterday = buildCustomerTotals(succeededYesterday).slice(0, topCustomersCount);
  const topCustomersTotal = roundToCents(topCustomersToday.reduce((sum, customer) => sum + customer.total, 0));
  const topCustomersYesterdayTotal = roundToCents(
    topCustomersYesterday.reduce((sum, customer) => sum + customer.total, 0)
  );

  const errorCount = failedToday.length;
  const totalAttempts = errorCount + succeededToday.length;
  const errorRate = totalAttempts ? (errorCount / totalAttempts) * 100 : 0;
  const errorVolume = roundToCents(failedToday.reduce((sum, payment) => sum + payment.amount, 0));

  const errorBreakdown = FAILURE_REASONS.map((reason) => {
    const reasonPayments = failedToday.filter((payment) => payment.failureReason === reason.id);
    const count = reasonPayments.length;
    return {
      ...reason,
      count,
      volume: roundToCents(reasonPayments.reduce((sum, payment) => sum + payment.amount, 0)),
      percent: errorCount ? (count / errorCount) * 100 : 0
    };
  });

  const allTimeTotals = buildCustomerTotals(succeeded);
  const allTimeTotalVolume = roundToCents(allTimeTotals.reduce((sum, customer) => sum + customer.total, 0));
  const allTimeList = allTimeTotals.slice(0, topSpendersCount).map((customer) => ({
    ...customer,
    percent: allTimeTotalVolume ? toPercent(customer.total / allTimeTotalVolume) : 0
  }));

  const last30Totals = buildCustomerTotals(successesLast30);
  const last30TotalVolume = roundToCents(last30Totals.reduce((sum, customer) => sum + customer.total, 0));
  const last30List = last30Totals.slice(0, topSpendersCount).map((customer) => ({
    ...customer,
    percent: last30TotalVolume ? toPercent(customer.total / last30TotalVolume) : 0
  }));

  return {
    today: {
      newCustomers: newCustomersToday,
      returningCustomers,
      paymentsPerCustomer,
      averageCustomerVolume,
      customersPaid: customersPaidToday.size,
      successCount: succeededToday.length,
      successVolume: totalSuccessVolumeToday
    },
    yesterday: {
      newCustomers: newCustomersYesterday
    },
    topCustomers: {
      total: topCustomersTotal,
      list: topCustomersToday.map((customer) => ({ ...customer, percent: 0 })),
      yesterdayTotal: topCustomersYesterdayTotal
    },
    errors: {
      count: errorCount,
      rate: errorRate,
      volume: errorVolume,
      attempts: errorCount,
      breakdown: errorBreakdown
    },
    topSpenders: {
      all: {
        total: allTimeTotalVolume,
        list: allTimeList
      },
      last30Days: {
        total: last30TotalVolume,
        list: last30List
      }
    }
  };
};
