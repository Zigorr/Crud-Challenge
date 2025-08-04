import { useState, useMemo, useEffect, useRef } from 'react';
import { Todo } from '../types/todo';
import { Category } from '../types/category';
import { TodoItem } from './TodoItem';
import { TodoFormModal } from './TodoFormModal';
import { CategoryFormModal } from './CategoryFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useTodos } from '../hooks/useTodos';
import { useCategories } from '../hooks/useCategories';
import { useTheme } from '../contexts/ThemeContext';
import { CreateTodoFormData } from '../schemas/todoSchema';
import { CreateCategoryFormData } from '../schemas/categorySchema';

type SortOption = 'date_desc' | 'date_asc' | 'title_asc' | 'title_desc';

interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string; count?: number }[];
  onChange: (value: string) => void;
}

function Dropdown({ label, value, options, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);
  const { isDark } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded-md px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
            : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm">
            {selectedOption?.label}
            {selectedOption?.count !== undefined && (
              <span className="text-gray-500 ml-1">({selectedOption.count})</span>
            )}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div className={`absolute z-10 mt-1 w-full border rounded-md shadow-lg transition-colors duration-300 ${
          isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
        }`}>
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors duration-300 ${
                  value === option.value 
                    ? isDark 
                      ? 'bg-blue-900/50 text-blue-300' 
                      : 'bg-blue-50 text-blue-700'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                {option.label}
                {option.count !== undefined && (
                  <span className="text-gray-500 ml-1">({option.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface CategorySectionProps {
  category: Category | null;
  todos: Todo[];
  sortOption: SortOption;
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (todo: Todo) => void;
  onToggleComplete: (id: string) => void;
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
}

function CategorySection({ 
  category, 
  todos, 
  sortOption, 
  onEditTodo, 
  onDeleteTodo, 
  onToggleComplete,
  onEditCategory,
  onDeleteCategory 
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeExpanded, setActiveExpanded] = useState(true);
  const [completedExpanded, setCompletedExpanded] = useState(true);

  const { activeTodos, completedTodos } = useMemo(() => {
    const sortTodos = (todoList: Todo[]) => {
      return [...todoList].sort((a, b) => {
        switch (sortOption) {
          case 'date_asc':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'date_desc':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'title_asc':
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
          case 'title_desc':
            return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
          default:
            return 0;
        }
      });
    };

    const active = todos.filter(todo => !todo.completed);
    const completed = todos.filter(todo => todo.completed);

    return {
      activeTodos: sortTodos(active),
      completedTodos: sortTodos(completed)
    };
  }, [todos, sortOption]);

  const categoryName = category ? category.name : 'Uncategorized';
  const categoryIcon = category ? category.icon : '📋';
  const categoryColor = category ? category.color : '#6B7280';

  const { isDark } = useTheme();

  return (
    <div className={`rounded-lg border shadow-sm transition-colors duration-300 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className={`p-4 border-b transition-colors duration-300 ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-3">
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform ${
                isExpanded ? 'rotate-90' : 'rotate-0'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: categoryColor }}
            ></div>
            <span className={`text-lg font-semibold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {categoryIcon} {categoryName}
            </span>
            <span className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>({todos.length})</span>
          </div>
          {category && (
            <div className="flex items-center gap-2">
              {onEditCategory && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCategory(category);
                  }}
                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit category"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDeleteCategory && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(category);
                  }}
                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Delete category"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Active Todos */}
          <div>
            <button
              onClick={() => setActiveExpanded(!activeExpanded)}
              className={`flex items-center gap-3 w-full text-left p-2 -m-2 rounded-md transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <svg
                className={`w-3 h-3 text-gray-600 transition-transform ${
                  activeExpanded ? 'rotate-90' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className={`text-sm font-medium transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Active ({activeTodos.length})
              </span>
            </button>
            {activeExpanded && (
              <div className="ml-6 mt-2">
                {activeTodos.length === 0 ? (
                  <div className={`text-sm italic py-2 transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No active todos
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onEdit={onEditTodo}
                        onDelete={onDeleteTodo}
                        onToggleComplete={onToggleComplete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Completed Todos */}
          <div>
            <button
              onClick={() => setCompletedExpanded(!completedExpanded)}
              className={`flex items-center gap-3 w-full text-left p-2 -m-2 rounded-md transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <svg
                className={`w-3 h-3 text-gray-600 transition-transform ${
                  completedExpanded ? 'rotate-90' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`text-sm font-medium transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Completed ({completedTodos.length})
              </span>
            </button>
            {completedExpanded && (
              <div className="ml-6 mt-2">
                {completedTodos.length === 0 ? (
                  <div className={`text-sm italic py-2 transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No completed todos
                  </div>
                ) : (
                  <div className="space-y-2">
                    {completedTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onEdit={onEditTodo}
                        onDelete={onDeleteTodo}
                        onToggleComplete={onToggleComplete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function TodoList() {
  const { todos, loading, error, createTodo, updateTodo, toggleTodoComplete, deleteTodo } = useTodos();
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  const { isDark } = useTheme();
  
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'todo' | 'category'; item: Todo | Category } | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('date_desc');

  // Group todos by category
  const todosByCategory = useMemo(() => {
    const groups = new Map<string | null, Todo[]>();
    
    todos.forEach(todo => {
      const categoryId = todo.category_id || null;
      if (!groups.has(categoryId)) {
        groups.set(categoryId, []);
      }
      groups.get(categoryId)!.push(todo);
    });

    return groups;
  }, [todos]);

  const handleCreateTodo = () => {
    setEditingTodo(undefined);
    setIsTodoModalOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsTodoModalOpen(true);
  };
  
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleSubmitTodo = async (data: CreateTodoFormData & { id?: string }) => {
    if (data.id) {
      await updateTodo({ id: data.id, title: data.title, category_id: data.category_id });
    } else {
      await createTodo({ title: data.title, category_id: data.category_id });
    }
  };

  const handleSubmitCategory = async (data: CreateCategoryFormData & { id?: string }) => {
    if (data.id) {
      await updateCategory({ id: data.id, name: data.name, color: data.color, icon: data.icon });
    } else {
      await createCategory({ name: data.name, color: data.color, icon: data.icon });
    }
  };

  const handleCloseTodoModal = () => {
    setIsTodoModalOpen(false);
    setEditingTodo(undefined);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(undefined);
  };



  const handleDeleteClick = (type: 'todo' | 'category', item: Todo | Category) => {
    setItemToDelete({ type, item });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'todo') {
        await deleteTodo(itemToDelete.item.id);
      } else {
        await deleteCategory(itemToDelete.item.id);
      }
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  if (loading && todos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`transition-colors duration-300 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className={`text-2xl font-bold transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>My Todos</h1>
        <div className="flex gap-3">
          <button
            onClick={handleCreateTodo}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Todo
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className={`rounded-lg border p-4 shadow-sm transition-colors duration-300 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-xs">
          <Dropdown
            label="Sort by"
            value={sortOption}
            options={[
              { value: 'date_desc', label: 'Date (Newest First)' },
              { value: 'date_asc', label: 'Date (Oldest First)' },
              { value: 'title_asc', label: 'Title (A to Z)' },
              { value: 'title_desc', label: 'Title (Z to A)' }
            ]}
            onChange={(value) => setSortOption(value as SortOption)}
          />
        </div>
      </div>

      {error && (
        <div className={`border px-4 py-3 rounded-md transition-colors duration-300 ${
          isDark 
            ? 'bg-red-900/20 border-red-800 text-red-400'
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {error}
        </div>
      )}

      {todos.length === 0 ? (
        <div className="text-center py-12">
          <div className={`mb-4 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>No todos yet</div>
          <div className="space-x-4">
            <button
              onClick={handleCreateTodo}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create your first todo
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Categorized Todos */}
          {categories.map(category => {
            const categoryTodos = todosByCategory.get(category.id) || [];
            if (categoryTodos.length === 0) return null;
            
            return (
              <CategorySection
                key={category.id}
                category={category}
                todos={categoryTodos}
                sortOption={sortOption}
                onEditTodo={handleEditTodo}
                onDeleteTodo={(todo) => handleDeleteClick('todo', todo)}
                onToggleComplete={toggleTodoComplete}
                onEditCategory={handleEditCategory}
                onDeleteCategory={(category) => handleDeleteClick('category', category)}
              />
            );
          })}

          {/* Uncategorized Todos */}
          {(() => {
            const uncategorizedTodos = todosByCategory.get(null) || [];
            if (uncategorizedTodos.length === 0) return null;
            
            return (
              <CategorySection
                key="uncategorized"
                category={null}
                todos={uncategorizedTodos}
                sortOption={sortOption}
                onEditTodo={handleEditTodo}
                onDeleteTodo={(todo) => handleDeleteClick('todo', todo)}
                onToggleComplete={toggleTodoComplete}
              />
            );
          })()}

          {/* Categories without todos */}
          {categories.filter(category => !todosByCategory.has(category.id) || todosByCategory.get(category.id)!.length === 0).map(category => (
            <CategorySection
              key={`empty-${category.id}`}
              category={category}
              todos={[]}
              sortOption={sortOption}
              onEditTodo={handleEditTodo}
              onDeleteTodo={(todo) => handleDeleteClick('todo', todo)}
              onToggleComplete={toggleTodoComplete}
              onEditCategory={handleEditCategory}
              onDeleteCategory={(category) => handleDeleteClick('category', category)}
            />
          ))}
        </div>
      )}

      <TodoFormModal
        isOpen={isTodoModalOpen}
        onClose={handleCloseTodoModal}
        onSubmit={handleSubmitTodo}
        onCreateCategory={createCategory}
        todo={editingTodo}
        title={editingTodo ? 'Edit Todo' : 'Create Todo'}
        categories={categories}
      />

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        onSubmit={handleSubmitCategory}
        category={editingCategory}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        item={itemToDelete?.item || null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}