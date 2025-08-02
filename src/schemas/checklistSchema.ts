import { z } from 'zod';

export const CreateChecklistItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  quantity: z.string().optional(),
  category: z.string().default('general'),
  notes: z.string().optional(),
});

export const UpdateChecklistItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').optional(),
  quantity: z.string().optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateChecklistItemFormData = z.infer<typeof CreateChecklistItemSchema>;
export type UpdateChecklistItemFormData = z.infer<typeof UpdateChecklistItemSchema>;