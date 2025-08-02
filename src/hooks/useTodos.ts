import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';
import { useAuth } from './useAuth';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTodos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setTodos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (input: CreateTodoInput) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            title: input.title,
            completed: false,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTodos(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (input: UpdateTodoInput) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('todos')
        .update({
          title: input.title,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTodos(prev =>
        prev.map(todo => (todo.id === input.id ? data : todo))
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTodoComplete = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      // Find the current todo to get its current completed status
      const currentTodo = todos.find(todo => todo.id === id);
      if (!currentTodo) throw new Error('Todo not found');

      const { data, error } = await supabase
        .from('todos')
        .update({
          completed: !currentTodo.completed,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTodos(prev =>
        prev.map(todo => (todo.id === id ? data : todo))
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [user]);

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    toggleTodoComplete,
    deleteTodo,
    refetch: fetchTodos,
  };
}