import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CreateTodoSchema, UpdateTodoSchema, CreateTodoFormData } from '../schemas/todoSchema';
import { CreateCategorySchema, CreateCategoryFormData } from '../schemas/categorySchema';
import { Todo } from '../types/todo';
import { Category } from '../types/category';
import { useTheme } from '../contexts/ThemeContext';

const DEFAULT_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6B7280', // Gray
];

const ICONS = [
  { value: '📚', label: 'Books' },
  { value: '💼', label: 'Work' },
  { value: '🏠', label: 'Home' },
  { value: '🎯', label: 'Goals' },
  { value: '💪', label: 'Health' },
  { value: '🎨', label: 'Creative' },
  { value: '🛒', label: 'Shopping' },
  { value: '✈️', label: 'Travel' },
  { value: '💰', label: 'Finance' },
  { value: '📝', label: 'Notes' },
];

interface TodoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTodoFormData & { id?: string }) => Promise<void>;
  onCreateCategory: (data: CreateCategoryFormData) => Promise<void>;
  todo?: Todo;
  title: string;
  categories: Category[];
}

export function TodoFormModal({ isOpen, onClose, onSubmit, onCreateCategory, todo, title, categories }: TodoFormModalProps) {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<CreateTodoFormData>({
    title: '',
    category_id: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState(ICONS[0].value);
  const [newCategoryColor, setNewCategoryColor] = useState(DEFAULT_COLORS[0]);

  useEffect(() => {
    if (todo) {
      const existingCategory = categories.find(cat => cat.id === todo.category_id);
      setFormData({
        title: todo.title,
        category_id: existingCategory ? todo.category_id || '' : 'custom',
      });
      setIsCustomCategory(!existingCategory);
      setCustomCategory(existingCategory ? '' : (todo.category_id || ''));
    } else {
      setFormData({
        title: '',
        category_id: categories.length > 0 ? categories[0].id : '',
      });
      setIsCustomCategory(false);
      setCustomCategory('');
      setNewCategoryIcon(ICONS[0].value);
      setNewCategoryColor(DEFAULT_COLORS[0]);
    }
    setErrors({});
  }, [todo, isOpen, categories]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      setIsSubmitting(true);
      
      let finalCategoryId = formData.category_id;
      
      // If custom category is selected, create the new category first
      if (isCustomCategory && customCategory.trim()) {
        const categoryData = {
          name: customCategory.trim(),
          icon: newCategoryIcon,
          color: newCategoryColor,
        };
        
        const validatedCategoryData = CreateCategorySchema.parse(categoryData);
        await onCreateCategory(validatedCategoryData);
        
        // The new category will be added to the categories list
        // We'll set category_id to undefined for now, and the todo will be created without a category
        finalCategoryId = undefined;
      } else if (isCustomCategory) {
        // If custom category is selected but no name provided, set to undefined
        finalCategoryId = undefined;
      }
      
      const dataToSubmit = { ...formData, category_id: finalCategoryId };
      
      const schema = todo ? UpdateTodoSchema : CreateTodoSchema;
      const validatedData = schema.parse(
        todo ? { ...dataToSubmit, id: todo.id } : dataToSubmit
      );

      await onSubmit(validatedData);
      onClose();
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateTodoFormData, value: string) => {
    if (field === 'category_id') {
      if (value === 'custom') {
        setIsCustomCategory(true);
        setFormData(prev => ({ ...prev, [field]: value }));
      } else {
        setIsCustomCategory(false);
        setCustomCategory('');
        setNewCategoryIcon(ICONS[0].value);
        setNewCategoryColor(DEFAULT_COLORS[0]);
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(e.target.value);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4" style={{zIndex: 999999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>
      <div className={`rounded-lg p-6 w-full max-w-md shadow-xl transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>{title}</h2>
          <button
            onClick={onClose}
            className={`transition-colors duration-300 ${
              isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Task Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                errors.title 
                  ? 'border-red-500' 
                  : isDark 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900'
              }`}
              placeholder="What needs to be done?"
              autoFocus
            />
            {errors.title && <p className={`text-sm mt-1 transition-colors duration-300 ${
              isDark ? 'text-red-400' : 'text-red-500'
            }`}>{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="category" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Category (Optional)
            </label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => handleChange('category_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                isDark 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="">No Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
              <option value="custom">+ Add new category</option>
            </select>
            
            {isCustomCategory && (
              <div className="space-y-3 mt-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={handleCustomCategoryChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Enter new category name"
                  autoFocus
                />
                
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {ICONS.map((icon) => (
                      <button
                        key={icon.value}
                        type="button"
                        onClick={() => setNewCategoryIcon(icon.value)}
                        className={`p-2 text-xl border rounded-md transition-colors duration-300 ${
                          newCategoryIcon === icon.value 
                            ? isDark 
                              ? 'border-blue-400 bg-blue-900/30' 
                              : 'border-blue-500 bg-blue-50'
                            : isDark
                              ? 'border-gray-600 hover:bg-gray-700'
                              : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        title={icon.label}
                      >
                        {icon.value}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {DEFAULT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCategoryColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-colors duration-300 ${
                          newCategoryColor === color 
                            ? isDark ? 'border-white' : 'border-gray-800'
                            : isDark ? 'border-gray-600' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-300 ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : todo ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}