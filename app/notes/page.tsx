// app/notes/page.tsx
import PocketBase from 'pocketbase';
import Link from 'next/link';
import styles from './Notes.module.css';
import CreateNote from './CreateNote';

async function getNotes() {
  const db = new PocketBase('http://127.0.0.1:8090');
  const data = await db.records.getList('notes');
  console.log('data', data);
  return data?.items as any[];
}

export default async function NotesPage() {
  const notes = await getNotes();
  const hasNotes = notes && notes.length > 0;

  return(
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