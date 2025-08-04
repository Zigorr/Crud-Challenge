import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name must be less than 50 characters'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color code'),
  icon: z.string().optional(),
});

export const UpdateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Category name is required').max(50, 'Category name must be less than 50 characters'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color code'),
  icon: z.string().optional(),
});

export type CreateCategoryFormData = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof UpdateCategorySchema>;