import Link from 'next/link';
import { TeamMemberForm } from '@/components/admin/TeamMemberForm';

export const metadata = {
  title: 'إضافة عضو فريق جديد | لوحة تحكم القائد',
};

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6 text-start" dir="rtl">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-alexandria text-muted-text">
        <Link href="/admin/team" className="hover:text-gold transition-colors">
          فريق العمل
        </Link>
        <span>/</span>
        <span className="text-[#1F1F1F] font-bold">عضو جديد</span>
      </div>

      <div>
        <h1 className="font-marhey font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
          إضافة عضو فريق جديد
        </h1>
        <p className="font-alexandria text-xs text-muted-text mt-1">
          أدخل بيانات العضو، المسمى الوظيفي، وارفع الصورة الشخصية
        </p>
      </div>

      <TeamMemberForm isEditing={false} />
    </div>
  );
}
