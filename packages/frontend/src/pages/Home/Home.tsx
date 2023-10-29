// src/pages/Home/Home.tsx
import React from 'react';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <h1>Welcome to Our Dog Kennel</h1>
      <p>Find the best companions and friends here!</p>
    </div>
  );
}

export default Home;