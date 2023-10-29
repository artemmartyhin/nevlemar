// src/pages/DogProfile/DogProfile.tsx
import React from 'react';
import styles from './DogProfile.module.css';

interface DogProfileProps {
  // Add any props that you need for the dog profile here
  name: string;
  age: number;
  breed: string;
  description: string;
}

const DogProfile: React.FC<DogProfileProps> = ({ name, age, breed, description }) => {
  return (
    <div className={styles.dogProfile}>
      <h1>{name}</h1>
      <p>Age: {age}</p>
      <p>Breed: {breed}</p>
      <p>{description}</p>
    </div>
  );
}

export default DogProfile;
