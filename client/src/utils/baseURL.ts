const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
};

export const callBackUrl = (): string => {
  return process.env.NEXT_PUBLIC_CALLBACK_URL || "http://localhost:3000";
};
export default getBaseUrl;
