
import { Todo } from '../types/todo';
import { useTheme } from '../contexts/ThemeContext';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onToggleComplete: (id: string) => void;
}

export function TodoItem({ todo, onEdit, onDelete, onToggleComplete }: TodoItemProps) {
  const { isDark } = useTheme();
  
  const handleDelete = () => {
    onDelete(todo);
  };

  return (
    <div className={`rounded-lg border p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
      isDark 
        ? 'bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-900/50' 
        : 'bg-white border-gray-200 hover:shadow-md'
    }`}>
      <div className="flex items-center gap-3">
        {/* Clickable completion circle */}
        <button
          onClick={() => onToggleComplete(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isDark 
              ? 'border-gray-600 hover:border-blue-400 focus:ring-offset-gray-800' 
              : 'border-gray-300 hover:border-blue-500 focus:ring-offset-white'
          }`}
          title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && (
            <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>

        {/* Todo content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium break-words transition-colors duration-300 ${
            todo.completed 
              ? isDark ? 'text-gray-500 line-through' : 'text-gray-500 line-through'
              : isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {todo.title}
          </h3>
          <p className={`text-sm mt-1 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Created: {new Date(todo.created_at).toLocaleDateString()}
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(todo)}
            className={`p-2 rounded-md transition-colors ${
              isDark 
                ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' 
                : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
            }`}
            title="Edit todo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className={`p-2 rounded-md transition-colors ${
              isDark 
                ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' 
                : 'text-red-600 hover:text-red-800 hover:bg-red-50'
            }`}
            title="Delete todo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}