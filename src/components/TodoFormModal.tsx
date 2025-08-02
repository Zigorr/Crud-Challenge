import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CreateTodoSchema, UpdateTodoSchema, CreateTodoFormData } from '../schemas/todoSchema';
import { Todo } from '../types/todo';

interface TodoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTodoFormData & { id?: string }) => Promise<void>;
  todo?: Todo;
  title: string;
}

export function TodoFormModal({ isOpen, onClose, onSubmit, todo, title }: TodoFormModalProps) {
  const [formData, setFormData] = useState<CreateTodoFormData>({
    title: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
      });
    } else {
      setFormData({
        title: '',
      });
    }
    setErrors({});
  }, [todo, isOpen]);

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
      const schema = todo ? UpdateTodoSchema : CreateTodoSchema;
      const validatedData = schema.parse(
        todo ? { ...formData, id: todo.id } : formData
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

  const handleChange = (value: string) => {
    setFormData({ title: value });
    if (errors.title) {
      setErrors({});
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4" style={{zIndex: 999999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="What needs to be done?"
              autoFocus
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
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