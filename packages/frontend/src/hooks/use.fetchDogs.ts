import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Dog {
    _id: string;
    name: string;
    age: number;
    breed: string;
    gender: string;
}

const useFetchDogs = (breed: string, gender: string): Dog[] => {
    const [dogs, setDogs] = useState([]);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BACKEND}/dogs/${breed}/${gender}`)
            .then((response) => setDogs(response.data))
            .catch((error) => console.error("Error fetching dogs:", error));
    }, [breed, gender]);

    return dogs;
};

export default useFetchDogs;