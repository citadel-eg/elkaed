import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { TeamTable } from '@/components/admin/TeamTable';
import type { TeamMember } from '@/types/team';

export const metadata = {
  title: 'إدارة فريق العمل | لوحة تحكم القائد',
};

export const dynamic = 'force-dynamic';

export default async function AdminTeamPage() {
  const supabase = createAdminClient();

  const { data: members, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Failed to fetch team members:', error.message || error);
  }

  const teamList: TeamMember[] = members || [];

  return (
    <div className="space-y-6 text-start" dir="rtl">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-marhey font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
            فريق العمل ({teamList.length})
          </h1>
          <p className="font-alexandria text-xs text-muted-text mt-1">
            إدارة أعضاء الفريق، المسميات الوظيفية، الصور، وترتيب الظهور في صفحة "من نحن"
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-xs shadow-md shadow-gold/20 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <span>+ إضافة عضو جديد</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl font-alexandria text-xs text-red-700">
          <p className="font-bold">حدث خطأ أثناء تحميل بيانات الفريق</p>
          <p className="mt-0.5">{error.message}</p>
        </div>
      )}

      {/* Team Table */}
      <TeamTable members={teamList} />
    </div>
  );
}
