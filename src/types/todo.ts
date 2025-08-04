export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  category_id?: string;
}

export interface UpdateTodoInput {
  id: string;
  title: string;
  category_id?: string;
}