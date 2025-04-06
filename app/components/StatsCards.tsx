import React from 'react';
import styles from './StatsCards.module.css';

// Define the Stats type
type StatsData = {
  totalNotes: number;
  latestNoteDate: string;
  longestNoteTitle: string;
  recentNotes: number;
};

// Props interface
interface StatsCardsProps {
  stats: StatsData;
}

// Non-async component that receives stats as props
export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className={styles.statsContainer}>
      <h2 className={styles.statsTitle}>Notes Dashboard</h2>
      <div className={styles.statsGrid}>
        <div className={styles.statsCard}>
          <h3>Total Notes</h3>
          <p className={styles.statValue}>{stats.totalNotes}</p>
        </div>
        
        <div className={styles.statsCard}>
          <h3>Recent Activity</h3>
          <p className={styles.statValue}>{stats.recentNotes}</p>
          <p className={styles.statLabel}>notes in the last 7 days</p>
        </div>
        
        <div className={styles.statsCard}>
          <h3>Latest Note</h3>
          <p className={styles.statDate}>{stats.latestNoteDate}</p>
        </div>
        
        <div className={styles.statsCard}>
          <h3>Longest Note</h3>
          <p className={styles.statTitle}>{stats.longestNoteTitle}</p>
        </div>
      </div>
    </div>
  );
}