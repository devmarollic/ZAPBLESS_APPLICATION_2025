
export type UserRole = 'administrator' | 'minister' | 'leader' | 'secretary' | 'treasurer' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  roleSlugArray: { roleSlug: UserRole }[];
  lastLogin?: string;
}
