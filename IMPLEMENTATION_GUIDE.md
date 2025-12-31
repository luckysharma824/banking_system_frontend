# Frontend Implementation Guide

## 🚀 Quick Start - Implementing New Features

### Step-by-Step Guide

#### 1. Create a New Feature Module

```bash
src/features/[feature-name]/
├── components/          # Feature-specific components
├── services/           # Feature-specific API services
├── hooks/              # Feature-specific hooks
├── utils/              # Feature-specific utilities
└── index.js            # Feature exports
```

#### 2. Implement API Service

```javascript
// src/features/loan/services/loan.service.js
import httpService from "@/core/services/http.service";
import config from "@/config/apiConfig";

class LoanService {
  async getAllLoans() {
    return await httpService.get(`${config.loansUrl}`);
  }

  async createLoan(loanData) {
    return await httpService.post(`${config.loansUrl}`, loanData);
  }

  async approveLoan(loanId) {
    return await httpService.put(`${config.loansUrl}/${loanId}/approve`);
  }
}

export default new LoanService();
```

#### 3. Create Custom Hook

```javascript
// src/features/loan/hooks/useLoan.js
import { useAPI } from "@/core/hooks/useAPI";
import loanService from "../services/loan.service";

export const useLoan = () => {
  const {
    data: loans,
    loading,
    error,
    execute: fetchLoans,
  } = useAPI(loanService.getAllLoans);

  const createLoan = async (loanData) => {
    return await loanService.createLoan(loanData);
  };

  return {
    loans,
    loading,
    error,
    fetchLoans,
    createLoan,
  };
};
```

#### 4. Build Feature Component

```javascript
// src/features/loan/components/LoanList.jsx
import React, { useEffect } from "react";
import { useLoan } from "../hooks/useLoan";
import { usePermissions } from "@/core/hooks/usePermissions";
import { Card, Button, LoadingSpinner, Alert } from "@/shared/components";
import { PermissionGuard } from "@/core/components/PermissionGuard";
import { MODULES, PERMISSIONS } from "@/core/constants/permissions.constants";

const LoanList = () => {
  const { loans, loading, error, fetchLoans } = useLoan();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    fetchLoans();
  }, []);

  if (loading) return <LoadingSpinner text="Loading loans..." />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Card title="Loan Management" icon="💰">
        <PermissionGuard
          module={MODULES.LOAN}
          permission={PERMISSIONS.LOAN.CREATE}
        >
          <Button variant="primary" onClick={() => {}}>
            Create New Loan
          </Button>
        </PermissionGuard>

        {loans?.map((loan) => (
          <div key={loan.id}>{/* Loan details */}</div>
        ))}
      </Card>
    </div>
  );
};

export default LoanList;
```

#### 5. Add Protected Route

```javascript
// src/App.js
import { ProtectedRoute } from "@/core/hoc/withAuth";
import { MODULES, PERMISSIONS } from "@/core/constants/permissions.constants";
import LoanList from "@/features/loan/components/LoanList";

<Route
  path="/loans"
  element={
    <ProtectedRoute module={MODULES.LOAN} permission={PERMISSIONS.LOAN.VIEW}>
      <LoanList />
    </ProtectedRoute>
  }
/>;
```

## 📋 Common Patterns

### Pattern 1: Form with Validation

```javascript
import { useForm } from "@/core/hooks/useForm";
import { validateRequired, validateEmail } from "@/core/utils/validation";

const MyForm = () => {
  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm(
    { email: "", name: "" },
    {
      email: {
        required: true,
        validate: (value) => {
          const result = validateEmail(value);
          return result.isValid ? null : result.errors[0];
        },
      },
      name: {
        required: true,
        requiredMessage: "Name is required",
        minLength: 3,
      },
    },
    async (data) => {
      // Submit logic
      console.log("Submitted:", data);
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors.name && <span className="error">{errors.name}</span>}

      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <button type="submit">Submit</button>
    </form>
  );
};
```

### Pattern 2: API Call with Loading States

```javascript
import { useState } from "react";
import { useAPI } from "@/core/hooks/useAPI";
import { LoadingSpinner, Alert } from "@/shared/components";

const MyComponent = () => {
  const { data, loading, error, execute } = useAPI(myApiFunction);

  const handleAction = async () => {
    const result = await execute(params);
    if (result.success) {
      // Handle success
    }
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <Alert variant="danger">{error}</Alert>}
      {data && <div>{/* Render data */}</div>}
    </div>
  );
};
```

### Pattern 3: Conditional Rendering Based on Permissions

```javascript
import { usePermissions } from "@/core/hooks/usePermissions";
import { PermissionGuard } from "@/core/components/PermissionGuard";
import { MODULES, PERMISSIONS } from "@/core/constants/permissions.constants";

const MyComponent = () => {
  const { hasPermission, isAdmin } = usePermissions();

  // Method 1: Using hook directly
  return (
    <div>
      {hasPermission(MODULES.ACCOUNT, PERMISSIONS.ACCOUNT.CREATE) && (
        <button>Create Account</button>
      )}

      {isAdmin() && <AdminPanel />}
    </div>
  );

  // Method 2: Using PermissionGuard
  return (
    <div>
      <PermissionGuard
        module={MODULES.ACCOUNT}
        permission={PERMISSIONS.ACCOUNT.CREATE}
        fallback={<p>No permission to create accounts</p>}
      >
        <button>Create Account</button>
      </PermissionGuard>
    </div>
  );
};
```

