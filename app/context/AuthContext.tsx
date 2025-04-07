'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load auth state from localStorage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = localStorage.getItem('auth');
        console.log('Auth data from localStorage:', authData ? 'exists' : 'not found');
        
        if (!authData) {
          setIsLoading(false);
          return;
        }

        const auth = JSON.parse(authData);
        
        // Check if token is expired
        if (auth.expiration && auth.expiration < Date.now()) {
          console.log('Auth token expired');
          localStorage.removeItem('auth');
          setIsLoading(false);
          return;
        }

        console.log('Setting user from auth data');
        
        // Set user data
        setUser({
          id: auth.user.id,
          name: auth.user.name || auth.user.email.split('@')[0],
          email: auth.user.email,
          avatar: auth.user.avatar,
        });
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle protected routes
  useEffect(() => {
    // Only check after initial loading is complete
    if (!isLoading) {
      const isProtectedRoute = pathname?.startsWith('/notes');
      
      console.log('Route check:', { 
        pathname, 
        isProtectedRoute, 
        isAuthenticated: !!user, 
        isLoading 
      });
      
      if (isProtectedRoute && !user) {
        console.log('Redirecting to login from protected route');
        router.push('/login?callbackUrl=' + encodeURIComponent(pathname || '/notes'));
      }
    }
  }, [isLoading, pathname, router, user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8090/api/collections/users/auth-with-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }
      
      console.log('Login successful in context');
      
      // Store auth data in localStorage
      const authData = {
        token: data.token,
        user: data.record,
        expiration: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };
      
      localStorage.setItem('auth', JSON.stringify(authData));
      
      // Set user in state
      setUser({
        id: data.record.id,
        name: data.record.name || data.record.email.split('@')[0],
        email: data.record.email,
        avatar: data.record.avatar,
      });
      
      return data;
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
    router.push('/');
  };

  const contextValue = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}