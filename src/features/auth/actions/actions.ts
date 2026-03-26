// Re-export everything from the API module so feature hooks/components
// only import from this single actions file.
export {
  register as registerUser,
  verifyCode,
  resendCode,
  login as loginUser,
  sendSmsAsTest,
  sendResetCode,
  resetPassword,
  logout as logoutUser,
  refreshToken,
  getMe,
  updateProfile,
  updateUserLanguage,
} from "@/src/lib/api/auth";
