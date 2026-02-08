export const formatTaka = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'BDT',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0, // Set to 2 if you want paisa (e.g., 500.00)
  }).format(price).replace('BDT', '৳'); // Forces the ৳ symbol
};