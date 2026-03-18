export const mapProductToRequest = (product, overrides = {}) => {
  const breakdown = product?.carbonData?.breakdown || {};
  const manufacturing = breakdown.manufacturing ?? 0;
  const packaging = breakdown.packaging ?? 0;
  const transport = breakdown.transport ?? 0;
  const handling = breakdown.handling ?? 0;
  const totalCO2e =
    product?.carbonData?.totalCO2ePerKg ??
    product?.emission ??
    manufacturing + packaging + transport + handling;

  return {
    id: product?.id,
    name: product?.name ?? "",
    category: product?.category ?? "",
    seller: product?.seller ?? "",
    price: product?.price ?? 0,
    image: product?.image ?? "",
    description: product?.description ?? "",
    isEcoFriendly: Boolean(product?.isEcoFriendly),
    manufacturing,
    packaging,
    transport,
    handling,
    totalCO2e,
    ...overrides,
  };
};
