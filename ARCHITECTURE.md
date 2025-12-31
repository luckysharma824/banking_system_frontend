# Banking System Frontend - Architecture Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Folder Structure](#folder-structure)
4. [Key Features](#key-features)
5. [Best Practices Implemented](#best-practices-implemented)
6. [Getting Started](#getting-started)

## 🎯 Project Overview

This is a comprehensive banking system frontend built with React, implementing enterprise-level patterns and best practices for scalability, maintainability, and security.

## 🏗️ Architecture

The application follows a **feature-based architecture** with clear separation of concerns:

```
src/
├── core/                    # Core application functionality
│   ├── constants/          # Application-wide constants
│   ├── services/           # Core services (HTTP, Storage, Permission)
│   ├── hooks/              # Custom React hooks
│   ├── hoc/                # Higher-Order Components
│   ├── components/         # Core reusable components
│   └── utils/              # Utility functions
├── features/               # Feature modules
│   ├── auth/              # Authentication feature
│   ├── user/              # User management feature
│   ├── customer/          # Customer management feature
│   ├── account/           # Account management feature
│   └── transaction/       # Transaction management feature
├── shared/                # Shared components & utilities
│   └── components/        # Reusable UI components
└── components/            # Legacy components (to be migrated)
```

## 📁 Folder Structure

### `/src/core` - Core Application Layer

#### `/core/constants`

- **`app.constants.js`**: Application-wide configuration

  - API configuration
  - Storage keys
  - Date/currency formats
  - Pagination settings
  - Validation rules
  - HTTP status codes

- **`permissions.constants.js`**: RBAC (Role-Based Access Control)

  - Role definitions (ADMIN, MANAGER, CASHIER, etc.)
  - Module definitions (USER, CUSTOMER, ACCOUNT, etc.)
  - Permission mappings
  - Role hierarchy
  - Role metadata (icons, colors, labels)

- **`routes.constants.js`**: Centralized route management
  - All application routes
  - Route utilities
  - Public vs protected routes

#### `/core/services`

- **`http.service.js`**: Enhanced HTTP client

  - Axios instance with interceptors
  - Request/response interceptors
  - Error handling
  - Token injection
  - Retry logic
  - File upload/download

- **`storage.service.js`**: Centralized storage management

  - LocalStorage wrapper
  - Type-safe operations
  - Auth data management
  - Preferences storage
  - Encryption support (extensible)

- **`permission.service.js`**: Permission management
  - Permission checking
  - Role validation
  - Module access control
  - Role hierarchy management
  - User management permissions

#### `/core/hooks`

- **`usePermissions.js`**: Permission hook

  - Check permissions
  - Check roles
  - Module access
  - Combined checks

- **`useAuth.js`**: Authentication hook

  - Login/logout
  - Token management
  - Session management
  - User info refresh

- **`useAPI.js`**: API call hook

  - Loading states
  - Error handling
  - Data management
  - Reset functionality

- **`useForm.js`**: Form management hook
  - Form state
  - Validation
  - Field management
  - Submission handling

#### `/core/hoc`

- **`withAuth.jsx`**: Authentication HOCs
  - `withAuth`: Basic auth protection
  - `withPermission`: Permission-based protection
  - `withRole`: Role-based protection
  - `withModuleAccess`: Module access protection
  - `withAdminOnly`: Admin-only protection
  - `ProtectedRoute`: Flexible route protection component

#### `/core/components`

- **`PermissionGuard.jsx`**: Permission-based rendering
  - `PermissionGuard`: General permission guard
  - `ModuleGuard`: Module access guard
  - `RoleGuard`: Role-based guard
  - `AdminGuard`: Admin-only guard
  - `ManagerGuard`: Manager+ guard

#### `/core/utils`

- **`helpers.js`**: Utility functions

  - Currency formatting
  - Date formatting
  - Phone formatting
  - Text manipulation
  - Validation utilities
  - Array operations
  - Clipboard operations

- **`validation.js`**: Validation functions
  - Password validation
  - Username validation
  - Email validation
  - Phone validation
  - Account number validation
  - Amount validation
  - Date validation

### `/src/shared` - Shared Resources

#### `/shared/components`

- **`Card`**: Flexible card component

  - Multiple variants (primary, success, warning, danger)
  - Elevation levels
  - Hoverable & clickable states
  - Header, body, footer sections

- **`Button`**: Enhanced button component

  - Multiple variants & sizes
  - Loading state
  - Icons support
  - Full-width option

- **`LoadingSpinner`**: Loading indicator

  - Multiple sizes & variants
  - Full-screen mode
  - Overlay mode
  - Inline mode

- **`Alert`**: Alert/notification component
  - Success, info, warning, danger variants
  - Dismissible option
  - Icons & titles

## 🔑 Key Features

### 1. **Role-Based Access Control (RBAC)**

- Comprehensive permission system
- Role hierarchy
- Module-based access control
- Flexible permission checking

### 2. **Authentication & Authorization**

- Token-based authentication
- Auto token refresh
- Session management
- Protected routes

### 3. **HTTP Client**

- Centralized API calls
- Request/response interceptors
- Error handling
- Retry logic
- File operations

### 4. **State Management**

- Context API for auth state
- Custom hooks for reusable logic
- Efficient re-render optimization

### 5. **Form Management**

- Reusable form hook
- Built-in validation
- Field-level error handling
- Submission management

### 6. **UI Components**

- Consistent design system
- Reusable components
- Responsive design
- Accessibility support

## ✨ Best Practices Implemented

### 1. **Code Organization**

- ✅ Feature-based folder structure
- ✅ Clear separation of concerns
- ✅ Centralized constants
- ✅ Reusable utilities

### 2. **React Best Practices**

- ✅ Custom hooks for logic reuse
- ✅ HOCs for cross-cutting concerns
- ✅ Memoization for performance
- ✅ PropTypes for type checking

### 3. **Security**

- ✅ Token-based authentication
- ✅ Protected routes
- ✅ Permission guards
- ✅ Secure storage
- ✅ XSS protection

### 4. **Performance**

- ✅ Code splitting ready
- ✅ Lazy loading support
- ✅ Optimized re-renders
- ✅ Efficient state management

### 5. **Maintainability**

- ✅ Comprehensive documentation
- ✅ Consistent naming conventions
- ✅ Modular architecture
- ✅ DRY principle

### 6. **Testing Ready**

- ✅ Testable components
- ✅ Pure functions
- ✅ Isolated business logic
- ✅ Mock-friendly services

## 🚀 Getting Started

### Using Core Services

```javascript
// Using HTTP Service
import httpService from "@/core/services/http.service";

const response = await httpService.get("/api/users");
const result = await httpService.post("/api/users", userData);

// Using Storage Service
import storageService from "@/core/services/storage.service";

storageService.saveToken(token);
const token = storageService.getToken();

// Using Permission Service
import permissionService from "@/core/services/permission.service";

if (permissionService.hasPermission("ACCOUNT", "CREATE_ACCOUNT")) {
  // Show create button
}
```

### Using Hooks

```javascript
// Using usePermissions hook
import { usePermissions } from "@/core/hooks/usePermissions";

const { hasPermission, isAdmin, hasModuleAccess } = usePermissions();

if (hasPermission("USER", "CREATE_USER")) {
  // Render create user button
}

// Using useAuth hook
import { useAuth } from "@/core/hooks/useAuth";

const { isAuthenticated, userInfo, logout } = useAuth();

// Using useAPI hook
import { useAPI } from "@/core/hooks/useAPI";
import UserService from "@/services/UserService";

const { data, loading, error, execute } = useAPI(UserService.getAllUsers);

useEffect(() => {
  execute();
}, []);
```

### Using Guards

```javascript
// Component-level protection
import { PermissionGuard, AdminGuard } from '@/core/components/PermissionGuard';

<PermissionGuard module="USER" permission="CREATE_USER">
  <CreateUserButton />
</PermissionGuard>

<AdminGuard>
  <AdminPanel />
</AdminGuard>

// Route-level protection
import { withAuth, withPermission, ProtectedRoute } from '@/core/hoc/withAuth';

// HOC approach
export default withPermission(CreateUser, 'USER', 'CREATE_USER');

// Component approach
<ProtectedRoute module="USER" permission="CREATE_USER">
  <CreateUser />
</ProtectedRoute>
```

### Using Shared Components

```javascript
import { Card, Button, LoadingSpinner, Alert } from '@/shared/components';

// Card component
<Card
  title="User Details"
  subtitle="View user information"
  icon="👤"
  variant="primary"
  elevation={2}
>
  <p>Content here</p>
</Card>

// Button component
<Button
  variant="primary"
  size="medium"
  loading={isLoading}
  icon={<span>➕</span>}
  onClick={handleClick}
>
  Create Account
</Button>

// Loading Spinner
<LoadingSpinner size="medium" variant="primary" text="Loading..." />

// Alert
<Alert variant="success" dismissible onClose={handleClose}>
  Operation completed successfully!
</Alert>
```

### Using Utilities

```javascript
import {
  formatCurrency,
  formatDate,
  maskAccountNumber,
} from "@/core/utils/helpers";
import { validateEmail, validatePassword } from "@/core/utils/validation";

// Format currency
const formatted = formatCurrency(1000); // ₹1,000.00

// Validate email
const { isValid, errors } = validateEmail(email);

// Mask account number
const masked = maskAccountNumber("1234567890", 4); // ******7890
```

## 📚 Migration Guide

To migrate existing components to the new structure:

1. **Import new utilities**

   ```javascript
   // Old
   import { getToken } from "./components/utils/DataStorage";

   // New
   import storageService from "@/core/services/storage.service";
   const token = storageService.getToken();
   ```

2. **Use new hooks**

   ```javascript
   // Old
   import { usePermissions } from "./components/utils/usePermissions";

   // New
   import { usePermissions } from "@/core/hooks/usePermissions";
   ```

3. **Apply guards and HOCs**

   ```javascript
   // Add permission protection
   import { PermissionGuard } from "@/core/components/PermissionGuard";

   <PermissionGuard module="USER" permission="VIEW_USER">
     <UserList />
   </PermissionGuard>;
   ```

4. **Use shared components**
   ```javascript
   // Replace custom components with shared ones
   import { Card, Button, Alert } from "@/shared/components";
   ```

## 🔐 Security Considerations

1. **Authentication**: All API calls automatically include auth token
2. **Authorization**: Multi-level permission checking (module, permission, role)
3. **Token Expiry**: Automatic token expiration handling
4. **Protected Routes**: Route-level access control
5. **XSS Protection**: Proper input sanitization and output encoding

## 🎨 Styling Strategy

- Component-specific CSS modules
- Consistent design tokens
- Responsive design patterns
- Accessibility considerations
- Dark mode support (optional)

## 📝 Naming Conventions

- **Files**: PascalCase for components (`Button.jsx`), camelCase for utilities (`helpers.js`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserInfo`)
- **Constants**: UPPER_SNAKE_CASE (`API_TIMEOUT`)
- **CSS Classes**: kebab-case (`user-profile`)

## 🤝 Contributing Guidelines

1. Follow the established folder structure
2. Use existing services and hooks
3. Implement proper error handling
4. Add PropTypes for components
5. Write clear comments for complex logic
6. Follow naming conventions
7. Test components before committing

---

## 📞 Support

For questions or issues, please refer to the project documentation or contact the development team.
