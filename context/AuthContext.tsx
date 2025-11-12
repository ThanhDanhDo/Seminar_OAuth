import React, { createContext, useState, ReactNode } from 'react';

export type User = {
 displayName?: string;
 email?: string;
 photoURL?: string;
 uid: string;
};

interface AuthContextProps {
 user?: User;
 setUser: (user?: User) => void;
}
export const AuthContext = createContext<AuthContextProps>({
  user: undefined,
  setUser: () => {},
});

interface AuthProviderProps {
 children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
 const [user, setUser] = useState<User>();
 return (
     <AuthContext.Provider value={{ user, setUser }}>
         {children}
     </AuthContext.Provider>
 );
};