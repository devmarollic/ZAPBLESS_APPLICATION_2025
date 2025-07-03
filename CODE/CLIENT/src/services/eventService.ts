
import { HttpClient } from '@/lib/http_client';

export interface RecurrenceData {
  interval: number;
  dayOfWeekArray: number[];
  dayOfMonthArray: number[];
  endAtTimestamp: string;
  typeId: string;
}

export interface ReminderData {
  notificationMediumId: string;
  templateId: string;
  offset: string;
  variables: {
    customMessage?: string;
  };
}

export interface CreateEventRequest {
  churchId: string;
  title: string;
  statusId: string;
  typeId: string;
  description: string;
  location: string;
  startAtTimestamp: string;
  endAtTimestamp: string;
  recurrenceTypeId?: string;
  recurrence?: RecurrenceData;
  reminders?: ReminderData[];
  leaders?: string[];
  viceLeaders?: string[];
}

export interface UpdateEventRequest {
  title: string;
  statusId: string;
  typeId: string;
  description: string;
  location: string;
  startAtTimestamp: string;
  endAtTimestamp: string;
  recurrenceTypeId?: string;
  leaders?: string[];
  viceLeaders?: string[];
}

export interface EventResponse {
  id: string;
  churchId: string;
  ministryId?: string;
  title: string;
  description: string;
  location: string;
  statusId: string;
  typeId: string;
  otherTypeReason?: string;
  startAtTimestamp: string;
  endAtTimestamp: string;
  isPublic: boolean;
  recurrenceTypeId?: string;
  creationTimestamp: string;
  updateTimestamp: string;
  church: {
    name: string;
  };
  ministry?: {
    name?: string;
  } | null;
  eventStatus: {
    name: string;
  };
  eventType: {
    name: string;
  };
  recurrenceType?: {
    name: string;
  };
  recurrence?: RecurrenceData[];
}

export interface CreateEventResponse {
  id: string;
  success: boolean;
  message: string;
}

export class EventService {
  static async createEvent(eventData: CreateEventRequest): Promise<CreateEventResponse> {
    let response = await fetch('http://localhost:3001/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    let data = await response.json();
    return data as CreateEventResponse;
  }

  static async getEvents(statusId?: string, startDate?: string, endDate?: string): Promise<EventResponse[]> {
    const params = new URLSearchParams();
    
    if (statusId) {
      params.append('statusId', statusId);
    }
    if (startDate) {
      params.append('startAfter', startDate);
    }
    if (endDate) {
      params.append('endBefore', endDate);
    }
    
    const query = params.toString() ? `?${params.toString()}` : '';
    let response = await fetch(`http://localhost:3001/events${query}`);
    let data = await response.json();
    return data as EventResponse[];
  }

  static async getEvent(eventId: string): Promise<EventResponse> {
    return HttpClient.get<EventResponse>(`/events/${eventId}`);
  }

  static async updateEvent(eventId: string, eventData: UpdateEventRequest): Promise<EventResponse> {
    return HttpClient.put<EventResponse>(`/events/${eventId}`, eventData);
  }

  static async deleteEvent(eventId: string): Promise<void> {
    return HttpClient.delete<void>(`/events/${eventId}`);
  }
}
