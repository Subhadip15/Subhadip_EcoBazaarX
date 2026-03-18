export const buildMonthBuckets = (monthsCount = 6) => {
  const buckets = [];
  const now = new Date();

  for (let i = monthsCount - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("en-US", { month: "short" }),
      value: 0,
    });
  }

  return buckets;
};

export const groupOrdersByMonth = (orders = [], monthsCount = 6) => {
  const buckets = buildMonthBuckets(monthsCount);
  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  orders.forEach((order) => {
    if (!order?.orderDate) return;
    const date = new Date(order.orderDate);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const bucket = bucketMap.get(key);
    if (bucket) {
      bucket.value += Number(order.totalEmission || 0);
    }
  });

  return buckets;
};

export const summarizeFootprint = (buckets = []) => {
  const total = buckets.reduce((acc, item) => acc + (item.value || 0), 0);
  const average = buckets.length ? Math.round(total / buckets.length) : 0;
  const best = buckets.reduce((prev, curr) => (curr.value < prev.value ? curr : prev), buckets[0] || {});
  return {
    total: Math.round(total * 100) / 100,
    average,
    bestMonth: best?.label || "-",
  };
};

export const getTopEcoProducts = (products = [], limit = 4) => {
  const ecoProducts = products.filter((product) => product?.isEcoFriendly);
  const sorted = [...ecoProducts].sort((a, b) => (a.emission ?? 0) - (b.emission ?? 0));
  return sorted.slice(0, limit);
};

export const buildSalesVsSavings = (orders = [], products = []) => {
  const productMap = new Map(products.map((product) => [product.id, product]));
  const aggregate = new Map();

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const existing = aggregate.get(item.productId) || { sales: 0, savings: 0 };
      existing.sales += item.quantity || 0;
      existing.savings += item.emission || 0;
      aggregate.set(item.productId, existing);
    });
  });

  return Array.from(aggregate.entries())
    .map(([productId, data]) => ({
      productId,
      name: productMap.get(productId)?.name || "Unknown Product",
      sales: data.sales,
      savings: Math.round(data.savings * 100) / 100,
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 4);
};
