import crypto from 'crypto';

/**
 * Server-only helper to verify admin credentials using timing-safe comparison.
 * Never exposes credentials to client bundles.
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = (process.env.ADMIN_USERNAME || '').trim();
  const expectedPassword = (process.env.ADMIN_PASSWORD || '').trim();

  if (!expectedUsername || !expectedPassword) {
    console.error('Missing ADMIN_USERNAME or ADMIN_PASSWORD in environment variables on Vercel.');
    return false;
  }

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
