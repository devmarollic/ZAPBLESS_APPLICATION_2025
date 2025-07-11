import { HttpClient } from '@/lib/http_client';

export interface ScheduleResponse {
    id: string;
    church: {
        id: string;
        name: string;
    };
    event: {
        id: string;
        title: string;
        description: string;
        eventType: {
            id: string;
            name: string;
        };
        ministry?: {
            id: string;
            name: string;
            color: string;
        };
    };
    notificationType: {
        id: string;
        name: string;
    };
    notificationMedium: {
        id: string;
        name: string;
    };
    status: {
        id: string;
        name: string;
    };
    recurrence?: {
        id: string;
        name: string;
    } | null;
    scheduleAtTimestamp: string;
    errorMessage?: string;
    payload: any[];
    targetRoleArray: string[];
}

export class ScheduleService {
    private static readonly httpClient = HttpClient.getDefault();

    static async getSchedules(): Promise<ScheduleResponse[]> {
        return this.httpClient.get<ScheduleResponse[]>('/schedule/list');
    }

    static async deleteSchedule(scheduleId: string): Promise<{ message: string }> {
        return this.httpClient.delete<{ message: string }>(`/schedule/${scheduleId}`);
    }

    static async updateScheduleStatus(
        scheduleId: string, 
        statusId: 'pending' | 'sent' | 'failed', 
        errorMessage?: string
    ): Promise<ScheduleResponse> {
        return this.httpClient.put<ScheduleResponse>(`/schedule/${scheduleId}/status`, {
            statusId,
            errorMessage
        });
    }
} 