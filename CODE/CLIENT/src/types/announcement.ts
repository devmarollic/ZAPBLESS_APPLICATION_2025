
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author?: string;
  published_at?: string;
  expires_at?: string;
  is_active: boolean;
  priority?: "low" | "medium" | "high";
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  author?: string;
  expires_at?: string;
  priority?: "low" | "medium" | "high";
  category?: string;
  is_active?: boolean;
}

export interface UpdateAnnouncementDto {
  title?: string;
  content?: string;
  author?: string;
  expires_at?: string;
  priority?: "low" | "medium" | "high";
  category?: string;
  is_active?: boolean;
}
