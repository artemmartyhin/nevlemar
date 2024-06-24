import { useState, useEffect } from "react";
import axios from "axios";

export interface Dog {
  _id: string;
  name: string;
  born: Date;
  breed: string;
  gender: boolean;
  description: string;
  mom: string;
  dad: string;
  images: File[] | null;
}

interface DogOptions {
  breed: string;
  gender: boolean;
}

const useFetchDog = (id: string): Dog | null => {
  const [dog, setDog] = useState<Dog | null>(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}/dogs/${id}`)
      .then((response) => setDog(response.data))
      .catch((error) => console.error("Error fetching dog:", error));
  }, [id]);
  return dog;
};

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

const fetchDog = async (id: string): Promise<Dog> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND}/dogs/${id}`
  );
  return response.data;
};

export default useFetchDogs;
export { fetchDog };
export { useFetchDog };
