'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createTeamMember, updateTeamMember, type ActionState } from '@/app/admin/team/actions';
import type { TeamMember } from '@/types/team';

interface TeamMemberFormProps {
  member?: TeamMember;
  isEditing?: boolean;
}

export function TeamMemberForm({ member, isEditing = false }: TeamMemberFormProps) {
  const actionFunction = isEditing && member
    ? updateTeamMember.bind(null, member.id)
    : createTeamMember;

  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    actionFunction,
    null
  );

  const [imagePreview, setImagePreview] = useState<string | null>(member?.image_url || null);
  const [imageUrlText] = useState<string>(member?.image_url || '');

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  return (
    <form action={formAction} className="w-full max-w-4xl space-y-6 text-start" dir="rtl">
      <input type="hidden" name="image_url_text" value={imageUrlText} />

      {state?.error && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-alexandria text-red-700"
        >
          <p className="font-bold">{state.error}</p>
        </div>
      )}

      {/* 1. Member Information */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border-light shadow-xs space-y-5">
        <div className="border-b border-[#F2EEE8] pb-3">
          <h2 className="font-marhey font-bold text-lg text-[#1F1F1F]">
            1. بيانات عضو الفريق
          </h2>
          <p className="font-alexandria text-xs text-muted-text mt-0.5">
            أدخل الاسم والمسمى الوظيفي والنبذة التعريفية للعضو
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block font-alexandria font-semibold text-xs text-[#1F1F1F]">
              الاسم الكامل *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={member?.name || ''}
              placeholder="مثال: م. محمود وهدان"
              className="w-full h-11 px-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-sm text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="role" className="block font-alexandria font-semibold text-xs text-[#1F1F1F]">
              المسمى الوظيفي *
            </label>
            <input
              id="role"
              name="role"
              type="text"
              required
              defaultValue={member?.role || ''}
              placeholder="مثال: المدير التنفيذي / مسؤول المبيعات"
              className="w-full h-11 px-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-sm text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="bio" className="block font-alexandria font-semibold text-xs text-[#1F1F1F]">
              نبذة مختصرة (Bio)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={member?.bio || ''}
              placeholder="نبذة عن خبرة ودور عضو الفريق في خدمة العملاء..."
              className="w-full p-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-sm text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="display_order" className="block font-alexandria font-semibold text-xs text-[#1F1F1F]">
              ترتيب الظهور في الموقع
            </label>
            <input
              id="display_order"
              name="display_order"
              type="number"
              defaultValue={member?.display_order ?? 1}
              placeholder="1"
              className="w-full sm:w-1/2 h-11 px-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-sm text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors"
            />
            <span className="text-[11px] text-muted-text block">
              الرقم الأصغر يظهر أولاً (1 ثم 2 ثم 3...)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Avatar Image Upload */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border-light shadow-xs space-y-5">
        <div className="border-b border-[#F2EEE8] pb-3">
          <h2 className="font-marhey font-bold text-lg text-[#1F1F1F]">
            2. الصورة الشخصية
          </h2>
          <p className="font-alexandria text-xs text-muted-text mt-0.5">
            اختر صورة شخصية واضحة تظهر في بطاقة العضو بصفحة &quot;من نحن&quot;
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-1">
          {/* Avatar Preview */}
          <div className="relative w-32 h-32 rounded-3xl bg-[#F2EEE8] border-2 border-dashed border-border-light overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
            <Image
              src={imagePreview || '/images/avatar-placeholder.svg'}
              alt="معاينة الصورة"
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>

          {/* Upload Input */}
          <div className="flex-1 w-full space-y-2">
            <label className="block font-alexandria font-semibold text-xs text-[#1F1F1F]">
              اختر صورة من جهازك
            </label>
            <input
              type="file"
              name="image_file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageFileChange}
              className="w-full font-alexandria text-xs text-muted-text file:mr-0 file:ml-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gold file:text-white hover:file:bg-gold-hover file:cursor-pointer cursor-pointer"
            />
            <p className="font-alexandria text-[11px] text-muted-text">
              الصيغ المدعومة: PNG, JPG, WEBP (يُفضل صورة مربعة واضحة)
            </p>
          </div>
        </div>
      </div>

      {/* 3. Active Status */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border-light shadow-xs space-y-4">
        <div className="border-b border-[#F2EEE8] pb-3">
          <h2 className="font-marhey font-bold text-lg text-[#1F1F1F]">
            3. حالة العضو
          </h2>
        </div>

        <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FCFBF8] border border-border-light cursor-pointer hover:border-gold transition-colors">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={member ? member.is_active : true}
            className="w-5 h-5 rounded-md accent-gold cursor-pointer"
          />
          <div>
            <span className="font-alexandria font-bold text-xs text-[#1F1F1F] block">
              تفعيل العضو (نشط)
            </span>
            <span className="font-alexandria text-[11px] text-muted-text">
              يظهر العضو للزوار في شبكة فريق العمل بصفحة &quot;من نحن&quot;
            </span>
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/admin/team"
          className="h-12 px-6 rounded-2xl bg-[#F2EEE8] hover:bg-gold-tint text-[#1F1F1F] font-alexandria font-bold text-xs flex items-center justify-center transition-colors"
        >
          إلغاء
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="h-12 px-8 rounded-2xl bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-xs shadow-md shadow-gold/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? 'جاري الحفظ...' : isEditing ? 'تحديث العضو' : 'إضافة العضو'}
        </button>
      </div>
    </form>
  );
}
