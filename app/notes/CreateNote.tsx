// app/notes/CreateNote.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Notes.module.css';

export default function CreateNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ title: '', content: '' });
  const [touched, setTouched] = useState({ title: false, content: false });

  const router = useRouter();

  // Validate form fields
  const validateField = (name, value) => {
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'content') {
      setContent(value);
    }
    
    // Clear error when user types
    if (touched[name]) {
      setErrors({
        ...errors,
        [name]: validateField(name, value)
      });
    }
  };

  // Handle input blur
  const handleBlur = (e) => {
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
  const create = async(e) => {
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
    
    setIsSubmitting(true);

    try {
      await fetch('http://127.0.0.1:8090/api/collections/notes/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
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