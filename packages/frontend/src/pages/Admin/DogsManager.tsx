import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Dog } from "../../hooks/use.fetchDogs";

const DoogsManager: React.FC = () => {
  const { user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [newDog, setNewDog] = useState<Dog>({
    _id: "",
    name: "",
    born: new Date(),
    breed: "pom",
    gender: true,
    images: [],
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
    formData.append("born", newDog.born.toISOString());
    formData.append("breed", newDog.breed);
    formData.append("gender", String(newDog.gender));

    if (!newDog.images) {
      return;
    }
    if (newDog.images[0]) {
      formData.append("image", newDog.images[0]);
    }

    try {
      await axios.post("http://localhost:3001/dogs", formData, {
        withCredentials: true,
      });

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
      const images = newDog.images ? [...newDog.images, file] : [file];
      setNewDog({ ...newDog, images });
      const filePreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(filePreviewUrl);
    }
  };

  const fetchDogs = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}/dogs`)
      .then((response) => {
        setDogs(response.data);
        console.log(dogs);
      })
      .catch((error) => console.error("Error fetching dogs:", error));
  };

  if (user?.role !== "admin") {
    return <p>Sorry. You are not authorized to view this page.</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Dogs Manager
      </h1>
      <div className="add-dog-form max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Add New Dog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Name"
            className="p-2 border border-gray-300 rounded"
            onChange={(e) => setNewDog({ ...newDog, name: e.target.value })}
          />
          <input
            type="Date"
            placeholder="born"
            className="p-2 border border-gray-300 rounded"
            onChange={(e) =>
              setNewDog({ ...newDog, born: new Date(e.target.value) })
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={newDog.breed}
            className="p-2 border border-gray-300 rounded"
            onChange={(e) =>
              setNewDog({ ...newDog, breed: e.target.value.toLowerCase() })
            }
          >
            <option value="pom">Pomeranian pom</option>
            <option value="cvergsnaucer">Cvergsnaucer</option>
          </select>
          <FormControlLabel
            control={
              <Switch
                checked={newDog.gender}
                onChange={(e) =>
                  setNewDog({
                    ...newDog,
                    gender: e.target.checked,
                  })
                }
                name="genderSwitch"
                color="primary"
              />
            }
            label={newDog.gender ? "Male" : "Female"}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={handleImageChange}
        />
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="h-24 mb-4" />
        )}
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Dog
        </button>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Dog List</h2>
        {Array.isArray(dogs) && (
          <ul>
            {dogs.map((dog) => (
              <li
                key={dog._id}
                className="flex items-center justify-between mb-4 p-2 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 mr-3"
                    checked={selectedDogs.includes(dog._id)}
                    onChange={() => handleCheckboxChange(dog._id)}
                  />
                  <div className="flex flex-col flex-1">
                    <span className="text-gray-900 font-medium">
                      Name: {dog.name}
                    </span>
                    <span className="text-gray-600">
                      Breed: {dog.breed.charAt(0).toUpperCase()}
                      {dog.breed.slice(1).toLowerCase()}
                    </span>
                    <span className="text-gray-600">
                      Born:{" "}
                      {new Date(dog.born).toLocaleDateString("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-gray-600">
                      Gender: {dog.gender ? "Male" : "Female"}
                    </span>
                  </div>
                </div>
                {dog.images && dog.images[0] && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND}/uploads/${dog.images[0]}`}
                    alt={dog.name}
                    className="w-24 h-24 object-cover rounded-lg mr-2"
                  />
                )}
                <button
                  onClick={() => handleDeleteDog(dog._id)}
                  className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-150"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => handleDeleteDogs(selectedDogs)}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-150"
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default DoogsManager;
