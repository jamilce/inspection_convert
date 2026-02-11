# React App Implementation Guide

## Overview

This document provides guidance for continuing the conversion of the legacy jQuery/Bootstrap application to the new React + Vite + TypeScript implementation.

## Architecture Decisions

### 1. State Management
- **Local State**: Use React hooks (useState, useReducer) for component-specific state
- **Global State**: Use Context API for auth, i18n, and shared app state
- **Server State**: Direct API calls with axios (consider react-query for caching if needed)

### 2. Routing
- **Client-side routing**: React Router v7 with protected routes
- **No hash-based routing**: Clean URLs with browser history API
- **Route guards**: ProtectedRoute component checks authentication

### 3. Forms
- **React Hook Form** for all forms
- **Validation**: Built-in validation + custom rules
- **Reusable field components**: TextField, SelectField, etc. with consistent styling

### 4. Styling
- **Preserve legacy**: AdminBSB theme maintained in public/legacy-css/
- **Modern enhancements**: Additional styling in src/styles/enhancements.css
- **RTL support**: Arabic CSS loaded dynamically when language is Arabic

### 5. i18n
- **Translation files**: JSON in src/i18n/
- **Context-based**: I18nProvider wraps the app
- **Hook-based access**: useI18n() or useT() for translations
- **RTL handling**: Automatic dir="rtl" and CSS loading

## File Organization

```
src/
├── components/
│   ├── common/          # Shared components (Layout, Modal, ErrorBoundary)
│   └── fields/          # Form field components (TextField, SelectField, etc.)
├── contexts/            # React contexts (Auth, I18n)
├── hooks/               # Custom React hooks
├── i18n/               # Translation files (en.json, ar.json)
├── pages/              # Page components (one per route)
│   ├── auth/           # Login, etc.
│   ├── dashboard/      # Home, Dashboard
│   ├── audits/         # Audit pages
│   ├── establishments/ # Establishment pages
│   └── ...
├── services/           # API client and services
├── styles/             # Global styles
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx            # Main app with routing
└── main.tsx           # Entry point
```

## Common Patterns

### Creating a New Page

1. Create page component in appropriate directory:
```tsx
// src/pages/myfeature/MyFeaturePage.tsx
import { useT } from '../../contexts/I18nContext.tsx';

export const MyFeaturePage = () => {
  const t = useT();
  
  return (
    <div className="block-header">
      <h2>{t('myfeature.title')}</h2>
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>{t('myfeature.header')}</h2>
            </div>
            <div className="body">
              {/* Page content */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

2. Add translations:
```json
// src/i18n/en.json
{
  "myfeature": {
    "title": "My Feature",
    "header": "Feature Details"
  }
}

// src/i18n/ar.json
{
  "myfeature": {
    "title": "ميزتي",
    "header": "تفاصيل الميزة"
  }
}
```

3. Add route in App.tsx:
```tsx
<Route path="/myfeature" element={<MyFeaturePage />} />
```

4. Add navigation link in MainLayout.tsx:
```tsx
<li>
  <Link to="/myfeature">
    <i className="material-icons">star</i>
    <span>{t('myfeature.title')}</span>
  </Link>
</li>
```

### Creating a Form

```tsx
import { useForm } from 'react-hook-form';
import { TextField, SelectField } from '../../components/fields/index.ts';
import { useT } from '../../contexts/I18nContext.tsx';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  type: string;
  email: string;
}

export const MyForm = () => {
  const t = useT();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      // API call here
      toast.success(t('common.successDone'));
    } catch (error) {
      toast.error(t('common.errorMsg'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label={t('forms.name')}
        icon="person"
        required
        registration={register('name', {
          required: t('common.required'),
        })}
        error={errors.name?.message}
      />

      <SelectField
        label={t('forms.type')}
        icon="list"
        required
        options={[
          { value: '1', label: 'Type 1' },
          { value: '2', label: 'Type 2' },
        ]}
        registration={register('type', {
          required: t('common.required'),
        })}
        error={errors.type?.message}
      />

      <button type="submit" className="btn btn-primary">
        {t('common.submit')}
      </button>
    </form>
  );
};
```

### Using the API Client

```tsx
import { api } from '../../services/api.ts';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const MyDataComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.establishments.search({
          SearchText: '',
          PageNumber: 1,
          PageSize: 10,
        });
        setData(response.data);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="spinner-border" />;

  return <div>{/* Render data */}</div>;
};
```

### Using Modal

```tsx
import { useState } from 'react';
import { Modal } from '../../components/common/Modal.tsx';

