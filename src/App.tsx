
import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Auth } from './components/Auth';
import { TodoList } from './components/TodoList';
import { ChecklistList } from './components/ChecklistList';

type AppView = 'todos' | 'checklists';

function App() {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('todos');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative z-0 pb-16 sm:pb-0">
      <header className="bg-white shadow-sm border-b border-gray-200 relative z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {currentView === 'todos' ? 'TODO List' : 'Checklists'}
              </h1>
            </div>
            
            {/* Desktop Navigation tabs */}
            <div className="hidden sm:flex items-center gap-4">
              <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('todos')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'todos'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setCurrentView('checklists')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'checklists'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Checklists
                </button>
              </nav>
              
              <button
                onClick={signOut}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile Sign Out */}
            <div className="sm:hidden">
              <button
                onClick={signOut}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'todos' ? <TodoList /> : <ChecklistList />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-50">
        <div className="flex">
          <button
            onClick={() => setCurrentView('todos')}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-4 transition-colors ${
              currentView === 'todos'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="text-xs font-medium">Todos</span>
          </button>
          
          <button
            onClick={() => setCurrentView('checklists')}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-4 transition-colors ${
              currentView === 'checklists'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0V17m0-10a2 2 0 012 2v6a2 2 0 01-2 2m-6 4h6m0 0a1 1 0 100-2h-6a1 1 0 100 2" />
            </svg>
            <span className="text-xs font-medium">Checklists</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;