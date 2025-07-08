
import { HttpClient } from '@/lib/http_client';

export interface Contact {
    id: string;
    name: string;
    number: string;
    notify?: string;
    verifiedName?: string;
    imgUrl?: string;
    ecclesiasticalTitle?: string;
    churchId: string;
    creationTimestamp?: number;
    updateTimestamp?: number;
}

export interface CreateContactRequest {
    name: string;
    number: string;
    ecclesiasticalTitle?: string;
    churchId: string;
}

export interface UpdateContactRequest {
    name: string;
    number: string;
    ecclesiasticalTitle?: string;
}

export interface BulkCreateContactsRequest {
    contacts: {
        name: string;
        number: string;
        ecclesiasticalTitle?: string;
    }[];
    churchId: string;
}

export interface ContactMinistryAssociation {
    ministryId: string;
    roleSlug: string;
}

export interface ContactMinistry {
    id: string;
    name: string;
    roleSlug: string;
}

export class ContactService {
    public static async createContact(contactData: CreateContactRequest): Promise<Contact> {
        return HttpClient.getMemberUrl().post<Contact>('/contacts', contactData);
    }

    public static async getContactsByChurch(churchId: string): Promise<Contact[]> {
        return HttpClient.getMemberUrl().get<Contact[]>(`/contacts?churchId=${churchId}`);
    }

    public static async bulkCreateContacts(data: BulkCreateContactsRequest): Promise<Contact[]> {
        return HttpClient.getMemberUrl().post<Contact[]>('/contacts/bulk', data);
    }

    public static async getContactById(contactId: string): Promise<Contact> {
        return HttpClient.getMemberUrl().get<Contact>(`/contacts/${contactId}`);
    }

    public static async updateContact(contactId: string, contactData: UpdateContactRequest): Promise<Contact> {
        return HttpClient.getMemberUrl().put<Contact>(`/contacts/${contactId}`, contactData);
    }

    public static async deleteContact(contactId: string): Promise<void> {
        return HttpClient.getMemberUrl().delete<void>(`/contacts/${contactId}`);
    }

    public static async associateContactToMinistry(contactId: string, association: ContactMinistryAssociation): Promise<void> {
        return HttpClient.getMemberUrl().post<void>(`/contacts/${contactId}/ministries`, association);
    }

    public static async getContactMinistries(contactId: string): Promise<ContactMinistry[]> {
        return HttpClient.getMemberUrl().get<ContactMinistry[]>(`/contacts/${contactId}/ministries`);
    }

    public static async removeContactFromMinistry(contactId: string, ministryId: string): Promise<void> {
        return HttpClient.getMemberUrl().delete<void>(`/contacts/${contactId}/ministries/${ministryId}`);
    }
}
