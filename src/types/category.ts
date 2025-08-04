export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryInput {
  name: string;
  color: string;
  icon?: string;
}

export interface UpdateCategoryInput {
  id: string;
  name: string;
  color: string;
  icon?: string;
}