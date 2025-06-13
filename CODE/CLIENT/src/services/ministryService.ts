
import { HttpClient } from '@/lib/http_client';

export interface Ministry {
  id: string;
  name: string;
}

export interface MinistryListResponse {
  message?: string;
}

export class MinistryService {
  static async getMinistries(): Promise<Ministry[] | MinistryListResponse> {
    return HttpClient.get<Ministry[] | MinistryListResponse>('/ministry/list');
  }
}
