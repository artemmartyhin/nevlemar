// src/pages/Males/Males.tsx
import React, { useState } from "react";
import styles from "./Males.module.css";
import useFetchDogs from "../../hooks/use.fetchDogs";


const Males: React.FC = () => {
  const [breed, setBreed] = useState("pom");
  const dogs = useFetchDogs(breed, "m");

  return (
    <div className={styles.males}>
      <h1>Males</h1>
      <p>Meet our lovely male dogs!</p>
      <div>
        Choose a breed:
        <select value={breed} onChange={(e) => setBreed(e.target.value)}>
          <option value="pom">Pomeranian pom</option>
          <option value="cvergsnaucer">Cvergsnaucer</option>
        </select>
      </div>
      <div>
        {dogs.map((dog) => (
          <li key={dog._id}>
            {dog.name} - {dog.breed} - {dog.age} - {dog.gender}
          </li>
        ))}
      </div>
    </div>
  );
};

export default Males;
