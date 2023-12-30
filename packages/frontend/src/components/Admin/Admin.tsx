import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

interface Dog {
  _id: string;
  name: string;
  age: number;
  breed: string;
  gender: string;
}
const backendUrl = "http://localhost:3001";

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [newDog, setNewDog] = useState({
    name: "",
    age: 0,
    breed: "pom",
    gender: "m",
  });

  useEffect(() => {
    axios
      .get(`${backendUrl}/dogs`)
      .then((response) => {
        setDogs(response.data);
      })
      .catch((error) => console.error("Error fetching dogs:", error));
  }, []);

  const handleAddDog = () => {
    axios
      .post(`${backendUrl}/dogs`, newDog, { withCredentials: true })
      .then((response) => {
        const addedDog = response.data as Dog;
        setDogs([...dogs, addedDog]);
      })
      .catch((error) => console.error("Error adding dog:", error));
  };

  const handleDeleteDog = (id: any) => {
    axios
      .delete(`${backendUrl}/dogs/${id}`, { withCredentials: true })
      .then(() => {
        setDogs(dogs.filter((dog) => dog._id !== id));
      })
      .catch((error) => console.error("Error deleting dog:", error));
  };

  if (user?.role !== "admin") {
    return <p>Sorry. You are not authorized to view this page.</p>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setNewDog({ ...newDog, name: e.target.value })}
        />

        <input
          type="number"
          placeholder="Age"
          onChange={(e) => setNewDog({ ...newDog, age: +e.target.value })}
        />

        <select 
          value={newDog.breed}
          onChange={(e) => setNewDog({ ...newDog, breed: e.target.value.toLowerCase() })}
        >
          <option value="pom">Pomeranian pom</option>
          <option value="cvergsnaucer">Cvergsnaucer</option>
        </select>
        <select
          value={newDog.gender}
          onChange={(e) => setNewDog({ ...newDog, gender: e.target.value })}
        >
          <option value="f">Female</option>
          <option value="m">Male</option>
          <option value="p">Puppy</option>
        </select>
        <button onClick={handleAddDog}>Add Dog</button>
      </div>
      <ul>
        {Array.isArray(dogs) ? (
          dogs.map((dog) => (
            <li key={dog._id}>
              {dog.name} - {dog.breed} - {dog.age} - {dog.gender}
              <button onClick={() => handleDeleteDog(dog._id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No dogs available or data is not in the expected format.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminPanel;
