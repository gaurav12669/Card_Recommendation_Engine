const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

module.exports = {
  travelConstant: toNumber(process.env.TRAVEL_CONSTANT, 2),
  shoppingConstant: toNumber(process.env.SHOPING_CONSTANT, 3),
  fuelConstant: toNumber(process.env.FUEL_CONSTANT, 4),
  foodConstant: toNumber(process.env.FOOD_CONSTANT, 5),
};

