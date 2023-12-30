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

  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);


  useEffect(() => {
    axios
      .get(`${backendUrl}/dogs`)
      .then((response) => {
        setDogs(response.data);
      })
      .catch((error) => console.error("Error fetching dogs:", error));
  }, []);

  const handleCheckboxChange = (id: any) => {
    setSelectedDogs((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((id) => id !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleAddDog = () => {
    axios
      .post(`${backendUrl}/dogs`, newDog, { withCredentials: true })
      .then((response) => {
        const addedDog = response.data as Dog;
        setDogs([...dogs, addedDog]);
      })
      .catch((error) => console.error("Error adding dog:", error));
  };

  const handleDeleteDogs = async (ids: string[]) => {
    const isConfirmed = window.confirm("Are you sure you want to proceed?");
    if (!isConfirmed) {
      return;
    }

    const body = { ids };

    try {
      await axios.delete(`${backendUrl}/dogs`, {
        data: body,
        withCredentials: true,
      });
      setDogs((prevDogs) => prevDogs.filter((dog) => !ids.includes(dog._id)));
    } catch (error) {
      console.error("Error deleting dog:", error);
    }
  };

  const handleDeleteDog = (id: any) => {
    const isConfirmed = window.confirm("Are you sure you want to proceed?");

    if (!isConfirmed) {
      return;
    }
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
      <div className="add-dog-form">
        <h2>Add New Dog</h2>
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
          onChange={(e) =>
            setNewDog({ ...newDog, breed: e.target.value.toLowerCase() })
          }
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
      <div className="dog-list">
        <h2>Dog List</h2>
        <ul>
          {Array.isArray(dogs) &&
            dogs.map((dog) => (
              <li key={dog._id}>
                <input
                  type="checkbox"
                  checked={selectedDogs.includes(dog._id)}
                  onChange={() => handleCheckboxChange(dog._id)}
                />
                {dog.name} - {dog.breed} - {dog.age} - {dog.gender}
                <button onClick={() => handleDeleteDog(dog._id)}>
                  Delete
                </button>
              </li>
            ))}
        </ul>
        <button onClick={() => handleDeleteDogs(selectedDogs)}>
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
