// src/pages/Puppies/Puppies.tsx
import React, { useState } from "react";
import styles from "./Puppies.module.css";
import useFetchDogs from "../../hooks/use.fetchDogs";


const Puppies: React.FC = () => {
  const [breed, setBreed] = useState("pom");
  const dogs = useFetchDogs(breed, "p");

  return (
    <div className={styles.puppies}>
      <h1>Puppies</h1>
      <p>Meet our lovely puppy dogs!</p>
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

export default Puppies;
