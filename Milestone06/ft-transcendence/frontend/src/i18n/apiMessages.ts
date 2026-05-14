import type { TFunction } from 'i18next';

// Backend English messages -> translation key
export const API_MESSAGE_KEYS: Record<string, string> = {
  // Auth
  'Invalid username or password': 'errors.invalidCredentials',
  'Username already exists': 'errors.usernameExists',
  'Login failed': 'errors.loginFailed',
  'Registration failed': 'errors.registrationFailed',
  // Password
  'New password must be at least 6 characters': 'errors.passwordMinLength',
  'User not found': 'errors.userNotFound',
  'Password cannot be changed for third-party accounts': 'errors.passwordThirdParty',
  'Current password is incorrect': 'errors.currentPasswordIncorrect',
  'Password changed successfully': 'success.passwordChanged',
  'Failed to change password': 'errors.changePasswordFailed',
  'New passwords do not match': 'errors.passwordsDoNotMatch',
  'Passwords do not match': 'errors.passwordsDoNotMatch',
  'Password must be at least 6 characters': 'errors.passwordMinLength',
  // Email
  'Email already in use': 'errors.emailInUse',
  'This email is already registered. Please log in with your username and password.': 'errors.emailAlreadyMemberUsePassword',
  'Verification email sent': 'success.verificationEmailSent',
  'Invalid or expired token': 'errors.invalidOrExpiredToken',
  'Token expired': 'errors.tokenExpired',
  'Email verified': 'success.emailVerified',
  'No email to verify': 'errors.noEmailToVerify',
  'No account found with this email': 'errors.noAccountWithEmail',
  'Email is required': 'errors.emailRequired',
  'You must verify your email before using forgot password. Please verify your email in your profile first.': 'errors.verifyEmailFirst',
  'This account uses Google sign-in. Please use the Google button on the login page.':
    'errors.forgotPasswordGoogleOnly',
  'Password reset email sent': 'success.passwordResetEmailSent',
  'Password reset successfully': 'success.passwordResetSuccess',
  'Failed to send verification email': 'errors.sendVerificationFailed',
  'Failed to resend': 'errors.resendFailed',
  'Failed to send reset email': 'errors.sendResetEmailFailed',
  'Failed to reset password': 'errors.resetPasswordFailed',
  'Verification failed': 'errors.verificationFailed',
  'Invalid reset link': 'errors.invalidResetLink',
  'Invalid verification link': 'errors.invalidVerificationLink',
  'This link is invalid or has already been used. If you verified successfully, go to your profile.': 'errors.linkInvalidOrUsed',
  // 2FA
  '2FA setup not started': 'errors.twoFactorSetupNotStarted',
  'Invalid verification code': 'errors.invalidVerificationCode',
  '2FA enabled': 'success.twoFactorEnabled',
  'Session expired. Please login again.': 'errors.sessionExpired',
  'Invalid token': 'errors.invalidToken',
  'Invalid session': 'errors.invalidSession',
  '2FA is not enabled': 'errors.twoFactorNotEnabled',
  'Password required to disable 2FA. Use your account password.': 'errors.passwordRequiredToDisable2FA',
  'Invalid password': 'errors.invalidPassword',
  '2FA disabled': 'success.twoFactorDisabled',
  'Failed to setup 2FA': 'errors.setup2FAFailed',
  'Invalid code': 'errors.invalidCode',
  'Failed to disable 2FA': 'errors.disable2FAFailed',
  // Profile
  'Update failed': 'errors.updateFailed',
  'Failed to load profile': 'errors.loadProfileFailed',
  'Failed to load stats.': 'errors.failedToLoadStats',
  'Failed to load more history.': 'errors.failedToLoadMoreHistory',
  'Failed to start recorded match.': 'errors.failedToStartRecordedMatch',
  'Failed to save match result.': 'errors.failedToSaveMatchResult',
  'Failed to update friendship': 'errors.failedToUpdateFriendship',
};

export function translateApiMessage(message: string, t: TFunction): string {
  const key = API_MESSAGE_KEYS[message];
  return key ? t(key) : message;
}
