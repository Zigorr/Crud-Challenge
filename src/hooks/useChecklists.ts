import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  ChecklistItem, 
  CreateChecklistItemInput,
  UpdateChecklistItemInput
} from '../types/checklist';
import { useAuth } from './useAuth';

export function useChecklists() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchChecklistItems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setChecklistItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };



  const createChecklistItem = async (input: CreateChecklistItemInput) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('checklist_items')
        .insert([{
          title: input.title,
          quantity: input.quantity,
          category: input.category || 'general',
          notes: input.notes,
          completed: false,
          user_id: user.id,
        }])
        .select()
        .single();
        
      if (error) throw error;
      setChecklistItems(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateChecklistItem = async (input: UpdateChecklistItemInput) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('checklist_items')
        .update({ 
          title: input.title,
          quantity: input.quantity,
          category: input.category,
          notes: input.notes,
          updated_at: new Date().toISOString() 
        })
        .eq('id', input.id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      setChecklistItems(prev => prev.map(item => 
        item.id === input.id ? data : item
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklistItemComplete = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      
      const currentItem = checklistItems.find(item => item.id === id);
      if (!currentItem) throw new Error('Item not found');
      
      const { data, error } = await supabase
        .from('checklist_items')
        .update({ 
          completed: !currentItem.completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      setChecklistItems(prev => prev.map(item => 
        item.id === id ? data : item
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteChecklistItem = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('checklist_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      setChecklistItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklistItems();
  }, [user]);

  return {
    checklistItems,
    loading,
    error,
    createChecklistItem,
    updateChecklistItem,
    toggleChecklistItemComplete,
    deleteChecklistItem,
    refetch: fetchChecklistItems,
  };
}