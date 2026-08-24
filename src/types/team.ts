export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type CreateTeamMemberInput = Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTeamMemberInput = Partial<CreateTeamMemberInput>;
