# Authentication Module

This module provides a complete authentication system with NextAuth.js v5, featuring token refresh, global refresh locking, and proper error handling.

## Structure

```
lib/auth/
├── auth.types.ts        # TypeScript definitions
├── axios-instance.ts    # Dedicated axios instance for refresh
├── callbacks.ts         # JWT and session callbacks
├── pages.ts            # Custom auth pages
├── providers.ts        # Authentication providers
├── token-refresh.ts    # Token refresh with global locking
├── index.ts           # Main NextAuth configuration
└── README.md          # This file
```

## Key Features

### 🔐 **Secure Token Management**
- JWT-based sessions with automatic token refresh
- Global refresh locking prevents race conditions
- Retry limits prevent infinite refresh loops
- Proper error handling and cleanup

### 🔄 **Hybrid Refresh Strategy**
- Client-side: Refresh tokens in request body
- Server-side: Refresh tokens in httpOnly cookies
- Independent refresh for both client and server APIs

### ⚡ **Performance Optimized**
- Global refresh promise prevents concurrent refresh attempts
- Request queuing at HTTP layer
- Efficient token expiration checking

### 🛡️ **Security Best Practices**
- httpOnly cookies for server-side refresh tokens
- Automatic logout on refresh token expiration
- Clean error handling without console spam

## Usage

### Basic Import
```typescript
import { auth, signIn, signOut } from "@/lib/auth";
```

### Server Components
```typescript
import { auth } from "@/lib/auth";

export default async function ServerComponent() {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;
  
  return <div>Hello {session.user?.name}</div>;
}
```

### Client Components
```typescript
"use client";
import { useSession } from "next-auth/react";

export default function ClientComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;
  
  return <div>Hello {session.user?.name}</div>;
}
```

## Configuration

The auth system is configured through multiple modules:

- **providers.ts**: Credentials provider with Zod validation
- **callbacks.ts**: JWT refresh logic and session management  
- **pages.ts**: Custom login and error pages
- **token-refresh.ts**: Token refresh with global locking

## Error Handling

The system handles various error scenarios:

- **Invalid credentials**: Returns null, triggers CredentialsSignin
- **Token expiration**: Automatic refresh with fallback to logout
- **Refresh failure**: Retry logic with maximum attempts
- **Network errors**: Graceful degradation and user feedback

## Development

To modify the auth system:

1. **Add new providers**: Edit `providers.ts`
2. **Modify token logic**: Update `token-refresh.ts`
3. **Change callbacks**: Edit `callbacks.ts`
4. **Add new types**: Update `auth.types.ts`

## Security Considerations

- Refresh tokens are stored in httpOnly cookies (server-side)
- Access tokens have short expiration times (2 minutes)
- Failed refresh attempts are limited to prevent abuse
- Sensitive token data is not logged in production