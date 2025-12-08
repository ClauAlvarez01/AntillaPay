import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6932d41b50d5632ec5f48d9c", 
  requiresAuth: true // Ensure authentication is required for all operations
});
