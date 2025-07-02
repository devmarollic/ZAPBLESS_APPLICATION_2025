
import { HttpClient } from '@/lib/http_client';
import { Template, CreateTemplateRequest, UpdateTemplateRequest } from '@/types/template';

export class TemplateService {
  static async getTemplates(): Promise<Template[]> {
    return HttpClient.get<Template[]>('/templates');
  }

  static async getTemplate(id: string): Promise<Template> {
    return HttpClient.get<Template>(`/templates/${id}`);
  }

  static async createTemplate(data: CreateTemplateRequest): Promise<Template> {
    return HttpClient.post<Template>('/templates', data);
  }

  static async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<Template> {
    return HttpClient.put<Template>(`/templates/${id}`, data);
  }

  static async deleteTemplate(id: string): Promise<void> {
    return HttpClient.delete<void>(`/templates/${id}`);
  }
}
