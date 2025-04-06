// app/notes/[id]/page.tsx
import Link from 'next/link';
import styles from '../Notes.module.css';

async function getNote(noteId: string) {
  try {
    const res = await fetch(
      `http://127.0.0.1:8090/api/collections/notes/records/${noteId}`,
      {
        next: { revalidate: 10 },
      }
    );
    
    if (!res.ok) {
      throw new Error('Failed to fetch note');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching note:', error);
    return { 
      title: 'Note not found', 
      content: 'This note could not be loaded', 
      created: new Date().toISOString() 
    };
  }
}

export default async function NotePage({ params }: { params: { id: string } }) {
  const note = await getNote(params.id);
  
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
        <h1 className={styles.noteDetailTitle}>{note.title}</h1>
        <div className={styles.noteDetailContent}>{note.content}</div>
        <p className={styles.noteDetailDate}>Created on {formattedDate}</p>
      </div>
    </div>
  );
}