# API Layer Architecture

This directory contains the modular API layer with authentication and refresh token management.

## 📁 File Structure

```
lib/api/
├── index.ts                    # Main entry point - exports everything
├── axios.ts                    # Legacy file - re-exports from index (backward compatibility)
├── instances.ts                # Axios instances (clientApi, serverApi)
├── types.ts                    # Shared TypeScript types
├── client-refresh-manager.ts   # Client-side token refresh logic
├── server-refresh-manager.ts   # Server-side token refresh logic
├── interceptors.ts             # All axios interceptors
└── README.md                   # This file
```

## 🚀 Usage

### Basic Import
```typescript
import { clientApi, serverApi } from "@/lib/api";
```

### Legacy Import (still works)
```typescript
import serverApi, { clientApi } from "@/lib/api/axios";
```

## 🔧 Components

### **instances.ts**
- Creates axios instances with base configuration
- `clientApi` - For client-side requests
- `serverApi` - For server-side requests

### **client-refresh-manager.ts**
- Handles client-side token refresh using NextAuth session
- Implements request queuing to prevent race conditions
- Uses NextAuth `getSession()` for token access

### **server-refresh-manager.ts**
- Handles server-side token refresh using cookies
- Implements request queuing to prevent race conditions
- Uses cookie-based authentication (hybrid approach)

### **interceptors.ts**
- Sets up all request/response interceptors
- Adds authentication headers automatically
- Handles 401 errors with automatic token refresh
- Comprehensive logging for debugging

### **types.ts**
- Shared TypeScript interfaces
- `QueuedRequest` - For request queuing system

## 🔄 Authentication Flow

### Client-Side
1. Request interceptor adds access token from NextAuth session
2. On 401 error, triggers NextAuth refresh
3. Queues concurrent requests during refresh
4. Retries failed requests with new token

### Server-Side
1. Request interceptor logs requests
2. On 401 error, makes refresh request with cookies
3. Queues concurrent requests during refresh
4. Retries failed requests with new token

## 🐛 Debugging

All requests and refresh operations are logged with clear prefixes:
- `📤 CLIENT-API:` - Client-side requests
- `📤 SERVER-API:` - Server-side requests
- `🔄` - Refresh operations
- `✅` - Success operations
- `❌` - Error operations
- `⏳` - Queuing operations

## 🔧 Extending

To add new functionality:

1. **New axios instance**: Add to `instances.ts`
2. **New refresh logic**: Create new manager class
3. **New interceptors**: Add to `interceptors.ts`
4. **New types**: Add to `types.ts`
5. **Export**: Update `index.ts`

## ⚡ Benefits

- **Modularity**: Easy to maintain and extend
- **Separation of concerns**: Each file has a single responsibility
- **Type safety**: Full TypeScript support
- **Backward compatibility**: Existing imports still work
- **Debugging**: Comprehensive logging
- **Performance**: Request queuing prevents race conditions 