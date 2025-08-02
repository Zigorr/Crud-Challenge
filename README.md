# TODO List Application

A modern, full-stack TODO list application built with React, TypeScript, Tailwind CSS, and Supabase. Features user isolation, real-time data persistence, and a clean, responsive interface.

## Features

- **Full CRUD Operations**: Create, read, update, and delete todos
- **User Isolation**: Each user session has isolated todo data
- **Real-time Persistence**: Data stored in Supabase database
- **Unified Modal**: Single reusable modal for both create and edit operations
- **Form Validation**: Zod-based validation with user-friendly error messages
- **Responsive Design**: Clean, modern interface built with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Authentication)
- **Build Tool**: Vite
- **Validation**: Zod
- **State Management**: React Hooks (useState, useEffect)

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth.tsx        # Authentication component
│   ├── TodoFormModal.tsx  # Unified create/edit modal
│   ├── TodoItem.tsx    # Individual todo item
│   └── TodoList.tsx    # Main todo list component
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   └── useTodos.ts     # Todo CRUD operations hook
├── lib/                # External service configurations
│   └── supabase.ts     # Supabase client setup
├── schemas/            # Zod validation schemas
│   └── todoSchema.ts   # Todo form validation
├── types/              # TypeScript type definitions
│   └── todo.ts         # Todo-related types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## Data Model

### Todo Entity
- `id`: Unique identifier (string)
- `title`: Todo description (string, required)
- `status`: Current status (enum: "To Do", "In Progress", "Completed")
- `user_id`: User identifier for isolation (string)
- `created_at`: Creation timestamp (string)
- `updated_at`: Last update timestamp (string)

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Supabase account and project

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd "TODO list"
npm install
```

### 2. Supabase Setup

1. Create a new project in Supabase
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema

Create the following table in your Supabase SQL editor:

```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Completed')),
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policy for user isolation
CREATE POLICY "Users can only access their own todos" ON todos
  FOR ALL USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4. Configure Authentication

In your Supabase dashboard:
1. Go to Authentication > Settings
2. Configure email authentication:
   - **Site URL**: Set to your domain (e.g., `http://localhost:5173` for development)
   - **Redirect URLs**: Add your domain
   - **Email Auth**: Enabled by default
   - **Email Confirmations**: Enable "Enable email confirmations"

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Getting Started
1. Open the application in your browser
2. **Sign Up**: Create an account with your email and password
3. **Email Verification**: Check your email and click the verification link
4. **Sign In**: Use your credentials to access your todos
5. Start creating and managing your todos

### Creating Todos
1. Click the "Add Todo" button
2. Enter a title for your todo
3. Select a status (To Do, In Progress, or Completed)
4. Click "Create" to save

### Editing Todos
1. Click the edit icon (pencil) on any todo item
2. Modify the title or status as needed
3. Click "Update" to save changes

### Deleting Todos
1. Click the delete icon (trash) on any todo item
2. Confirm the deletion in the popup dialog

### User Isolation
- Each registered user has their own private todo list
- Todos are completely isolated between user accounts
- Data persists across sessions when you sign in with your account
- No data is shared between different user accounts

## Component Architecture

### TodoFormModal
- Unified modal component for both create and edit operations
- Receives props to determine mode and initial data
- Handles form validation using Zod schemas
- Supports real-time error display

### useTodos Hook
- Manages all todo CRUD operations
- Handles Supabase database interactions
- Provides loading and error states
- Ensures user isolation for all operations

### useAuth Hook
- Manages authentication state
- Handles anonymous sign-in/sign-out
- Provides user context throughout the application

## Form Validation

The application uses Zod for form validation with the following rules:
- **Title**: Required field, minimum 1 character
- **Status**: Must be one of "To Do", "In Progress", or "Completed"

## Error Handling

- Database errors are caught and displayed with user-friendly messages
- Form validation errors appear inline with the relevant fields
- Network issues are handled gracefully with appropriate feedback

## Performance Features

- Optimistic UI updates for better user experience
- Efficient re-rendering using React hooks
- Minimal API calls with proper state management

## Security

- User isolation enforced at the database level
- Row Level Security (RLS) policies prevent data leakage
- Anonymous authentication provides session-based access

## Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration for code consistency
- Proper error boundaries and error handling

## Troubleshooting

### Common Issues

**Environment Variables Not Loading**
- Ensure `.env` file is in the project root
- Restart the development server after adding environment variables

**Database Connection Issues**
- Verify Supabase URL and anon key are correct
- Check that the todos table exists in your Supabase project
- Ensure Row Level Security policies are properly configured

**Authentication Problems**
- Verify that anonymous authentication is enabled in Supabase
- Check browser console for authentication errors