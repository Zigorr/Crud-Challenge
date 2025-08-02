interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  categoryCounts: Record<string, number>;
}

export function CategoryFilter({ selectedCategory, onCategoryChange, categories, categoryCounts }: CategoryFilterProps) {
  const allCategories = ['all', ...categories];
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
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
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <span className="capitalize">{category === 'all' ? 'All' : category}</span>
              <span className="text-xs text-gray-500">({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}