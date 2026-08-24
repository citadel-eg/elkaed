'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { TeamMember } from '@/types/team';
import { toggleTeamMemberActive, deleteTeamMember } from '@/app/admin/team/actions';

interface TeamTableProps {
  members: TeamMember[];
}

export function TeamTable({ members }: TeamTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActive = (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleTeamMemberActive(id, current);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteTeamMember(id);
      setDeleteConfirmId(null);
    });
  };

  return (
    <div className="space-y-4 text-start" dir="rtl">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border-light shadow-xs flex items-center justify-between gap-3">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث باسم العضو أو المسمى الوظيفي..."
            className="w-full h-10 pr-9 pl-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-xs text-[#1F1F1F] placeholder-muted-text focus:outline-none focus:border-gold transition-colors"
          />
          <svg
            className="w-4 h-4 text-muted-text absolute right-3 top-3 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-border-light rounded-2xl shadow-xs overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="font-alexandria font-semibold text-sm text-[#1F1F1F]">
              لا يوجد أعضاء فريق مسجلين
            </p>
            <p className="font-alexandria text-xs text-muted-text">
              يمكنك إضافة عضو فريق جديد ليظهر في صفحة &quot;من نحن&quot;.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse font-alexandria text-xs">
              <thead>
                <tr className="bg-[#F8F5F0] border-b border-border-light text-muted-text font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-start">عضو الفريق</th>
                  <th className="py-3.5 px-4 text-start">المسمى الوظيفي</th>
                  <th className="py-3.5 px-4 text-start">النبذة</th>
                  <th className="py-3.5 px-4 text-center">الترتيب</th>
                  <th className="py-3.5 px-4 text-center">الحالة</th>
                  <th className="py-3.5 px-4 text-end">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EEE8]">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-[#FCFBF8] transition-colors">
                    {/* Avatar & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl bg-[#F2EEE8] border border-[#DCD4CA] overflow-hidden shrink-0">
                          <Image
                            src={m.image_url || '/images/avatar-placeholder.svg'}
                            alt={m.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <span className="font-bold text-xs text-[#1F1F1F]">
                          {m.name}
                        </span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4 font-medium text-gold-dark">
                      {m.role}
                    </td>

                    {/* Bio */}
                    <td className="py-3 px-4 max-w-xs text-muted-text line-clamp-2">
                      {m.bio || '—'}
                    </td>

                    {/* Display Order */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F2EEE8] font-mono font-bold text-[11px] text-[#1F1F1F]">
                        #{m.display_order}
                      </span>
                    </td>

                    {/* Active Status */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(m.id, m.is_active)}
                        disabled={isPending}
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] transition-colors cursor-pointer ${
                          m.is_active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {m.is_active ? 'نشط' : 'معطل'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/team/${m.id}`}
                          className="p-1.5 rounded-lg bg-[#F2EEE8] hover:bg-gold-tint text-[#1F1F1F] transition-colors"
                          title="تعديل العضو"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>

                        <button
                          onClick={() => setDeleteConfirmId(m.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                          title="حذف العضو"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-border-light rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-marhey font-bold text-lg text-[#1F1F1F]">
                تأكيد حذف عضو الفريق
              </h3>
              <p className="font-alexandria text-xs text-muted-text">
                هل أنت متأكد من رغبتك في حذف هذا العضو؟ لن يظهر في صفحة &quot;من نحن&quot;.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isPending}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-alexandria font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {isPending ? 'جاري الحذف...' : 'نعم، احذف'}
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isPending}
                className="flex-1 h-11 bg-[#F2EEE8] hover:bg-gold-tint text-[#1F1F1F] font-alexandria font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
