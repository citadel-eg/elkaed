import crypto from 'crypto';

/**
 * Server-only helper to verify admin credentials using timing-safe comparison.
 * Never exposes credentials to client bundles.
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = (process.env.ADMIN_USERNAME || 'elkaed_admin').trim();
  const expectedPassword = (process.env.ADMIN_PASSWORD || 'ElKaed#2026!Secure@Pass_9vX').trim();

  const cleanInputUsername = username.trim();
  const cleanInputPassword = password.trim();

  const usernameBuffer = Buffer.from(cleanInputUsername);
  const expectedUsernameBuffer = Buffer.from(expectedUsername);
  const passwordBuffer = Buffer.from(cleanInputPassword);
  const expectedPasswordBuffer = Buffer.from(expectedPassword);

  const isUsernameMatch =
    usernameBuffer.length === expectedUsernameBuffer.length &&
    crypto.timingSafeEqual(usernameBuffer, expectedUsernameBuffer);

  const isPasswordMatch =
    passwordBuffer.length === expectedPasswordBuffer.length &&
    crypto.timingSafeEqual(passwordBuffer, expectedPasswordBuffer);

  return Boolean(isUsernameMatch && isPasswordMatch);
}
