export interface Todo {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  status: 'To Do' | 'In Progress' | 'Completed';
}

export interface UpdateTodoInput extends CreateTodoInput {
  id: string;
}