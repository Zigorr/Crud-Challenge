import { useState, useMemo, useEffect, useRef } from 'react';
import { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';
import { TodoFormModal } from './TodoFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useTodos } from '../hooks/useTodos';
import { CreateTodoFormData } from '../schemas/todoSchema';

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
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50"
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
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                  value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
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

export function TodoList() {
  const { todos, loading, error, createTodo, updateTodo, toggleTodoComplete, deleteTodo } = useTodos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('date_desc');
  const [isActiveExpanded, setIsActiveExpanded] = useState(true);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(true);

  // Sort todos and separate into active and completed
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

  const handleCreateTodo = () => {
    setEditingTodo(undefined);
    setIsModalOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreateTodoFormData & { id?: string }) => {
    if (data.id) {
      await updateTodo({ id: data.id, title: data.title });
    } else {
      await createTodo({ title: data.title });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(undefined);
  };

  const handleDeleteClick = (todo: Todo) => {
    setTodoToDelete(todo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (todoToDelete) {
      await deleteTodo(todoToDelete.id);
      setIsDeleteModalOpen(false);
      setTodoToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTodoToDelete(null);
  };

  if (loading && todos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
        <button
          onClick={handleCreateTodo}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Todo
        </button>
      </div>

      {/* Sort Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
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
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {todos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No todos yet</div>
          <button
            onClick={handleCreateTodo}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create your first todo
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Todos Section */}
          <div className="space-y-4">
            <button
              onClick={() => setIsActiveExpanded(!isActiveExpanded)}
              className="flex items-center gap-3 w-full text-left hover:bg-gray-50 p-2 -m-2 rounded-md transition-colors"
            >
              <svg
                className={`w-4 h-4 text-gray-600 transition-transform ${
                  isActiveExpanded ? 'rotate-90' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-900">
                Active Todos
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({activeTodos.length})
                </span>
              </h2>
            </button>
            {isActiveExpanded && (
              <div className="ml-5">
                {activeTodos.length === 0 ? (
                  <div className="text-gray-500 text-sm italic">
                    No active todos
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onEdit={handleEditTodo}
                        onDelete={handleDeleteClick}
                        onToggleComplete={toggleTodoComplete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Completed Todos Section */}
          <div className="space-y-4">
            <button
              onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
              className="flex items-center gap-3 w-full text-left hover:bg-gray-50 p-2 -m-2 rounded-md transition-colors"
            >
              <svg
                className={`w-4 h-4 text-gray-600 transition-transform ${
                  isCompletedExpanded ? 'rotate-90' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-900">
                Completed Todos
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({completedTodos.length})
                </span>
              </h2>
            </button>
            {isCompletedExpanded && (
              <div className="ml-5">
                {completedTodos.length === 0 ? (
                  <div className="text-gray-500 text-sm italic">
                    No completed todos
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onEdit={handleEditTodo}
                        onDelete={handleDeleteClick}
                        onToggleComplete={toggleTodoComplete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <TodoFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        todo={editingTodo}
        title={editingTodo ? 'Edit Todo' : 'Create Todo'}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        item={todoToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}