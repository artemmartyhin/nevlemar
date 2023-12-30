// src/pages/Females/Females.tsx
import React, { useState, useEffect } from "react";
import styles from "./Females.module.css";

import axios from "axios";


interface Dog {
  _id: string;
  name: string;
  age: number;
  breed: string;
  gender: string;
}

const Females: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breed, setBreed] = useState("pom");

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND}/dogs/${breed}/f`
      )
      .then((response) => {
        setDogs(response.data);
      })
      .catch((error) => console.error("Error fetching dogs:", error));
  }, [breed]);


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
