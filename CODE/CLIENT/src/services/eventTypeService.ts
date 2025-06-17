
import { HttpClient } from '@/lib/http_client';

export interface EventType {
  id: string;
  name: string;
}

export interface EventTypeListResponse {
  message?: string;
}

export class EventTypeService {
  static async getEventTypes(): Promise<EventType[] | EventTypeListResponse> {
    return HttpClient.get<EventType[] | EventTypeListResponse>('/event-type/list');
  }
}
