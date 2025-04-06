// app/page.tsx
import { getNotesStats } from './utils/statsUtils';
import styles from './home.module.css';
import Link from 'next/link';

export default async function HomePage() {
  // Fetch the stats data
  const stats = await getNotesStats();
  
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Your Personal Notes Hub</h1>
          <p className={styles.heroSubtitle}>
            Organize your thoughts, capture ideas, and access your notes anytime
          </p>
          <Link href="/notes" className={styles.primaryButton}>
            View Your Notes
          </Link>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.notesIllustration}>
            <div className={styles.note1}></div>
            <div className={styles.note2}></div>
            <div className={styles.note3}></div>
          </div>
        </div>
      </section>

      {/* Main content with side-by-side sections that reflow on smaller screens */}
      <div className={styles.mainContent}>
        <section className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.dashIcon}>📊</span> 
            Dashboard Overview
          </h2>
          
          <div className={styles.statsGrid}>
            <div className={styles.statsCard}>
              <div className={styles.statIconWrapper}>
                <span className={styles.statIcon}>📝</span>
              </div>
              <div className={styles.statInfo}>
                <h3>Total Notes</h3>
                <p className={styles.statValue}>{stats.totalNotes}</p>
              </div>
            </div>
            
            <div className={styles.statsCard}>
              <div className={styles.statIconWrapper}>
                <span className={styles.statIcon}>🔥</span>
              </div>
              <div className={styles.statInfo}>
                <h3>Recent Activity</h3>
                <p className={styles.statValue}>{stats.recentNotes}</p>
                <p className={styles.statLabel}>notes in the last 7 days</p>
              </div>
            </div>
            
            <div className={styles.statsCard}>
              <div className={styles.statIconWrapper}>
                <span className={styles.statIcon}>🕒</span>
              </div>
              <div className={styles.statInfo}>
                <h3>Latest Note</h3>
                <p className={styles.statDate}>{stats.latestNoteDate}</p>
              </div>
            </div>
            
            <div className={styles.statsCard}>
              <div className={styles.statIconWrapper}>
                <span className={styles.statIcon}>📄</span>
              </div>
              <div className={styles.statInfo}>
                <h3>Longest Note</h3>
                <p className={styles.statTitle}>{stats.longestNoteTitle}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.featureIcon}>✨</span> 
            Features
          </h2>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.featureIcon}>🚀</span>
              </div>
              <h3>Fast & Responsive</h3>
              <p>Built with Next.js 13 for lightning-fast performance across all devices</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.featureIcon}>🔒</span>
              </div>
              <h3>Secure Storage</h3>
              <p>Your notes are securely stored in a PocketBase database</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.featureIcon}>🔄</span>
              </div>
              <h3>Real-time Updates</h3>
              <p>Changes reflect immediately with optimized rendering</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.featureIcon}>💻</span>
              </div>
              <h3>Modern UI</h3>
              <p>Clean, intuitive interface designed for productivity</p>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to create a new note?</h2>
          <p>Capture your thoughts, ideas, and reminders in one place</p>
          <Link href="/notes" className={styles.ctaButton}>
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}