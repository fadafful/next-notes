'use client';

import React from 'react';
import styles from './LoadingState.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Loading your notes...</p>
    </div>
  );
}