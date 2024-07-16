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
  description: string;
  breed: string;
  image: File | null;
}

interface PuppyOptions {
  breed: string;
  gender?: string;
}

const useFetchPuppies = (breed: string, gender?: string): Puppy[] => {
  const [puppies, setPuppies] = useState<Puppy[]>([]);

  useEffect(() => {
    const data: PuppyOptions = { breed };
    if (gender) {
      data.gender = gender;
    }
    axios
      .post(`${process.env.REACT_APP_BACKEND}/puppies/find`, data)
      .then((response) => setPuppies(response.data))
      .catch((error) => console.error("Error fetching puppies:", error));
  }, [breed, gender]);

  return puppies;
};

const fetchPuppies = async (id: string): Promise<Puppies> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND}/puppies/${id}`
  );
  return response.data;
};

export default useFetchPuppies;
export { fetchPuppies };
