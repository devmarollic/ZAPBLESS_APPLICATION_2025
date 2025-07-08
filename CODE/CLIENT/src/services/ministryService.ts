
import { HttpClient } from '@/lib/http_client';
import { AuthenticationService } from '@/lib/authentication_service';
import { Contact } from './contactService';

export interface MinistryMember {
    ministryId: string;
    contactId: string;
    roleSlug: string;
    joinedAtTimestamp: string;
    contact: {
        id: string;
    };
}

export interface Ministry {
    id: string;
    name: string;
    description: string;
    color: string;
    churchId: string;
    members: MinistryMember[];
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
    leaderId?: string;
    viceLeaderId?: string;
    memberIds?: string[];
    memberMemberships?: MemberMembership[];
}



export interface AddMemberToMinistryRequest {
    contactId: string;
    roleSlug: string;
}

export interface MemberMembership {
    memberId: string;
    role: string;
}

export class MinistryService {
    public static async createMinistry(ministryData: CreateMinistryRequest): Promise<Ministry> {
        return HttpClient.getMinistryUrl().post<Ministry>('/ministries', ministryData);
    }

    public static async getMinistriesByChurch(): Promise<Ministry[]> {
        const churchId = AuthenticationService.getChurchId();
        return HttpClient.getMinistryUrl().get<Ministry[]>(`/ministries?churchId=${churchId}`); 
    }

    public static async getMinistryById(ministryId: string): Promise<Ministry> {
        return HttpClient.getMinistryUrl().get<Ministry>(`/ministries/${ministryId}`);
    }

    // Alias for getMinistryById to maintain compatibility
    public static async getMinistry(ministryId: string): Promise<Ministry> {
        return this.getMinistryById(ministryId);
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
        const ministry = await this.getMinistryById(ministryId);
        return ministry.members;
    }



    public static async removeMemberFromMinistry(ministryId: string, contactId: string): Promise<void> {
        return HttpClient.getMinistryUrl().delete<void>(`/ministries/${ministryId}/members/${contactId}`);
    }
}
