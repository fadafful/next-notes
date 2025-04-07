// app/notes/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../Notes.module.css';
import LoadingState from '../../components/LoadingState';
import { useAuth } from '../../context/AuthContext';

export default function NotePage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const noteId = params.id;

  useEffect(() => {
    async function fetchNote() {
      if (!isAuthenticated) return;
      
      try {
        const response = await fetch(
          `http://127.0.0.1:8090/api/collections/notes/records/${noteId}`,
          {
            cache: 'no-store'
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch note');
        }
        
        const data = await response.json();
        console.log('Fetched note data:', data);
        setNote(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNote();
  }, [isAuthenticated, noteId]);

  // Handle note deletion
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(
        `http://127.0.0.1:8090/api/collections/notes/records/${noteId}`,
        {
          method: 'DELETE',
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      
      // Navigate back to notes list after successful deletion
      router.push('/notes');
      router.refresh();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
      setIsDeleting(false);
    }
  };

  // Handle note update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(
        `http://127.0.0.1:8090/api/collections/notes/records/${noteId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: editedTitle,
            content: editedContent,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update note');
      }
      
      const updatedNote = await response.json();
      setNote(updatedNote);
      setIsEditing(false);
      
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note. Please try again.');
    }
  };

  // Show loading state while checking authentication
  if (!isAuthenticated || isLoading) {
    return <LoadingState />;
  }

  // If note not found
  if (!note) {
    return (
      <div className={styles.noteDetailContainer}>
        <Link href="/notes" className={styles.backButton}>
          <span className={styles.backIcon}>←</span> Back to Notes
        </Link>
        <div className={styles.noteDetailCard} style={{ backgroundColor: '#fff3cd' }}>
          <h1 className={styles.noteDetailTitle}>Note not found</h1>
          <div className={styles.noteDetailContent}>
            The note you're looking for might have been deleted or doesn't exist.
          </div>
        </div>
      </div>
    );
  }
  
  // Format the date
  const formattedDate = note.created ? new Date(note.created).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Unknown date';

  return (
    <div className={styles.noteDetailContainer} style={{ textAlign: 'left' }}>
      <Link href="/notes" className={styles.backButton}>
        <span className={styles.backIcon}>←</span> Back to Notes
      </Link>
      
      <div className={styles.noteDetailCard}>
        {isEditing ? (
          <form onSubmit={handleUpdate} className={styles.editForm}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.formLabel}>Title</label>
              <input
                id="title"
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="content" className={styles.formLabel}>Content</label>
              <textarea
                id="content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className={`${styles.formInput} ${styles.formTextarea}`}
                rows={8}
                required
              />
            </div>
            
            <div className={styles.actionButtons}>
              <button type="submit" className={styles.saveButton}>
                Save Changes
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(note.title);
                  setEditedContent(note.content);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1 className={styles.noteDetailTitle}>{note.title}</h1>
            <div className={styles.noteDetailContent}>{note.content}</div>
            <p className={styles.noteDetailDate}>Created on {formattedDate}</p>
            
            <div className={styles.actionButtons}>
              <button 
                onClick={() => setIsEditing(true)} 
                className={styles.editButton}
              >
                Edit Note
              </button>
              <button 
                onClick={handleDelete} 
                className={styles.deleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Note'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}