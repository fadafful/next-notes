'use client';

import { useEffect, useRef } from 'react';
import styles from './MatrixBackground.module.css';

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to fill window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters to display (can include katakana for more authentic matrix look)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$&+,:;=?@#|<>!*()[]{}';
    
    // Font size
    const fontSize = 14;
    
    // Calculate columns
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to store current y position of each column
    const drops: number[] = [];
    
    // Initialize all columns
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Start at random positions above viewport
    }

    // Drawing animation
    function draw() {
      // Add semi-transparent black rectangle to gradually fade previous characters
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set text color and font
      ctx.fillStyle = '#0F0'; // Matrix green
      ctx.font = `${fontSize}px monospace`;
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Select a random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw character at position
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Occasionally make characters brighter (the "highlighted" effect)
        if (Math.random() > 0.98) {
          ctx.fillStyle = '#FFF'; // Bright white for highlight
        } else {
          ctx.fillStyle = '#0F0'; // Regular matrix green
        }
        
        ctx.fillText(char, x, y);
        
        // Reset position if it's reached bottom or with small random chance
        if (y > canvas.height || Math.random() > 0.99) {
          drops[i] = 0;
        }
        
        // Move the droplet down
        drops[i]++;
      }
      
      // Call the animation again
      animationFrameId = requestAnimationFrame(draw);
    }

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Recalculate columns
      const newColumns = Math.floor(canvas.width / fontSize);
      
      // Adjust drops array size
      if (newColumns > drops.length) {
        // Add new columns
        for (let i = drops.length; i < newColumns; i++) {
          drops[i] = Math.random() * -100;
        }
      }
      // We don't need to remove columns, the extra ones just won't be drawn
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    let animationFrameId = requestAnimationFrame(draw);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.matrixCanvas} />;
};

export default MatrixBackground;