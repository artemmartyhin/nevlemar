import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Dog {
    _id: string;
    name: string;
    born: Date;
    breed: string;
    gender: string;
    image: File | null;
    isPuppy: boolean;
}

const useFetchDogs = (breed: string, gender: string): Dog[] => {
    const [dogs, setDogs] = useState([]);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BACKEND}/dogs/adults/${breed}/${gender}`)
            .then((response) => setDogs(response.data))
            .catch((error) => console.error("Error fetching dogs:", error));
    }, [breed, gender]);
    return dogs;
};

const useFetchPuppies = (breed: string): Dog[] => {

    const [puppies, setPuppies] = useState([]);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BACKEND}/dogs/puppies/${breed}`)
            .then((response) => setPuppies(response.data))
            .catch((error) => console.error("Error fetching puppies:", error));
    }, [breed]);

    console.log("puppies", puppies);
    return puppies;
}

export default useFetchDogs;

export { useFetchPuppies };