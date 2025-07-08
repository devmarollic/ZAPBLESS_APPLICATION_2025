
import { HttpClient } from '@/lib/http_client';
import { Template, CreateTemplateRequest, UpdateTemplateRequest } from '@/types/template';

export class TemplateService {
  private static readonly httpClient = HttpClient.getDefault();

  static async getTemplates(): Promise<Template[]> {
    return this.httpClient.get<Template[]>('/templates');
  }

  static async getTemplate(id: string): Promise<Template> {
    return this.httpClient.get<Template>(`/templates/${id}`);
  }

  static async createTemplate(data: CreateTemplateRequest): Promise<Template> {
    return this.httpClient.post<Template>('/templates', data);
  }

  static async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<Template> {
    return this.httpClient.put<Template>(`/templates/${id}`, data);
  }

  static async deleteTemplate(id: string): Promise<void> {
    return this.httpClient.delete<void>(`/templates/${id}`);
  }
}
