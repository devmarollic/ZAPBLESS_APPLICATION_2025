
export interface Template {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  language: {
    code: string;
    name: string;
  };
  content: string;
  allowCategoryChange: boolean;
  isActive: boolean;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface CreateTemplateRequest {
  name: string;
  categoryId: string;
  languageTag: string;
  content: string;
  allowCategoryChange: boolean;
  isActive: boolean;
}

export interface UpdateTemplateRequest {
  name?: string;
  categoryId?: string;
  languageTag?: string;
  content?: string;
  allowCategoryChange?: boolean;
  isActive?: boolean;
}

export interface TemplateCategory {
  id: string;
  name: string;
}