export const MyComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="My Modal"
        size="lg"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
};
```

### Authentication Check

```tsx
import { useAuth } from '../../contexts/AuthContext.tsx';

export const MyComponent = () => {
  const { user, isAuthenticated, hasPrivilege } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasPrivilege('somePrivilege')) {
    return <Navigate to="/access-denied" />;
  }

  return <div>Welcome {user?.FullName}</div>;
};
```

## Migration Checklist for Each Page

When converting a legacy page:

1. **Analyze legacy code**
   - [ ] Review HTML structure in views/*.html
   - [ ] Review JavaScript logic in views/*.js
   - [ ] Identify controls used in controls/*.html
   - [ ] Note API endpoints called
   - [ ] Document validation rules
   - [ ] List required lookups/dropdowns

2. **Extract translations**
   - [ ] Find all data-tran attributes
   - [ ] Add to en.json and ar.json
   - [ ] Verify Arabic translations

3. **Create React component**
   - [ ] Create page component file
   - [ ] Implement UI using AdminBSB classes
   - [ ] Use field components for forms
   - [ ] Add proper TypeScript types

4. **Implement logic**
   - [ ] Convert jQuery code to React hooks
   - [ ] Use React Hook Form for forms
   - [ ] Call APIs using api client
   - [ ] Handle loading and error states
   - [ ] Add validation rules

5. **Test**
   - [ ] Test in English
   - [ ] Test in Arabic (RTL)
   - [ ] Test form validation
   - [ ] Test API calls
   - [ ] Test responsive design
   - [ ] Check accessibility

6. **Update routing**
   - [ ] Add route in App.tsx
   - [ ] Add navigation link in MainLayout.tsx
   - [ ] Test navigation

## Known Issues & Limitations

### Current Limitations
- Form field components are basic - may need enhancement for specific use cases
- No date picker component yet (use HTML5 date input or add library)
- No file upload component yet (needs implementation)
- No data table component yet (needs @tanstack/react-table integration)
- Multi-select dropdown not implemented
- Image gallery/lightbox not implemented
- Google Maps integration not implemented

### TODOs
- Implement DatePickerField component
- Implement FileUploadField component
- Implement DataTable component with sorting, filtering, pagination
- Implement MultiSelectField for async searches
- Port validation rules from legacy app
- Add proper TypeScript types for all API responses
- Implement print functionality
- Implement export functionality (Excel, PDF)
- Add loading states and skeletons
- Optimize bundle size

## Best Practices

### TypeScript
- Always define interfaces for component props
- Use type-only imports for types: `import type { MyType } from ...`
- Define API response types in `src/types/`
- Avoid `any` type - use `unknown` if truly unknown

### Performance
- Use React.memo for expensive components
- Use useMemo/useCallback for expensive computations
- Lazy load routes with React.lazy
- Optimize images and assets
- Code-split large components

### Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios

### Testing
- Write unit tests for utilities
- Write integration tests for forms
- Test both English and Arabic
- Test on multiple devices/browsers
- Validate production build

## Deployment

See README.md for deployment instructions.

### Quick Reference
```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## Getting Help

- Check existing page implementations in `src/pages/`
- Review field components in `src/components/fields/`
- Look at API client in `src/services/api.ts`
- Reference legacy code for business logic
- Check AdminBSB documentation for styling

## Contributing

When adding new features:
1. Follow existing patterns and structure
2. Add TypeScript types
3. Add translations for both EN and AR
4. Test in both languages
5. Ensure RTL support works
6. Update this guide if needed
7. Document any new patterns or components
