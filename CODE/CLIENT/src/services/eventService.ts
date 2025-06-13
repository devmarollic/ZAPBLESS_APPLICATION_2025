
import { HttpClient } from '@/lib/http_client';

export interface CreateEventRequest {
  churchId: string;
  ministryId: string;
  title: string;
  description: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  statusId: string;
  typeId: string;
  startAtTimestamp: string;
  endAtTimestamp: string;
}

export interface CreateEventResponse {
  id: string;
  success: boolean;
  message: string;
}

export class EventService {
  static async createEvent(eventData: CreateEventRequest): Promise<CreateEventResponse> {
    return HttpClient.post<CreateEventResponse>('/event/add', eventData);
  }
}
