'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';
import MatrixBackground from '../components/MatrixBackground';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const callbackUrl = searchParams.get('callbackUrl') || '/notes';
  
  useEffect(() => {
    // Show success message if redirected from registration
    if (registered) {
      setIsSuccess(true);
    }
  }, [registered]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSuccess(false);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use direct fetch to PocketBase
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
      
      console.log('Login successful:', data);
      
      // Store auth data in localStorage for session management
      localStorage.setItem('auth', JSON.stringify({
        token: data.token,
        user: data.record,
        expiration: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      }));
      
      // Add a small delay to ensure localStorage is updated before redirect
      setTimeout(() => {
        // Force reload to ensure auth state is updated
        window.location.href = callbackUrl;
      }, 100);
      
      return;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <MatrixBackground />
      
      <div className={styles.loginContainer}>
        <div className={`${styles.loginCard} ${styles.matrixCard}`}>
          <h1 className={styles.loginTitle}>Login to Notes App</h1>
          
          {isSuccess && (
            <div className={styles.successMessage}>
              Registration successful! Please log in with your new account.
            </div>
          )}
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.formInput}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formInput}
                disabled={isLoading}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className={styles.formFooter}>
            <p>Don't have an account? <Link href="/register" className={styles.linkText}>Register</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}