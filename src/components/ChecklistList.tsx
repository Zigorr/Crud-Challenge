import { useState } from 'react';
import { ChecklistItem } from '../types/checklist';
import { ChecklistItemRow } from './ChecklistItemRow';
import { ChecklistItemFormModal } from './ChecklistItemFormModal';
import { CategoryFilter } from './CategoryFilter';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useChecklists } from '../hooks/useChecklists';
import { CreateChecklistItemFormData } from '../schemas/checklistSchema';

export function ChecklistList() {
  const {
    checklistItems,
    loading,
    error,
    createChecklistItem,
    updateChecklistItem,
    toggleChecklistItemComplete,
    deleteChecklistItem,
  } = useChecklists();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | undefined>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ChecklistItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique categories from items
  const categories = Array.from(new Set(checklistItems.map(item => item.category))).sort();
  
  // Filter items by category
  const filteredItems = checklistItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  // Calculate category counts
  const categoryCounts = checklistItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleCreateItem = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: ChecklistItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreateChecklistItemFormData & { id?: string }) => {
    if (data.id) {
      await updateChecklistItem({ 
        id: data.id, 
        title: data.title, 
        quantity: data.quantity, 
        category: data.category, 
        notes: data.notes 
      });
    } else {
      await createChecklistItem({ 
        title: data.title, 
        quantity: data.quantity, 
        category: data.category, 
        notes: data.notes 
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  const handleDeleteClick = (item: ChecklistItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await deleteChecklistItem(itemToDelete.id);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  if (loading && checklistItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading checklist items...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Checklist</h1>
        <button
          onClick={handleCreateItem}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {categories.length > 0 && (
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          categoryCounts={categoryCounts}
        />
      )}

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {selectedCategory === 'all' ? 'No checklist items yet' : `No ${selectedCategory} items`}
          </div>
          <button
            onClick={handleCreateItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add your first item
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <ChecklistItemRow
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteClick}
              onToggleComplete={toggleChecklistItemComplete}
            />
          ))}
        </div>
      )}

      <ChecklistItemFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        item={editingItem}
        title={editingItem ? 'Edit Item' : 'Add Item'}
        existingCategories={categories.length > 0 ? categories : ['general']}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        item={itemToDelete ? { id: itemToDelete.id, title: itemToDelete.title } : null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}