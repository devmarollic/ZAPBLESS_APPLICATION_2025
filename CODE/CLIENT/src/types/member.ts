
import { z } from 'zod';

export const memberFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um e-mail válido").optional().or(z.literal('')),
  phone: z.string().min(10, "O telefone deve ter pelo menos 10 dígitos"),
  birthDate: z.date().optional(),
  address: z.string().optional(),
  ministries: z.array(z.string()).optional(),
  baptismDate: z.date().optional(),
  notes: z.string().optional(),
  status: z.string().default("active"),
  ecclesiasticalTitle: z.string().optional(),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;

export type Ministry = {
  id: string;
  name: string;
  description: string;
}

export type MinistryMembership = {
  ministryId: string;
  role: string;
}
