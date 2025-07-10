
import { HttpClient } from '@/lib/http_client';

export interface EventType {
  id: string;
  name: string;
}

export class EventTypeService {
  private static readonly httpClient = HttpClient.getEvent();

  static async getEventTypes(): Promise<EventType[]> {
    return this.httpClient.get<EventType[]>('/event-type/list');
  }
}
