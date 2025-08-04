import { useTheme } from '../contexts/ThemeContext';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  categoryCounts: Record<string, number>;
}

export function CategoryFilter({ selectedCategory, onCategoryChange, categories, categoryCounts }: CategoryFilterProps) {
  const { isDark } = useTheme();
  const allCategories = ['all', ...categories];
  
  return (
    <div className={`rounded-lg border p-3 sm:p-4 shadow-sm transition-colors duration-300 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Categories</h3>
      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => {
          const count = category === 'all' 
            ? Object.values(categoryCounts).reduce((sum, c) => sum + c, 0)
            : categoryCounts[category] || 0;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? isDark 
                    ? 'bg-blue-900/50 text-blue-300 border-2 border-blue-600'
                    : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 border-2 border-transparent hover:bg-gray-600'
                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <span className="capitalize">{category === 'all' ? 'All' : category}</span>
              <span className={`text-xs transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}