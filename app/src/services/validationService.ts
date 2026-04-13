// Service kiểm tra dữ liệu nhập vào

export const validateInput = (inputData: any) => {
  const errors: any = {};

  if (!inputData.F || inputData.F <= 0) {
    errors.F = "Lực vòng F phải lớn hơn 0";
  }

  if (!inputData.v || inputData.v <= 0) {
    errors.v = "Vận tốc v phải lớn hơn 0";
  }

  // Thêm các rule khác

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
