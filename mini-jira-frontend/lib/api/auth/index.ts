// Import interceptors to ensure they are registered
import "./interceptors";

// Export axios instances
export { clientApi, serverApi } from "./instances";

// Export default for backward compatibility
export { default } from "./instances";

// Export types for external use
export type { QueuedRequest } from "@/lib/types/api.types";

// Export refresh managers if needed elsewhere
export { ClientRefreshManager } from "./client-refresh-manager";
export { ServerRefreshManager } from "./server-refresh-manager"; 