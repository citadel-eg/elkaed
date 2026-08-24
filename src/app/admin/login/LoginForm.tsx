'use client';

import { useActionState } from 'react';
import { loginAdmin, type LoginActionResult } from './actions';

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, isPending] = useActionState<LoginActionResult | null, FormData>(
    loginAdmin,
    null
  );

  return (
    <form action={formAction} className="space-y-4 text-start">
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

      {state?.error && (
        <div
          role="alert"
          className="p-3 text-xs font-alexandria text-red-700 bg-red-50 border border-red-200 rounded-xl"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="username"
          className="block font-alexandria font-semibold text-xs text-[#1F1F1F]"
        >
          اسم المستخدم
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          placeholder="admin"
          disabled={isPending}
          className="w-full h-11 px-4 border border-[#DCD4CA] rounded-xl font-alexandria text-sm text-[#1F1F1F] bg-white placeholder-[#B4A89A] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block font-alexandria font-semibold text-xs text-[#1F1F1F]"
        >
          كلمة المرور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={isPending}
          className="w-full h-11 px-4 border border-[#DCD4CA] rounded-xl font-alexandria text-sm text-[#1F1F1F] bg-white placeholder-[#B4A89A] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-12 mt-2 bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-sm rounded-xl shadow-md shadow-gold/20 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer active:scale-98"
      >
        {isPending ? 'جاري التحقق...' : 'تسجيل الدخول'}
      </button>
    </form>
  );
}
