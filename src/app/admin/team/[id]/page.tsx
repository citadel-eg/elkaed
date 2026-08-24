import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { TeamMemberForm } from '@/components/admin/TeamMemberForm';
import type { TeamMember } from '@/types/team';

interface EditTeamMemberPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'تعديل عضو الفريق | لوحة تحكم القائد',
};

export default async function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: member, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !member) {
    notFound();
  }

  const typedMember = member as TeamMember;

  return (
    <div className="space-y-6 text-start" dir="rtl">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-alexandria text-muted-text">
        <Link href="/admin/team" className="hover:text-gold transition-colors">
          فريق العمل
        </Link>
        <span>/</span>
        <span className="text-[#1F1F1F] font-bold">تعديل: {typedMember.name}</span>
      </div>

      <div>
        <h1 className="font-marhey font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
          تعديل بيانات العضو
        </h1>
        <p className="font-alexandria text-xs text-muted-text mt-1">
          تعديل الاسم، المسمى الوظيفي، الصورة الشخصية، أو ترتيب الظهور
        </p>
      </div>

      <TeamMemberForm member={typedMember} isEditing={true} />
    </div>
  );
}
