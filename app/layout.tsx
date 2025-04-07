/* eslint-disable @next/next/no-head-element */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from './context/AuthContext';
import './globals.css';

function NavigationBar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  
  return (
    <nav>
      <div className="nav-links">
        <Link 
          href="/" 
          className={pathname === '/' ? 'active-link' : ''}
        >
          Home
        </Link>
        <Link 
          href="/notes" 
          className={pathname === '/notes' || pathname?.startsWith('/notes/') ? 'active-link' : ''}
        >
          Notes
        </Link>
      </div>
      
      <div className="nav-auth">
        {isLoading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            <span className="username">Hello, {user.name}</span>
            <button 
              onClick={logout}
              className="signout-button"
            >
              Sign out
            </button>
          </>
        ) : (
          <Link 
            href="/login"
            className={pathname === '/login' ? 'active-link' : ''}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <main>
          <NavigationBar />
          {children}
        </main>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AppLayout>{children}</AppLayout>
    </AuthProvider>
  );
}