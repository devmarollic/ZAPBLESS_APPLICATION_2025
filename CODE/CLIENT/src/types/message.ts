
export type MessageRecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface MessageRecurrenceRule {
  type: MessageRecurrenceType;
  interval: number;
  days_of_week?: string[];
  day_of_month?: number;
  time_of_day: string;
  end_date: Date | null;
}

export interface RecurringMessage {
  id: string;
  title: string;
  message: string;
  target: string;
  specificTarget?: string;
  recurrence: MessageRecurrenceRule;
  next_occurrence: Date;
  isActive: boolean;
  created_at: Date;
}
