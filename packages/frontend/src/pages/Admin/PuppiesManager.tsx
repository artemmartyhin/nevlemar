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
import { Button, IconButton, Collapse } from "@mui/material";
import { FilterList, ExpandMore, ExpandLess, Save } from "@mui/icons-material";

import { Dog } from "../../hooks/use.fetchDogs";
import { Puppy, Puppies } from "../../hooks/use.fetchPuppies";

const PuppiesManager: React.FC = () => {
  const { user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [puppies, setPuppies] = useState<Puppies[]>([]);
  const [filteredPuppies, setFilteredPuppies] = useState<Puppies[]>([]);
  const [filters, setFilters] = useState({
    breed: "",
    gender: "",
    minAge: "",
    maxAge: "",
    search: "",
  });
  const [newPuppies, setNewPuppies] = useState<Puppies>({
    _id: "",
    puppies: [],
    mom: "",
    dad: "",
    breed: "pom",
    image: null,
  });
  const [puppyPreviews, setPuppyPreviews] = useState<string[]>([]);
  const [selectedPuppies, setSelectedPuppies] = useState<string[]>([]);
  const [outerPreviewUrl, setOuterPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [originalName, setOriginalName] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectingParent, setSelectingParent] = useState<string | null>(null);
  const [expandedPuppies, setExpandedPuppies] = useState<number[]>([]);

  useEffect(() => {
    fetchDogs();
    fetchPuppies();
    return () => {
      if (outerPreviewUrl) {
        URL.revokeObjectURL(outerPreviewUrl);
      }
      puppyPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [outerPreviewUrl, puppyPreviews]);

  useEffect(() => {
    applyFilters();
  }, [filters, puppies]);

  const handleCheckboxChange = (id: string) => {
    setSelectedPuppies((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((puppyId) => puppyId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      newPuppies.puppies.length === 0 ||
      newPuppies.puppies.some(
        (puppy) => !puppy.name || !puppy.born || !puppy.image
      )
    ) {
      alert("Please fill out all fields for each puppy and add images.");
      return;
    }

    const formData = new FormData();
    formData.append("breed", newPuppies.breed);
    formData.append("mom", newPuppies.mom);
    formData.append("dad", newPuppies.dad);
    if (newPuppies.image) {
      formData.append("files", newPuppies.image);
    }

    newPuppies.puppies.forEach((puppy, index) => {
      formData.append(`puppies[${index}][name]`, puppy.name);
      formData.append(
        `puppies[${index}][born]`,
        new Date(puppy.born).toISOString()
      ); // Convert to Date object
      formData.append(`puppies[${index}][gender]`, puppy.gender);
      if (puppy.image) {
        formData.append("files", puppy.image);
      }
    });

    try {
      if (isEditing) {
        await axios.patch(
          `${process.env.REACT_APP_BACKEND}/puppies/${newPuppies._id}`,
          formData,
          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND}/puppies`, formData, {
          withCredentials: true,
        });
      }

      fetchPuppies();
      handleGoBack();
    } catch (error) {
      console.error("Error adding/updating puppies:", error);
    }
  };

  const handleDeletePuppies = async (ids: string[]) => {
    const isConfirmed = window.confirm("Are you sure you want to proceed?");
    if (!isConfirmed) {
      return;
    }

    const body = { ids };

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND}/puppies`, {
        data: body,
        withCredentials: true,
      });
      setPuppies((prevPuppies) =>
        prevPuppies.filter((puppy) => !ids.includes(puppy._id))
      );
    } catch (error) {
      console.error("Error deleting puppies:", error);
    }
  };

  const handleDeletePuppy = (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to proceed?");

    if (!isConfirmed) {
      return;
    }
    axios
      .delete(`${process.env.REACT_APP_BACKEND}/puppies/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        setPuppies(puppies.filter((puppy) => puppy._id !== id));
      })
      .catch((error) => console.error("Error deleting puppy:", error));
  };

  const handleEditPuppy = (puppy: Puppies) => {
    const updatedPuppyPreviews: string[] = puppy.puppies
      .map((p) => {
        if (typeof p.image === "string") {
          return `${process.env.REACT_APP_BACKEND}/uploads/${p.image}`;
        } else if (p.image instanceof File) {
          return URL.createObjectURL(p.image);
        }
        // Handle case where p.image is null or undefined
        return ""; // or any default value you prefer
      })
      .filter((url) => url !== null); // Filter out null values

    setNewPuppies({
      _id: puppy._id,
      puppies: puppy.puppies.map((p) => ({
        ...p,
        born: new Date(p.born), // Convert to Date object
      })),
      mom: puppy.mom,
      dad: puppy.dad,
      breed: puppy.breed,
      image: puppy.image,
    });

    if (puppy.image) {
      setOuterPreviewUrl(
        typeof puppy.image === "string"
          ? `${process.env.REACT_APP_BACKEND}/uploads/${puppy.image}`
          : URL.createObjectURL(puppy.image)
      );
    }

    setPuppyPreviews(updatedPuppyPreviews);
    setIsEditing(true);
    setOriginalName(puppy.breed); // Set the original name for the title
  };
  
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (index === -1) {
        setNewPuppies({ ...newPuppies, image: file });
        setOuterPreviewUrl(URL.createObjectURL(file));
      } else {
        const updatedPuppies = [...newPuppies.puppies];
        updatedPuppies[index].image = file;
        setNewPuppies({ ...newPuppies, puppies: updatedPuppies });
        const updatedPreviews = [...puppyPreviews];
        updatedPreviews[index] = URL.createObjectURL(file);
        setPuppyPreviews(updatedPreviews);
      }
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

  const fetchPuppies = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}/puppies`)
      .then((response) => {
        setPuppies(response.data);
      })
      .catch((error) => console.error("Error fetching puppies:", error));
  };

  const handleGoBack = () => {
    setNewPuppies({
      _id: "",
      puppies: [],
      mom: "",
      dad: "",
      breed: "pom",
      image: null,
    });
    setPuppyPreviews([]);
    setIsEditing(false);
    setOuterPreviewUrl(null);
    setOriginalName(""); // Reset the original name
    setSelectingParent(null); // Reset parent selection state
    setExpandedPuppies([]);
  };

  const applyFilters = () => {
    let filtered = puppies;

    if (filters.breed) {
      filtered = filtered.filter((puppy) =>
        puppy.breed.toLowerCase().includes(filters.breed.toLowerCase())
      );
    }

    if (filters.gender) {
      filtered = filtered.filter((puppy) =>
        puppy.puppies.some((p) => p.gender === filters.gender)
      );
    }

    if (filters.minAge) {
      filtered = filtered.filter(
        (puppy) =>
          new Date().getFullYear() -
            new Date(puppy.puppies[0].born).getFullYear() >=
          parseInt(filters.minAge)
      );
    }

    if (filters.maxAge) {
      filtered = filtered.filter(
        (puppy) =>
          new Date().getFullYear() -
            new Date(puppy.puppies[0].born).getFullYear() <=
          parseInt(filters.maxAge)
      );
    }

    if (filters.search) {
      filtered = filtered.filter((puppy) =>
        puppy.puppies.some((p) =>
          p.name.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    }

    setFilteredPuppies(filtered);
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

  const handleAddParent = (parentId: string) => {
    if (selectingParent === "mom") {
      setNewPuppies((prevPuppies) => ({
        ...prevPuppies,
        mom: parentId,
      }));
    } else if (selectingParent === "dad") {
      setNewPuppies((prevPuppies) => ({
        ...prevPuppies,
        dad: parentId,
      }));
    }
    setSelectingParent(null);
  };

  const filteredParentDogs = dogs.filter((dog) =>
    selectingParent === "mom"
      ? !dog.gender &&
        dog.breed === newPuppies.breed &&
        new Date(dog.born) < new Date(newPuppies.puppies[0]?.born || new Date())
      : dog.gender &&
        dog.breed === newPuppies.breed &&
        new Date(dog.born) < new Date(newPuppies.puppies[0]?.born || new Date())
  );

  const getParentName = (parentId: string) => {
    const parent = dogs.find((dog) => dog._id === parentId);
    return parent ? parent.name : "";
  };

  const toggleExpandPuppy = (index: number) => {
    setExpandedPuppies((prevState) => {
      if (prevState.includes(index)) {
        return prevState.filter((i) => i !== index);
      } else {
        return [...prevState, index];
      }
    });
  };

  if (user?.role !== "admin") {
    return <p>Sorry. You are not authorized to view this page.</p>;
  }

  return (
    <div className="flex justify-center p-6 bg-gray-100 min-h-screen">
      <div className="flex space-x-6 max-w-7xl w-full">
        <div className="w-1/2 h-screen overflow-y-auto pr-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Puppy List
          </h2>
          {selectingParent ? (
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <TextField
                  label="Search by Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Select {selectingParent === "mom" ? "Mom" : "Dad"}
              </h3>
              {Array.isArray(filteredParentDogs) && (
                <ul>
                  {filteredParentDogs.map((dog) => (
                    <li
                      key={dog._id}
                      className="flex items-center justify-between mb-4 p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
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
                        onClick={() => handleAddParent(dog._id)}
                        className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-150"
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={handleGoBack}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-150"
              >
                Go Back
              </button>
            </div>
          ) : (
            <>
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
                    onClick={() => handleDeletePuppies(selectedPuppies)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-150"
                  >
                    Delete Selected
                  </button>
                </div>
              )}
              {Array.isArray(filteredPuppies) && (
                <ul>
                  {filteredPuppies.map((puppy) => (
                    <li
                      key={puppy._id}
                      className="flex items-center justify-between mb-4 p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600 mr-3"
                          checked={selectedPuppies.includes(puppy._id)}
                          onChange={() => handleCheckboxChange(puppy._id)}
                        />
                        <div className="flex flex-col flex-1">
                          <span className="text-gray-900 font-medium">
                            Breed: {puppy.breed}
                          </span>
                          <span className="text-gray-600">
                            Mom: {getParentName(puppy.mom)}
                          </span>
                          <span className="text-gray-600">
                            Dad: {getParentName(puppy.dad)}
                          </span>
                        </div>
                      </div>
                      {puppy.image && (
                        <img
                          src={
                            typeof puppy.image === "string"
                              ? `${process.env.REACT_APP_BACKEND}/uploads/${puppy.image}`
                              : URL.createObjectURL(puppy.image)
                          }
                          alt={puppy.breed}
                          className="w-24 h-24 object-cover rounded-lg mr-2"
                        />
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPuppy(puppy)}
                          className="px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-150"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePuppy(puppy._id)}
                          className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
        <div className="w-1/2 pl-4 pr-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            {isEditing ? `Edit ${originalName}` : "Add New Puppies"}
          </h2>
          <form
            className="bg-white p-6 rounded-lg shadow-md"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                type="text"
                placeholder="Breed"
                className="p-2 border border-gray-300 rounded w-full mb-2"
                value={newPuppies.breed}
                onChange={(e) =>
                  setNewPuppies({ ...newPuppies, breed: e.target.value })
                }
              />
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Selected Parents:
                </h3>
                <ul>
                  {newPuppies.mom && (
                    <li className="text-gray-700">
                      Mom: {getParentName(newPuppies.mom)}
                    </li>
                  )}
                  {newPuppies.dad && (
                    <li className="text-gray-700">
                      Dad: {getParentName(newPuppies.dad)}
                    </li>
                  )}
                </ul>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                onClick={() => setSelectingParent("mom")}
              >
                Select Mom
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                onClick={() => setSelectingParent("dad")}
              >
                Select Dad
              </button>
              <input
                type="file"
                accept="image/*"
                className="mb-2"
                onChange={(e) => handleImageChange(e, -1)}
              />
              {outerPreviewUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={outerPreviewUrl}
                    alt="Preview"
                    className="h-48 w-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              {newPuppies.puppies.map((puppy, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {puppy.name ? puppy.name : `Puppy ${index + 1}`}
                    </h3>
                    <IconButton
                      size="small"
                      onClick={() => toggleExpandPuppy(index)}
                    >
                      {expandedPuppies.includes(index) ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </div>
                  <Collapse in={expandedPuppies.includes(index)}>
                    <input
                      type="text"
                      placeholder="Name"
                      className="p-2 border border-gray-300 rounded w-full mb-2"
                      value={puppy.name}
                      onChange={(e) => {
                        const updatedPuppies = [...newPuppies.puppies];
                        updatedPuppies[index].name = e.target.value;
                        setNewPuppies({
                          ...newPuppies,
                          puppies: updatedPuppies,
                        });
                      }}
                    />
                    <input
                      type="date"
                      placeholder="Born"
                      className="p-2 border border-gray-300 rounded w-full mb-2"
                      value={puppy.born.toISOString().split("T")[0]}
                      onChange={(e) => {
                        const updatedPuppies = [...newPuppies.puppies];
                        updatedPuppies[index].born = new Date(e.target.value);
                        setNewPuppies({
                          ...newPuppies,
                          puppies: updatedPuppies,
                        });
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={puppy.gender === "Male"}
                          onChange={(e) => {
                            const updatedPuppies = [...newPuppies.puppies];
                            updatedPuppies[index].gender = e.target.checked
                              ? "Male"
                              : "Female";
                            setNewPuppies({
                              ...newPuppies,
                              puppies: updatedPuppies,
                            });
                          }}
                        />
                      }
                      label="Male"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="mb-2"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                    {puppyPreviews[index] && (
                      <div className="flex justify-center mb-4">
                        <img
                          src={puppyPreviews[index]}
                          alt="Preview"
                          className="h-48 w-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      onClick={() => toggleExpandPuppy(index)}
                    >
                      Save
                    </Button>
                  </Collapse>
                </div>
              ))}
              {!expandedPuppies.length && (
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                  onClick={() => {
                    setNewPuppies({
                      ...newPuppies,
                      puppies: [
                        ...newPuppies.puppies,
                        {
                          _id: "",
                          name: "",
                          born: new Date(),
                          gender: "Male",
                          image: null,
                        },
                      ],
                    });
                    setExpandedPuppies([newPuppies.puppies.length]);
                  }}
                >
                  Add Puppy
                </button>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
              >
                {isEditing ? "Save" : "Add Puppies"}
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

export default PuppiesManager;
