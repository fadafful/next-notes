// app/notes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Notes.module.css';
import CreateNote from './CreateNote';
import LoadingState from '../components/LoadingState';
import { useAuth } from '../context/AuthContext';

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchNotes() {
      if (!isAuthenticated) return;
      
      try {
        // Use the original fetch approach that was working before
        const response = await fetch('http://127.0.0.1:8090/api/collections/notes/records?page=1&perPage=30', {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        
        const data = await response.json();
        console.log('Fetched notes data:', data);
        
        // Set notes from the items array
        setNotes(data.items || []);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotes();
  }, [isAuthenticated]);

  // Show loading state while checking authentication
  if (!isAuthenticated || isLoading) {
    return <LoadingState />;
  }

  const hasNotes = notes && notes.length > 0;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader} style={{ textAlign: 'left', marginLeft: 0, paddingLeft: 0 }}>
        <h1 className={styles.pageTitle}>My Notes</h1>
        <p className={styles.pageSubtitle}>
          Capture your thoughts, ideas, and moments. Your digital sticky notes, all in one place.
        </p>
      </header>

      {hasNotes ? (
        <div className={styles.grid}>
          {notes.map((note) => {
            return <Note key={note.id} note={note} />;
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>No Notes Yet</h3>
          <p>Create your first note to get started</p>
        </div>
      )}

      <CreateNote />
    </div>
  );
}

function Note({ note }: any) {
  const { id, title, content, created } = note || {};
  
  // Format the date
  const formattedDate = new Date(created).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Link href={`/notes/${id}`}>
      <div className={styles.note}>
        <span className={styles.notePushpin}></span>
        <h2>{title}</h2>
        <h5>{content}</h5>
        <p>{formattedDate}</p>
      </div>
    </Link>
  );
}