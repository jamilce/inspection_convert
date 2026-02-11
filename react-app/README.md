# Smart Audit Management System - React Application

This is a modern React + Vite + TypeScript implementation of the Smart Audit Management System, migrated from the legacy jQuery/Bootstrap application.

## Features

- ✅ **React + Vite + TypeScript** - Modern development stack
- ✅ **React Router** - Client-side routing with protected routes
- ✅ **React Hook Form** - Form management and validation
- ✅ **i18n Support** - English and Arabic with RTL support
- ✅ **Authentication** - Token-based auth with session management
- ✅ **Axios** - Centralized API client with auth interceptors
- ✅ **Toast Notifications** - User feedback with react-hot-toast
- ✅ **Error Boundary** - Graceful error handling
- ✅ **Legacy Style Preservation** - AdminBSB theme with modern enhancements

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update environment variables in `.env`:
```env
VITE_API_BASE_URL=https://your-api-url.com
VITE_API_TIMEOUT=30000
VITE_GOOGLE_MAP_ID=your-google-map-id
```

## Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

## Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The production build will be in the `dist/` directory.

## Project Structure

```
react-app/
├── public/              # Static assets
│   ├── legacy-css/     # Legacy CSS from original app
│   ├── fonts/          # Font files
│   └── images/         # Image assets
├── src/
│   ├── components/     # Reusable React components
│   │   ├── common/    # Common components (Layout, ProtectedRoute, etc.)
│   │   └── fields/    # Form field components (TODO)
│   ├── contexts/      # React contexts (Auth, I18n)
│   ├── hooks/         # Custom React hooks
│   ├── i18n/          # Translation files (en.json, ar.json)
│   ├── pages/         # Page components organized by feature
│   ├── services/      # API services (axios client)
│   ├── styles/        # Global styles and enhancements
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main app component with routing
│   └── main.tsx       # Entry point
```

## Routes

### Public Routes
- `/login` - Login page

### Protected Routes (require authentication)
- `/home` - Main landing page
- `/dashboard` - Performance dashboard
- `/audits/create` - Create new audit
- `/establishments` - Establishment listing
- `/establishments/create` - Create new establishment
- `/mailbox` - Inbox and notifications
- `/reports` - Reports listing
- `/incidents` - Incidents listing
- `/employees` - Employee management
- `/notifications` - Notifications
- `/profile` - User profile

## Internationalization (i18n)

The app supports English and Arabic languages with full RTL support for Arabic.

### Using translations

```tsx
import { useT } from '../contexts/I18nContext';

function MyComponent() {
  const t = useT();
  return <h1>{t('common.home')}</h1>;
}
```

## Authentication

Token-based authentication with automatic session management.

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ...
}
```

## API Client

Centralized API client in `src/services/api.ts`:

```tsx
import { api } from '../services/api';

async function loadData() {
  const response = await api.dashboard.getEmployeeDashboard();
  console.log(response.data);
}
```

## Deployment

### Building for Production

```bash
npm run build
```

### Environment Variables

Required for production:
- `VITE_API_BASE_URL` - API endpoint
- `VITE_API_TIMEOUT` - Request timeout
- `VITE_GOOGLE_MAP_ID` - Google Maps API key

### Deploy to nginx

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /path/to/dist;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Migration Status

### ✅ Completed
- Project setup (React + Vite + TypeScript)
- Routing with React Router
- Authentication context and guards
- i18n support (EN/AR) with RTL
- API client with auth interceptors
- Legacy CSS integration
- Error boundary
- Toast notifications
- Main layout with navigation
- Page stubs for all main routes

### 🚧 TODO
- Form field components
- DataTable component
- Modal component
- Full page implementations
- Validation rules migration
- Image controls
- Map integration

## License

Copyright © 2024
