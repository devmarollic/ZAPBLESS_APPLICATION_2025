
import { HttpClient } from '@/lib/http_client';

export interface Ministry {
  id: string;
  name: string;
  description: string;
  color: string;
  leaderId?: string;
  leader?: string;
  members_count?: number;
  memberIds?: string[];
  leaderArray?: LeaderArray[];
  memberCountArray?: MemberCountArray[];
  created_at?: string;
  updated_at?: string;
}

interface LeaderArray {
  profile: Profile;
}

interface Profile {
  id: string;
  legalName: string;
}

interface MemberCountArray {
  count: number;
}

export interface MinistryListResponse {
  message?: string;
}

export interface CreateMinistryDto {
  name: string;
  description: string;
  color: string;
  leaderId?: string;
  memberIds?: string[];
}

export interface UpdateMinistryDto {
  name?: string;
  description?: string;
  color?: string;
  leaderId?: string;
  memberIds?: string[];
}

export class MinistryService {
  static async getMinistries(): Promise<Ministry[] | MinistryListResponse> {
    return HttpClient.get<Ministry[] | MinistryListResponse>('/ministry/list');
  }

  static async getMinistry(id: string): Promise<Ministry | null> {
    try {
      return await HttpClient.get<Ministry>(`/ministry/${id}`);
    } catch (error) {
      console.error('Error fetching ministry:', error);
      return null;
    }
  }

  static async createMinistry(data: CreateMinistryDto): Promise<Ministry> {
    return HttpClient.post<Ministry>('/ministry/create', data);
  }

  static async updateMinistry(id: string, data: UpdateMinistryDto): Promise<Ministry> {
    return HttpClient.put<Ministry>(`/ministry/${id}/update`, data);
  }

  static async deleteMinistry(id: string): Promise<void> {
    return HttpClient.delete(`/ministry/${id}/delete`);
  }
}
