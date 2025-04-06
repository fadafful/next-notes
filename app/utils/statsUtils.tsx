import PocketBase from 'pocketbase';

export type StatsData = {
  totalNotes: number;
  latestNoteDate: string;
  longestNoteTitle: string;
  recentNotes: number;
};

export async function getNotesStats(): Promise<StatsData> {
  const db = new PocketBase('http://127.0.0.1:8090');
  const data = await db.records.getList('notes', 1, 100);
  console.log('Records data: ', data);
  // Calculate stats
  const totalNotes = data.items.length;
  
  // Get creation dates and find the most recent
  const creationDates = data.items.map(note => new Date(note.created));
  const latestNoteDate = creationDates.length > 0 
    ? new Date(Math.max(...creationDates.map(date => date.getTime())))
    : new Date();
  
  // Find the longest note
  const longestNote = data.items.reduce((longest, current) => 
    (current.content?.length > longest.content?.length) ? current : longest, 
    { content: '', title: 'No notes yet' }
  );
  
  // Count notes created in the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentNotes = creationDates.filter(date => date > oneWeekAgo).length;
  
  return {
    totalNotes,
    latestNoteDate: latestNoteDate.toLocaleDateString(),
    longestNoteTitle: longestNote.title || 'Untitled',
    recentNotes
  };
}