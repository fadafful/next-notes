// app/notes/CreateNote.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PocketBase from 'pocketbase';
import styles from './Notes.module.css';
import { useAuth } from '../context/AuthContext';

export default function CreateNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ title: '', content: '' });
  const [touched, setTouched] = useState({ title: false, content: false });
  
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Validate form fields
  const validateField = (name: string, value: string) => {
    if (name === 'title') {
      if (!value.trim()) {
        return 'Title is required';
      } else if (value.trim().length < 3) {
        return 'Title must be at least 3 characters';
      }
    }
    
    if (name === 'content') {
      if (!value.trim()) {
        return 'Content is required';
      } else if (value.trim().length < 10) {
        return 'Content must be at least 10 characters';
      }
    }
    
    return '';
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'content') {
      setContent(value);
    }
    
    // Clear error when user types
    if (touched[name as keyof typeof touched]) {
      setErrors({
        ...errors,
        [name]: validateField(name, value)
      });
    }
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
    
    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

  // Form submission handler
  const create = async(e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const titleError = validateField('title', title);
    const contentError = validateField('content', content);
    
    // Mark all fields as touched
    setTouched({ title: true, content: true });
    
    // Update errors state
    setErrors({
      title: titleError,
      content: contentError
    });
    
    // If there are any errors, prevent submission
    if (titleError || contentError) {
      return;
    }
    
    if (!isAuthenticated) {
      alert('You must be logged in to create notes');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const auth = localStorage.getItem('auth');
      if (!auth) throw new Error('Authentication required');
      
      const { token } = JSON.parse(auth);
      
      // Use PocketBase SDK with authentication
      const pb = new PocketBase('http://127.0.0.1:8090');
      pb.authStore.save(token, null); // Set the auth token
      
      // Create the note
      await pb.collection('notes').create({
        title,
        content,
      });

      // Reset form on success
      setContent('');
      setTitle('');
      setTouched({ title: false, content: false });
      setErrors({ title: '', content: '' });
      
      router.refresh();
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Create a new Note</h3>
      <form onSubmit={create}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.formLabel}>Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="What's this note about?"
            value={title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.formInput} ${touched.title && errors.title ? styles.inputError : ''}`}
          />
          {touched.title && errors.title && (
            <p className={styles.errorMessage}>{errors.title}</p>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.formLabel}>Content</label>
          <textarea
            id="content"
            name="content"
            placeholder="Write your thoughts here..."
            value={content}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.formInput} ${styles.formTextarea} ${touched.content && errors.content ? styles.inputError : ''}`}
          />
          {touched.content && errors.content && (
            <p className={styles.errorMessage}>{errors.content}</p>
          )}
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Note'}
        </button>
      </form>
    </div>
  );
}