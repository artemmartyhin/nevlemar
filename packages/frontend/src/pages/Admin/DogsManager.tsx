import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { debounce } from "lodash";
import { IconButton, Button } from "@mui/material";
import { ExpandMore, ExpandLess, FilterList } from "@mui/icons-material";

import { Dog } from "../../hooks/use.fetchDogs";

const DogsManager: React.FC = () => {
  const { user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
  const [filters, setFilters] = useState({
    breed: "",
    gender: "",
    minAge: "",
    maxAge: "",
    search: "",
  });
  const [newDog, setNewDog] = useState<Dog>({
    _id: "",
    name: "",
    born: new Date(),
    breed: "pom",
    description: "",
    gender: true,
    images: [],
  });
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [originalName, setOriginalName] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchDogs();
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    applyFilters();
  }, [filters, dogs]);

  const handleCheckboxChange = (id: any) => {
    setSelectedDogs((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((dogId) => dogId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !newDog.name ||
      !newDog.born ||
      (!newDog.images?.length && !previewUrl)
    ) {
      alert("Please fill out all fields and add an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newDog.name);
    formData.append("born", newDog.born.toISOString());
    formData.append("breed", newDog.breed);
    formData.append("description", newDog.description);
    formData.append("gender", String(newDog.gender));
    if (newDog.images?.length) {
      formData.append("image", newDog.images[0]);
    }

    try {
      if (isEditing) {
        await axios.patch(
          `${process.env.REACT_APP_BACKEND}/dogs/${newDog._id}`,
          formData,
          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND}/dogs`, formData, {
          withCredentials: true,
        });
      }

      fetchDogs();
      handleGoBack();
    } catch (error) {
      console.error("Error adding/updating dog:", error);
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

  const handleEditDog = (dog: Dog) => {
    setNewDog({
      ...dog,
      born: new Date(dog.born), // Ensure born is a Date object
      images: [], // Reset images array
    });
    if (dog.images && dog.images[0])
      setPreviewUrl(
        `${process.env.REACT_APP_BACKEND}/uploads/${dog.images[0]}`
      );
    setIsEditing(true);
    setOriginalName(dog.name); // Set the original name for the title
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
      })
      .catch((error) => console.error("Error fetching dogs:", error));
  };

  const handleGoBack = () => {
    setNewDog({
      _id: "",
      name: "",
      born: new Date(),
      breed: "pom",
      description: "",
      gender: true,
      images: [],
    });
    setIsEditing(false);
    setPreviewUrl(null);
    setOriginalName(""); // Reset the original name
  };

  const applyFilters = () => {
    let filtered = dogs;

    if (filters.breed) {
      filtered = filtered.filter((dog) =>
        dog.breed.toLowerCase().includes(filters.breed.toLowerCase())
      );
    }

    if (filters.gender) {
      filtered = filtered.filter((dog) =>
        dog.gender === (filters.gender === "Male")
      );
    }

    if (filters.minAge) {
      filtered = filtered.filter(
        (dog) =>
          new Date().getFullYear() - new Date(dog.born).getFullYear() >=
          parseInt(filters.minAge)
      );
    }

    if (filters.maxAge) {
      filtered = filtered.filter(
        (dog) =>
          new Date().getFullYear() - new Date(dog.born).getFullYear() <=
          parseInt(filters.maxAge)
      );
    }

    if (filters.search) {
      filtered = filtered.filter((dog) =>
        dog.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredDogs(filtered);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const debouncedSearch = debounce((value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: value,
    }));
  }, 300);

  if (user?.role !== "admin") {
    return <p>Sorry. You are not authorized to view this page.</p>;
  }

  return (
    <div className="flex justify-center p-6 bg-gray-100 min-h-screen">
      <div className="flex space-x-6 max-w-7xl w-full">
        <div className="w-1/2 h-screen overflow-y-auto pr-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Dog List</h2>
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="contained"
              color="primary"
              startIcon={<FilterList />}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              Filters
            </Button>
          </div>
          {isFilterOpen && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="mb-4">
                <TextField
                  label="Search by Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <InputLabel id="breed-label">Breed</InputLabel>
                  <Select
                    labelId="breed-label"
                    name="breed"
                    value={filters.breed}
                    onChange={handleSelectChange}
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="pom">Pomeranian</MenuItem>
                    <MenuItem value="cvergsnaucer">Cvergsnaucer</MenuItem>
                  </Select>
                </div>
                <div>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    name="gender"
                    value={filters.gender}
                    onChange={handleSelectChange}
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <TextField
                  label="Min Age"
                  variant="outlined"
                  type="number"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Max Age"
                  variant="outlined"
                  type="number"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  fullWidth
                  size="small"
                />
              </div>
              <button
                onClick={() => handleDeleteDogs(selectedDogs)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-150"
              >
                Delete Selected
              </button>
            </div>
          )}
          {Array.isArray(filteredDogs) && (
            <ul>
              {filteredDogs.map((dog) => (
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditDog(dog)}
                      className="px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDog(dog._id)}
                      className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-150"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-1/2 pl-4 pr-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            {isEditing ? `Edit ${originalName}` : "Add New Dog"}
          </h2>
          <form
            className="bg-white p-6 rounded-lg shadow-md"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                type="text"
                placeholder="Name"
                className="p-2 border border-gray-300 rounded w-full"
                value={newDog.name}
                onChange={(e) => setNewDog({ ...newDog, name: e.target.value })}
              />
              <input
                type="date"
                placeholder="Born"
                className="p-2 border border-gray-300 rounded w-full"
                value={newDog.born.toISOString().split("T")[0]}
                onChange={(e) =>
                  setNewDog({ ...newDog, born: new Date(e.target.value) })
                }
              />
              <textarea
                placeholder="Description"
                className="p-2 border border-gray-300 rounded w-full"
                value={newDog.description}
                rows={6} // Increase rows by 3
                onChange={(e) =>
                  setNewDog({ ...newDog, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <select
                value={newDog.breed}
                className="p-2 border border-gray-300 rounded w-full"
                onChange={(e) =>
                  setNewDog({ ...newDog, breed: e.target.value.toLowerCase() })
                }
              >
                <option value="pom">Pomeranian</option>
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
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                className="mb-2"
                onChange={handleImageChange}
              />
              {previewUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-48 w-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
              >
                {isEditing ? "Save" : "Add Dog"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full"
                >
                  Go Back
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DogsManager;
