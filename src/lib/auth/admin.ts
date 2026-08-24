import crypto from 'crypto';

/**
 * Server-only helper to verify admin credentials using timing-safe comparison.
 * Never exposes credentials to client bundles.
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME || '';
  const expectedPassword = process.env.ADMIN_PASSWORD || '';

  if (!expectedUsername || !expectedPassword) {
    console.error('Missing ADMIN_USERNAME or ADMIN_PASSWORD in environment variables.');
    return false;
  }

  // Create buffers
  const usernameBuffer = Buffer.from(username.trim());
  const expectedUsernameBuffer = Buffer.from(expectedUsername.trim());
  const passwordBuffer = Buffer.from(password);
  const expectedPasswordBuffer = Buffer.from(expectedPassword);

  // Timing safe equal requires equal buffer lengths
  const isUsernameMatch =
    usernameBuffer.length === expectedUsernameBuffer.length &&
    crypto.timingSafeEqual(usernameBuffer, expectedUsernameBuffer);

  const isPasswordMatch =
    passwordBuffer.length === expectedPasswordBuffer.length &&
    crypto.timingSafeEqual(passwordBuffer, expectedPasswordBuffer);

  return Boolean(isUsernameMatch && isPasswordMatch);
}
