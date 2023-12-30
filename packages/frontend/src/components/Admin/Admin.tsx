import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

import { Dog } from "../../hooks/use.fetchDogs";

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [newDog, setNewDog] = useState<Dog>({
    _id: "",
    name: "",
    age: 0,
    breed: "pom",
    gender: "m",
    image: null,
  });
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}/dogs`)
      .then((response) => {
        setDogs(response.data);
      })
      .catch((error) => console.error("Error fetching dogs:", error));
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleCheckboxChange = (id: any) => {
    setSelectedDogs((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((id) => id !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newDog.name);
    formData.append("age", String(newDog.age));
    formData.append("breed", newDog.breed);
    formData.append("gender", newDog.gender);

    if (newDog.image) {
      formData.append("image", newDog.image, newDog.image.name);
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/dogs",
        formData,
        {
          withCredentials: true,
        }
      );

      fetchDogs();
    } catch (error) {
      console.error("Error adding dog:", error);
    }
  };

  const handleDeleteDogs = async (ids: string[]) => {
    const isConfirmed = window.confirm("Are you sure you want to proceed?");
    if (!isConfirmed) {
      return;
    }

    const body = { ids };

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND}/dogs`, {
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
      .delete(`${process.env.REACT_APP_BACKEND}/dogs/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        setDogs(dogs.filter((dog) => dog._id !== id));
      })
      .catch((error) => console.error("Error deleting dog:", error));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewDog({ ...newDog, image: file });
      const filePreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(filePreviewUrl);
    }
  };

  const fetchDogs = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}/dogs`)
      .then((response) => {
        setDogs(response.data);
      })
      .catch((error) => console.error("Error fetching dogs:", error));
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

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {previewUrl && (
          <img src={previewUrl} alt="Preview" style={{ height: "100px" }} />
        )}

        <button onClick={handleSubmit}>Add Dog</button>
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
                {dog.image && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND}/uploads/${dog.image}`}
                    alt={dog.name}
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
                <button onClick={() => handleDeleteDog(dog._id)}>Delete</button>
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
