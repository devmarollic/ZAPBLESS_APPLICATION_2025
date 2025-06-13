
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
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  ministry?: string;
  isPublic: boolean;
  recurrence_id?: string;
  recurrence?: RecurrenceRule;
}

export type EventFormValues = {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  ministry?: string;
  isPublic: boolean;
  recurrence_type: RecurrenceType;
  recurrence_interval: number;
  recurrence_days_of_week?: string[];
  recurrence_day_of_month?: number | 'last';
  recurrence_end_date: Date | null;
}
