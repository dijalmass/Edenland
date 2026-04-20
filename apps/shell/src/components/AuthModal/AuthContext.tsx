import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  requestPassword: (onConfirm: (password: string) => void) => void;
  isOpen: boolean;
  close: () => void;
  confirm: (password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<((password: string) => void) | null>(null);

  const requestPassword = (onConfirm: (password: string) => void) => {
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setOnConfirmCallback(null);
  };

  const confirm = (password: string) => {
    if (onConfirmCallback) {
      onConfirmCallback(password);
    }
    close();
  };

  return (
    <AuthContext.Provider value={{ requestPassword, isOpen, close, confirm }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
