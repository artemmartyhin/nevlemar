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
}

const useFetchPuppies = (breed: string): Dog[] => {
  const [puppy, setPuppies] = useState([]);

  const data: DogOptions = {
    breed
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND}/puppies/find`, data)
      .then((response) => setPuppies(response.data))
      .catch((error) => console.error("Error fetching dogs:", error));
  }, [breed]);
  return puppy;
};

export default useFetchPuppies;
