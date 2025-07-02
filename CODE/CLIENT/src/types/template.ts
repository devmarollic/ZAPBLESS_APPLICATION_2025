
export type TemplateCategoryId = 
  | 'reminder' 
  | 'notification' 
  | 'thank-you' 
  | 'follow-up' 
  | 'announcement' 
  | 'roster';

export interface Template {
  id: string;
  name: string;
  categoryId: TemplateCategoryId;
  languageTag: string;
  content: string;
  allowCategoryChange: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTemplateRequest {
  name: string;
  categoryId: TemplateCategoryId;
  languageTag: string;
  content: string;
  allowCategoryChange: boolean;
  isActive: boolean;
}

export interface UpdateTemplateRequest {
  name?: string;
  categoryId?: TemplateCategoryId;
  languageTag?: string;
  content?: string;
  allowCategoryChange?: boolean;
  isActive?: boolean;
}
