import { z } from 'zod';

export const TodoStatusEnum = z.enum(['To Do', 'In Progress', 'Completed']);

export const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  status: TodoStatusEnum,
});

export const UpdateTodoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  status: TodoStatusEnum,
});

export type CreateTodoFormData = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoFormData = z.infer<typeof UpdateTodoSchema>;