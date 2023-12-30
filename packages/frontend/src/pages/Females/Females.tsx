// src/pages/Females/Females.tsx
import React, { useState, } from "react";
import styles from "./Females.module.css";
import useFetchDogs from "../../hooks/use.fetchDogs";


const Females: React.FC = () => {
  const [breed, setBreed] = useState("pom");
  const dogs = useFetchDogs(breed, "f");

  return (
    <div className={styles.females}>
      <h1>Females</h1>
      <p>Meet our lovely female dogs!</p>
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

export default Females;
