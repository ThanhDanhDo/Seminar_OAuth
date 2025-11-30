import React, { createContext, ReactNode, useState } from 'react';

/**
 * Provider information from authentication
 */
export type ProviderData = {
  providerId: string;
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  phoneNumber?: string;
};

/**
 * User metadata information
 */
export type UserMetadata = {
  creationTime?: string;
  lastSignInTime?: string;
};

/**
 * Authenticated user information
 */
export type User = {
  displayName?: string;
  email?: string;
  photoURL?: string;
  uid: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  providerData?: ProviderData[];
  metadata?: UserMetadata;
};

/**
 * Authentication context props
 */
interface AuthContextProps {
  user?: User;
  setUser: (user?: User) => void;
}

/**
 * Context for managing authentication state across the application
 */
export const AuthContext = createContext<AuthContextProps>({
  user: undefined,
  setUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider component for authentication context
 * Wraps the application to provide authentication state to all components
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>();
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};