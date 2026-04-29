/**
 * Extracts a human-readable error message from various API error structures.
 * Prevents long technical stack traces or Laravel-specific exceptions from being displayed.
 */
export const parseError = (error: any, t?: (cat: string, key: string) => any): string => {
  const defaultMsg = t ? t("apiErrors", "unknownError") : "Something went wrong";
  if (!error) return defaultMsg;

  // 1. Check for Network errors
  if (error.message === "Network Error") {
    return t ? t("apiErrors", "networkError") : "Internet aloqasi mavjud emas.";
  }

  // 2. Check for Laravel's standard error structures
  const responseData = error?.response?.data;
  const status = error?.response?.status;
  
  if (status === 401) {
    return t ? t("apiErrors", "unauthorized") : "Telefon raqami yoki parol noto'g'ri.";
  }

  if (status >= 500) {
    return t ? t("apiErrors", "serverError") : "Serverda xatolik yuz berdi.";
  }

  if (responseData) {
    // If it's a validation error with an 'errors' object
    if (responseData.errors && typeof responseData.errors === 'object') {
      const firstKey = Object.keys(responseData.errors)[0];
      const firstError = responseData.errors[firstKey];
      
      // Special case for taken phone
      if (firstKey === "phone" && String(firstError).includes("taken")) {
        return t ? t("apiErrors", "phoneTaken") : "Ushbu telefon raqami allaqachon ro'yxatdan o'tgan.";
      }

      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0];
      }
      if (typeof firstError === 'string') return firstError;
    }

    // If it's a direct 'message' field
    if (typeof responseData.message === 'string') {
      // Check if message looks like a technical stack trace or exception name
      if (
        responseData.message.includes("Stack trace:") || 
        responseData.message.includes("Illuminate\\") ||
        responseData.message.length > 200
      ) {
        return t ? t("apiErrors", "serverError") : "Tizimda xatolik yuz berdi.";
      }
      return responseData.message;
    }

    // If responseData itself is a string (rare but possible if HTML)
    if (typeof responseData === 'string' && responseData.length < 150) {
      return responseData;
    }
  }

  // 3. Fallback to axios error message
  if (error.message && !error.message.includes("status code")) {
    return error.message;
  }

  return defaultMsg;
};

/**
 * Validates if a string is a valid phone number format.
 * Allows digits, spaces, dashes, and a leading plus.
 */
export const isValidPhone = (phone: string): boolean => {
  // Simple check: Must have at least 7 digits and no letters/@
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return false;
  if (phone.includes("@")) return false;
  
  // Specific Uzbekistan pattern (optional but recommended)
  // Starts with +998 or 998 and has 12 digits total
  const uzPattern = /^(\+?998)?\d{9}$/;
  const cleanPhone = phone.replace(/[\s-]/g, "");
  return uzPattern.test(cleanPhone) || digits.length >= 9;
};
