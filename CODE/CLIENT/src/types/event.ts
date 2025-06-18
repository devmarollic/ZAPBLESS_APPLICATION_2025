export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurrenceRule {
  id?: string;
  type: RecurrenceType;
  interval: number;
  days_of_week?: string[];
  day_of_month?: number | 'last';
  time_of_day: string;
  end_at: Date | null;
  paused?: boolean;
}

export interface RecurringEvent {
  id: string;
  title: string;
  description: string;
  recurrence: RecurrenceRule;
  next_occurrence: Date;
  location: string;
  ministry?: string;
}

export interface Event {
  id?: string;
  title: string;
  description: string;
  churchId: string;
  location: string;
  date: Date;
  startAtTimestamp: string;
  endAtTimestamp: string;
  ministryId?: string;
  isPublic: boolean;
  recurrence_id?: string;
  recurrence?: RecurrenceRule;
  statusId: string;
  typeId: string;
  ministry?: {
    id: string;
    name: string;
    color: string;
  };
  status?: {
    id: string;
    name: string;
  };
  type?: {
    id: string;
    name: string;
  }
}

export type EventFormValues = {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  typeId: string;
  ministry?: string;
  isPublic: boolean;
  recurrence_type: RecurrenceType;
  recurrence_interval: number;
  recurrence_days_of_week?: string[];
  recurrence_day_of_month?: number | 'last';
  recurrence_end_date: Date | null;
  /**
   * Texto livre quando o usuário seleciona "outro" como tipo de evento.
   */
  otherTypeReason?: string;
}
