export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.details) return String(error.response.data.details);
  if (typeof error?.message === 'string' && error.message.trim()) return error.message;
  return fallback;
}
