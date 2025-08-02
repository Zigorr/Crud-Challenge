import { useState } from 'react';
import { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';
import { TodoFormModal } from './TodoFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useTodos } from '../hooks/useTodos';
import { CreateTodoFormData } from '../schemas/todoSchema';

export function TodoList() {
  const { todos, loading, error, createTodo, updateTodo, toggleTodoComplete, deleteTodo } = useTodos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
        <button
          onClick={handleCreateTodo}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Todo
        </button>
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
        <div className="space-y-4">
          {(() => {
            // Sort todos: incomplete first, then completed
            const sortedTodos = [...todos].sort((a, b) => {
              if (a.completed !== b.completed) {
                return a.completed ? 1 : -1; // incomplete first
              }
              // Within each group, sort by creation date (newest first for incomplete, oldest first for completed)
              const dateA = new Date(a.created_at).getTime();
              const dateB = new Date(b.created_at).getTime();
              return a.completed ? dateA - dateB : dateB - dateA;
            });

            const incompleteTodos = sortedTodos.filter(todo => !todo.completed);
            const completedTodos = sortedTodos.filter(todo => todo.completed);

            return (
              <>
                {/* Incomplete todos */}
                {incompleteTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteClick}
                    onToggleComplete={toggleTodoComplete}
                  />
                ))}

                {/* Separator if both incomplete and completed todos exist */}
                {incompleteTodos.length > 0 && completedTodos.length > 0 && (
                  <div className="border-t border-gray-200 my-6 pt-4">
                    <span className="text-sm text-gray-500 font-medium">Completed Tasks</span>
                  </div>
                )}

                {/* Completed todos */}
                {completedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteClick}
                    onToggleComplete={toggleTodoComplete}
                  />
                ))}
              </>
            );
          })()}
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