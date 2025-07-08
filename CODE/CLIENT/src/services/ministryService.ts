
import { HttpClient } from '@/lib/http_client';

export interface Ministry {
    id: string;
    name: string;
    description: string;
    color: string;
    churchId: string;
}

export interface CreateMinistryRequest {
    name: string;
    description: string;
    color: string;
    churchId: string;
}

export interface UpdateMinistryRequest {
    name: string;
    description: string;
    color: string;
}

export interface MinistryMember {
    id: string;
    name: string;
    roleSlug: string;
}

export interface AddMemberToMinistryRequest {
    contactId: string;
    roleSlug: string;
}

export class MinistryService {
    public static async createMinistry(ministryData: CreateMinistryRequest): Promise<Ministry> {
        return HttpClient.getMinistryUrl().post<Ministry>('/ministries', ministryData);
    }

    public static async getMinistriesByChurch(churchId: string): Promise<Ministry[]> {
        return HttpClient.getMinistryUrl().get<Ministry[]>(`/ministries?churchId=${churchId}`);
    }

    public static async getMinistryById(ministryId: string): Promise<Ministry> {
        return HttpClient.getMinistryUrl().get<Ministry>(`/ministries/${ministryId}`);
    }

    public static async updateMinistry(ministryId: string, ministryData: UpdateMinistryRequest): Promise<Ministry> {
        return HttpClient.getMinistryUrl().put<Ministry>(`/ministries/${ministryId}`, ministryData);
    }

    public static async deleteMinistry(ministryId: string): Promise<void> {
        return HttpClient.getMinistryUrl().delete<void>(`/ministries/${ministryId}`);
    }

    public static async addMemberToMinistry(ministryId: string, memberData: AddMemberToMinistryRequest): Promise<void> {
        return HttpClient.getMinistryUrl().post<void>(`/ministries/${ministryId}/members`, memberData);
    }

    public static async getMinistryMembers(ministryId: string): Promise<MinistryMember[]> {
        return HttpClient.getMinistryUrl().get<MinistryMember[]>(`/ministries/${ministryId}/members`);
    }

    public static async removeMemberFromMinistry(ministryId: string, contactId: string): Promise<void> {
        return HttpClient.getMinistryUrl().delete<void>(`/ministries/${ministryId}/members/${contactId}`);
    }
}
