'use server';

import { LoginSchema } from '@/lib/validations/auth';
import { verifyAdminCredentials } from '@/lib/auth/admin';
import { getAdminSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export interface LoginActionResult {
  success?: boolean;
  error?: string;
}

export async function loginAdmin(
  prevState: LoginActionResult | null,
  formData: FormData
): Promise<LoginActionResult> {
  const rawData = {
    username: formData.get('username'),
    password: formData.get('password'),
  };

  const parsed = LoginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'يرجى إدخال اسم المستخدم وكلمة المرور بشكل صحيح.',
    };
  }

  const isValid = verifyAdminCredentials(parsed.data.username, parsed.data.password);
  if (!isValid) {
    return {
      success: false,
      error: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
    };
  }

  const session = await getAdminSession();
  session.isLoggedIn = true;
  session.username = parsed.data.username;
  session.loginAt = new Date().toISOString();
  await session.save();

  const redirectTo = (formData.get('redirectTo') as string) || '/admin/products';
  redirect(redirectTo);
}
