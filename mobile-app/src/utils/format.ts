// Định dạng dữ liệu hiển thị

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export const formatPower = (value) => {
  return `${value} kW`;
};
