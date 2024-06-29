import { useState, useEffect } from "react";
import axios from "axios";

export interface Puppy {
  _id: string;
  name: string;
  born: Date;
  gender: string;
  image: File | null;
}

export interface Puppies {
  _id: string;
  puppies: Puppy[];
  mom: string;
  dad: string;
  breed: string;
  image: File | null;
}

interface PuppyOptions {
  breed: string;
  gender: string;
}

const useFetchPuppy = (id: string): Puppy | null => {
  const [puppy, setPuppy] = useState<Puppy | null>(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}/puppies/${id}`)
      .then((response) => setPuppy(response.data))
      .catch((error) => console.error("Error fetching puppy:", error));
  }, [id]);

  return puppy;
};

const useFetchPuppies = (breed: string, gender: string): Puppies[] => {
  const [puppies, setPuppies] = useState<Puppies[]>([]);

  const data: PuppyOptions = {
    breed,
    gender,
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND}/puppies/find`, data)
      .then((response) => setPuppies(response.data))
      .catch((error) => console.error("Error fetching puppies:", error));
  }, [breed, gender]);

  return puppies;
};

const fetchPuppy = async (id: string): Promise<Puppy> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND}/puppies/${id}`
  );
  return response.data;
};

export default useFetchPuppies;
export { fetchPuppy };
export { useFetchPuppy };