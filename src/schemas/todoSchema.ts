import { z } from 'zod';

export const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category_id: z.string().optional(),
});

export const UpdateTodoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  category_id: z.string().optional(),
});

export type CreateTodoFormData = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoFormData = z.infer<typeof UpdateTodoSchema>;