// src/components/Header/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <Link to="/">Home</Link>
      <Link to="/males">Males</Link>
      <Link to="/females">Females</Link>
      <Link to="/puppies">Puppies</Link>
    </div>
  );
}

export default Header;