### Pattern 4: Data Formatting

```javascript
import {
  formatCurrency,
  formatDate,
  maskAccountNumber,
} from "@/core/utils/helpers";

const TransactionItem = ({ transaction }) => {
  return (
    <div>
      <span>Amount: {formatCurrency(transaction.amount)}</span>
      <span>Date: {formatDate(transaction.date)}</span>
      <span>Account: {maskAccountNumber(transaction.accountNumber)}</span>
    </div>
  );
};
```

### Pattern 5: Role-Based Navigation

```javascript
import { usePermissions } from "@/core/hooks/usePermissions";
import { MODULES } from "@/core/constants/permissions.constants";

const Navigation = () => {
  const { hasModuleAccess, isAdmin } = usePermissions();

  return (
    <nav>
      {hasModuleAccess(MODULES.USER) && <Link to="/users">Users</Link>}

      {hasModuleAccess(MODULES.ACCOUNT) && <Link to="/accounts">Accounts</Link>}

      {isAdmin() && <Link to="/admin">Admin Panel</Link>}
    </nav>
  );
};
```

## 🔧 Configuration

### Adding New API Endpoints

```javascript
// src/config/apiConfig.js
export default {
  // Existing endpoints...

  // Add new endpoint
  loansUrl:
    process.env.REACT_APP_LOANS_URL || "http://localhost:8080/api/loans",
};
```

### Adding New Permissions

```javascript
// src/core/constants/permissions.constants.js

// Add new module
export const MODULES = {
  // ...existing modules
  LOAN: "LOAN",
};

// Add permissions for the module
export const PERMISSIONS = {
  // ...existing permissions
  LOAN: {
    CREATE: "CREATE_LOAN",
    VIEW: "VIEW_LOAN",
    APPROVE: "APPROVE_LOAN",
    REJECT: "REJECT_LOAN",
  },
};
```

### Adding New Routes

```javascript
// src/core/constants/routes.constants.js
export const ROUTES = {
  // ...existing routes

  LOAN: {
    LIST: "/loans",
    CREATE: "/loans/create",
    DETAILS: "/loans/:id",
  },
};
```

## 🎨 Styling Guidelines

### Component Styles

```css
/* ComponentName.css */

/* Container */
.component-name-container {
  padding: 20px;
  border-radius: 8px;
}

/* Elements */
.component-name-header {
  margin-bottom: 15px;
}

.component-name-title {
  font-size: 1.5rem;
  font-weight: 700;
}

/* States */
.component-name-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.component-name-item--active {
  border-color: #007bff;
}

/* Responsive */
@media (max-width: 768px) {
  .component-name-container {
    padding: 15px;
  }
}
```

## 🧪 Testing Guidelines

### Component Testing

```javascript
// LoanList.test.js
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoanList from "./LoanList";
import { ContextProvider } from "@/components/utils/ContextProvider";

const renderWithProviders = (component) => {
  return render(
    <MemoryRouter>
      <ContextProvider>{component}</ContextProvider>
    </MemoryRouter>
  );
};

test("renders loan list", async () => {
  renderWithProviders(<LoanList />);

  await waitFor(() => {
    expect(screen.getByText(/loan management/i)).toBeInTheDocument();
  });
});
```

## 📝 Code Review Checklist

Before submitting code for review:

- [ ] Follows folder structure conventions
- [ ] Uses appropriate core services and hooks
- [ ] Implements proper error handling
- [ ] Adds permission guards where needed
- [ ] Includes PropTypes for components
- [ ] Uses shared UI components
- [ ] Follows naming conventions
- [ ] Adds comments for complex logic
- [ ] Responsive design implemented
- [ ] No console.log statements in production code
- [ ] Loading and error states handled
- [ ] Accessibility attributes added

## 🚨 Common Pitfalls

### Avoid These Mistakes

1. **Don't bypass permission checks**

   ```javascript
   // ❌ Bad
   <CreateButton onClick={createUser} />

   // ✅ Good
   <PermissionGuard module="USER" permission="CREATE_USER">
     <CreateButton onClick={createUser} />
   </PermissionGuard>
   ```

2. **Don't make direct localStorage calls**

   ```javascript
   // ❌ Bad
   localStorage.setItem("token", token);

   // ✅ Good
   storageService.saveToken(token);
   ```

3. **Don't create duplicate API calls**

   ```javascript
   // ❌ Bad
   axios.get("/api/users");

   // ✅ Good
   httpService.get("/api/users");
   ```

4. **Don't hardcode strings**

   ```javascript
   // ❌ Bad
   if (role === "ADMIN") {
   }

   // ✅ Good
   import { ROLES } from "@/core/constants/permissions.constants";
   if (role === ROLES.ADMIN) {
   }
   ```

## 📚 Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

---

Happy Coding! 🎉
