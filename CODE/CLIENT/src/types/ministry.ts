
export interface Ministry {
  id: string;
  name: string;
  description: string;
  leader?: string;
  members_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMinistryDto {
  name: string;
  description: string;
  leader?: string;
}

export interface UpdateMinistryDto {
  name?: string;
  description?: string;
  leader?: string;
}
