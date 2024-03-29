import { useState, useEffect } from "react";
import axios from "axios";

export interface Dog {
  _id: string;
  name: string;
  born: Date;
  breed: string;
  gender: boolean;
  images: File[] | null;
}

interface DogOptions {
  breed: string;
  gender: boolean;
}


const useFetchDogs = (breed: string, gender: boolean): Dog[] => {
  const [dogs, setDogs] = useState([]);

  const data: DogOptions = {
    breed,
    gender,
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND}/dogs/find`, data)
      .then((response) => setDogs(response.data))
      .catch((error) => console.error("Error fetching dogs:", error));
  }, [breed, gender]);
  return dogs;
};


export default useFetchDogs;

