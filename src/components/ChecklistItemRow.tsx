import { ChecklistItem } from '../types/checklist';

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onEdit: (item: ChecklistItem) => void;
  onDelete: (item: ChecklistItem) => void;
  onToggleComplete: (id: string) => void;
}

export function ChecklistItemRow({ item, onEdit, onDelete, onToggleComplete }: ChecklistItemRowProps) {
  const handleDelete = () => {
    onDelete(item);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(item.id)}
          className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded border-2 border-gray-300 hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-0.5"
          title={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {item.completed && (
            <div className="w-full h-full rounded bg-green-500 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>

        {/* Item content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <h4 className={`text-sm sm:text-base font-medium break-words ${
              item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {item.title}
            </h4>
            
            {/* Quantity and category */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              {item.quantity && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                  {item.quantity}
                </span>
              )}
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                {item.category}
              </span>
            </div>
          </div>
          
          {/* Notes */}
          {item.notes && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
              {item.notes}
            </p>
          )}

          {/* Created date */}
          <p className="text-xs text-gray-500 mt-1">
            Created: {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit item"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 sm:p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            title="Delete item"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}