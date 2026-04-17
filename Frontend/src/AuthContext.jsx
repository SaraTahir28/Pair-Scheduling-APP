/**
 * AuthContext provides global access to the currently logged-in user
 * and authentication-related functions (e.g., logout) across the React app.
 * Usage:
 * - Wrap your app with <AuthProvider value={{ user, setUser, handleLogout }}>
 * - Access auth state/functions anywhere via `const { user, handleLogout } = useAuth()`
 */

import { createContext, useContext } from "react";

const AuthContext = createContext();

// Custom hook to consume AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
// Provider component to wrap the app
export function AuthProvider({ children, value }) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
