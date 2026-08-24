'use server';

import { requireAdminSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export interface ActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

const TeamMemberSchema = z.object({
  name: z.string().trim().min(1, 'اسم العضو مطلوب'),
  role: z.string().trim().min(1, 'المسمى الوظيفي مطلوب'),
  bio: z.string().trim().optional().transform((val) => val || null),
  display_order: z.coerce.number().int().default(0),
  is_active: z.preprocess(
    (val) => val === true || val === 'true' || val === 'on' || val === 1 || val === '1',
    z.boolean().default(true)
  ),
});

/**
 * Upload team avatar to Supabase Storage 'team' bucket
 */
async function uploadTeamAvatar(
  supabase: ReturnType<typeof createAdminClient>,
  file: File
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'png';
  const cleanFileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from('team')
    .upload(cleanFileName, buffer, {
      contentType: file.type || 'image/png',
      upsert: true,
    });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw new Error(`فشل رفع الصورة: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('team')
    .getPublicUrl(cleanFileName);

  return publicUrlData.publicUrl;
}

/**
 * Create a new team member
 */
export async function createTeamMember(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();

  const rawData = {
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio'),
    display_order: formData.get('display_order'),
    is_active: formData.get('is_active') === 'true' || formData.get('is_active') === 'on',
  };

  const parsed = TeamMemberSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'يرجى مراجعة الحقول المطلوبة.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createAdminClient();

  // Handle avatar upload or URL
  let imageUrl: string | null = (formData.get('image_url_text') as string) || null;
  const imageFile = formData.get('image_file') as File | null;

  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadTeamAvatar(supabase, imageFile);
    } catch (err: unknown) {
      return {
        success: false,
        error: (err as Error).message || 'حدث خطأ أثناء رفع صورة عضو الفريق.',
      };
    }
  }

  const newMember = {
    name: parsed.data.name,
    role: parsed.data.role,
    bio: parsed.data.bio,
    image_url: imageUrl,
    display_order: parsed.data.display_order,
    is_active: parsed.data.is_active,
  };

  const { error: insertError } = await supabase.from('team_members').insert(newMember);

  if (insertError) {
    console.error('Failed to create team member:', insertError);
    return {
      success: false,
      error: `فشل إضافة عضو الفريق: ${insertError.message}`,
    };
  }

  revalidatePath('/admin/team');
  revalidatePath('/about');
  redirect('/admin/team');
}

/**
 * Update an existing team member
 */
export async function updateTeamMember(
  memberId: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();

  const rawData = {
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio'),
    display_order: formData.get('display_order'),
    is_active: formData.get('is_active') === 'true' || formData.get('is_active') === 'on',
  };

  const parsed = TeamMemberSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'يرجى مراجعة الحقول المطلوبة.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createAdminClient();

  const { data: currentMember } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', memberId)
    .single();

  let imageUrl: string | null = (formData.get('image_url_text') as string) || currentMember?.image_url || null;
  const imageFile = formData.get('image_file') as File | null;

  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadTeamAvatar(supabase, imageFile);
    } catch (err: unknown) {
      return {
        success: false,
        error: (err as Error).message || 'حدث خطأ أثناء رفع صورة عضو الفريق.',
      };
    }
  }

  const updatedData = {
    name: parsed.data.name,
    role: parsed.data.role,
    bio: parsed.data.bio,
    image_url: imageUrl,
    display_order: parsed.data.display_order,
    is_active: parsed.data.is_active,
    updated_at: new Date().toISOString(),
  };

  const { error: updateError } = await supabase
    .from('team_members')
    .update(updatedData)
    .eq('id', memberId);

  if (updateError) {
    console.error('Failed to update team member:', updateError);
    return {
      success: false,
      error: `فشل تعديل بيانات عضو الفريق: ${updateError.message}`,
    };
  }

  revalidatePath('/admin/team');
  revalidatePath('/about');
  redirect('/admin/team');
}

/**
 * Toggle team member active status
 */
export async function toggleTeamMemberActive(
  memberId: string,
  currentState: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminSession();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('team_members')
      .update({ is_active: !currentState, updated_at: new Date().toISOString() })
      .eq('id', memberId);

    if (error) throw error;

    revalidatePath('/admin/team');
    revalidatePath('/about');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Delete a team member
 */
export async function deleteTeamMember(memberId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminSession();
    const supabase = createAdminClient();

    const { error } = await supabase.from('team_members').delete().eq('id', memberId);
    if (error) throw error;

    revalidatePath('/admin/team');
    revalidatePath('/about');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
