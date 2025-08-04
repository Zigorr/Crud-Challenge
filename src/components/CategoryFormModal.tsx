import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CreateCategorySchema, UpdateCategorySchema, CreateCategoryFormData } from '../schemas/categorySchema';
import { Category } from '../types/category';
import { useTheme } from '../contexts/ThemeContext';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryFormData & { id?: string }) => Promise<void>;
  category?: Category;
  title: string;
}

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

export function CategoryFormModal({ isOpen, onClose, onSubmit, category, title }: CategoryFormModalProps) {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<CreateCategoryFormData>({
    name: '',
    color: DEFAULT_COLORS[0],
    icon: ICONS[0].value,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
        icon: category.icon || ICONS[0].value,
      });
    } else {
      setFormData({
        name: '',
        color: DEFAULT_COLORS[0],
        icon: ICONS[0].value,
      });
    }
    setErrors({});
  }, [category, isOpen]);

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
      const schema = category ? UpdateCategorySchema : CreateCategorySchema;
      const validatedData = schema.parse(
        category ? { ...formData, id: category.id } : formData
      );

      setIsSubmitting(true);
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

  const handleChange = (field: keyof CreateCategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
            <label htmlFor="name" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Category Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                errors.name 
                  ? 'border-red-500' 
                  : isDark 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900'
              }`}
              placeholder="e.g., Work, Personal, Study"
              autoFocus
            />
            {errors.name && <p className={`text-sm mt-1 transition-colors duration-300 ${
              isDark ? 'text-red-400' : 'text-red-500'
            }`}>{errors.name}</p>}
          </div>

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
                  onClick={() => handleChange('icon', icon.value)}
                  className={`p-2 text-xl border rounded-md transition-colors duration-300 ${
                    formData.icon === icon.value 
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
                  onClick={() => handleChange('color', color)}
                  className={`w-8 h-8 rounded-full border-2 transition-colors duration-300 ${
                    formData.color === color 
                      ? isDark ? 'border-white' : 'border-gray-800'
                      : isDark ? 'border-gray-600' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            {errors.color && <p className={`text-sm mt-1 transition-colors duration-300 ${
              isDark ? 'text-red-400' : 'text-red-500'
            }`}>{errors.color}</p>}
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
              {isSubmitting ? 'Saving...' : category ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}