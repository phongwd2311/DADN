// Các hàm tiện ích

export const roundNumber = (num, decimals = 2) => {
  return parseFloat(num.toFixed(decimals));
};
