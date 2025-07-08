
import { HttpClient } from '@/lib/http_client';

export interface EventType {
  id: string;
  name: string;
}

export interface EventTypeListResponse {
  message?: string;
}

export class EventTypeService {
  private static readonly httpClient = HttpClient.getEvent();

  static async getEventTypes(): Promise<EventType[] | EventTypeListResponse> {
    return this.httpClient.get<EventType[] | EventTypeListResponse>('/event-type/list');
  }
}
