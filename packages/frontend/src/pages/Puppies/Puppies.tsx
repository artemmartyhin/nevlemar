// src/pages/Puppies/Puppies.tsx
import React from 'react';
import styles from './Puppies.module.css';

const Puppies: React.FC = () => {
  return (
    <div className={styles.puppies}>
      <h1>Puppies</h1>
      <p>Check out our adorable puppies!</p>
    </div>
  );
}

export default Puppies;