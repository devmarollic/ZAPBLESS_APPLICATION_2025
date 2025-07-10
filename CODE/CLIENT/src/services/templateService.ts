
import { HttpClient } from '@/lib/http_client';
import { Template, CreateTemplateRequest, UpdateTemplateRequest, TemplateCategory } from '@/types/template';

export class TemplateService {
  private static readonly httpClient = HttpClient.getDefault();

  static async getTemplates(): Promise<Template[]> {
    return this.httpClient.get<Template[]>('/message-template/list');
  }

  static async getTemplate(id: string): Promise<Template> {
    return this.httpClient.get<Template>(`/message-template/${id}`);
  }

  static async createTemplate(data: CreateTemplateRequest): Promise<Template> {
    return this.httpClient.post<Template>('/message-template/add', data);
  }

  static async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<Template> {
    return this.httpClient.put<Template>(`/message-template/${id}/set`, data);
  }

  static async deleteTemplate(id: string): Promise<void> {
    return this.httpClient.delete<void>(`/message-template/${id}/remove`);
  }

  static async getTemplateCategories(): Promise<TemplateCategory[]> {
    return this.httpClient.get<TemplateCategory[]>('/message-template/category/list');
  }
}
