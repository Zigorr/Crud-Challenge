export interface ChecklistItem {
  id: string;
  title: string;
  quantity?: string;
  category: string;
  completed: boolean;
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateChecklistItemInput {
  title: string;
  quantity?: string;
  category?: string;
  notes?: string;
}

export interface UpdateChecklistItemInput {
  id: string;
  title?: string;
  quantity?: string;
  category?: string;
  notes?: string;
}