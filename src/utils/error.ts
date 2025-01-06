// src/utils/errorUtils.ts
import { message } from "antd";

export const getErrorMessage = (
  code: number,
  errorMessages: {
    code: number;
    message: string;
  }[]
): string => {
  const error = errorMessages.find((err) => err.code === code);
  return error ? error.message : "알 수 없는 오류가 발생했습니다.";
};

export const showError = (
  errorMessage: string = "알 수 없는 오류가 발생했습니다."
) => {
  message.error({
    content: errorMessage,
    duration: 3,
    style: { marginTop: "10px" },
  });
};
