// src/pages/Puppies/Puppies.tsx
import React, { useState, useEffect } from "react";
import styles from "./Puppies.module.css";

import axios from "axios";

const backendUrl = "http://localhost:3001";

interface Dog {
  _id: string;
  name: string;
  age: number;
  breed: string;
  gender: string;
}

const Puppies: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breed, setBreed] = useState("pom");

  useEffect(() => {
    axios
      .get(
        `${backendUrl}/dogs/${breed}/p
    `
      )
      .then((response) => {
        setDogs(response.data);
      })
      .catch((error) => console.error("Error fetching dogs:", error));
  }, [breed]);

  const handleBreedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBreed(event.target.value);
  };

  return (
    <div className={styles.puppies}>
      <h1>Puppies</h1>
      <p>Meet our lovely puppy dogs!</p>
      <div>
        Choose a breed:
        <select value={breed} onChange={handleBreedChange}>
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
