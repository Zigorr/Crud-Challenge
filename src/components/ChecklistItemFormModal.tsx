import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChecklistItem } from '../types/checklist';
import { CreateChecklistItemFormData, CreateChecklistItemSchema } from '../schemas/checklistSchema';
import { useTheme } from '../contexts/ThemeContext';

interface ChecklistItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateChecklistItemFormData & { id?: string }) => Promise<void>;
  item?: ChecklistItem;
  title: string;
  existingCategories: string[];
}

export function ChecklistItemFormModal({ isOpen, onClose, onSubmit, item, title, existingCategories }: ChecklistItemFormModalProps) {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<CreateChecklistItemFormData>({
    title: '',
    quantity: '',
    category: 'general',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (item) {
      const isExistingCategory = existingCategories.includes(item.category);
      setFormData({
        title: item.title,
        quantity: item.quantity || '',
        category: isExistingCategory ? item.category : 'custom',
        notes: item.notes || '',
      });
      setIsCustomCategory(!isExistingCategory);
      setCustomCategory(isExistingCategory ? '' : item.category);
    } else {
      setFormData({
        title: '',
        quantity: '',
        category: existingCategories.length > 0 ? existingCategories[0] : 'general',
        notes: '',
      });
      setIsCustomCategory(false);
      setCustomCategory('');
    }
    setErrors({});
  }, [item, isOpen, existingCategories]);

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
      
      // Use custom category if selected
      const finalCategory = isCustomCategory ? customCategory.trim() : formData.category;
      const dataToSubmit = { ...formData, category: finalCategory };
      
      const validatedData = CreateChecklistItemSchema.parse(dataToSubmit);
      
      if (item) {
        await onSubmit({ ...validatedData, id: item.id });
      } else {
        await onSubmit(validatedData);
      }
      onClose();
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      if (value === 'custom') {
        setIsCustomCategory(true);
        setFormData(prev => ({ ...prev, [name]: value }));
      } else {
        setIsCustomCategory(false);
        setCustomCategory('');
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(e.target.value);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg sm:text-xl font-semibold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{title}</h2>
            <button
              onClick={onClose}
              className={`p-1 transition-colors duration-300 ${
                isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
              }`}
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Item Name *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
                  errors.title 
                    ? 'border-red-500' 
                    : isDark 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="Enter item name"
                disabled={isSubmitting}
              />
              {errors.title && <p className={`mt-1 text-sm transition-colors duration-300 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`}>{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="quantity" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Quantity
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="e.g., 1 kg, 3 bottles, 2 pieces"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="category" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                disabled={isSubmitting}
              >
                {existingCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
                <option value="custom">+ Add new category</option>
              </select>
              
              {isCustomCategory && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={handleCustomCategoryChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2 transition-colors duration-300 ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Enter new category name"
                  disabled={isSubmitting}
                />
              )}
            </div>

            <div>
              <label htmlFor="notes" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="Additional notes (optional)"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`w-full sm:w-auto px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${
                  isDark 
                    ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : item ? 'Update' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}