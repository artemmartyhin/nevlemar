import React, { useState } from "react";
import useFetchPuppies from "../../hooks/use.fetchPuppies"
import { ProductCard } from "../../props/ProductCard";
import { ButtonL } from "../../props/ButtonL";

const Puppies: React.FC = () => {
  const [breed, setBreed] = useState("pom");
  const dogs = useFetchPuppies(breed, "male");

  return (
    <div>
       <div className="w-full h-[250px] bg-[#00172d] rounded-[20px] overflow-hidden">
        <div className="relative w-[1816px] h-[150px] top-[40px] left-[250px]">
          <div className="w-[782px] h-[635px] top-[10px] left-[500px] [background:linear-gradient(180deg,rgb(251.81,238.23,212.99)_6.17%,rgb(251.81,238.23,212.99)_75.14%,rgb(255,230.83,185.94)_100%)] rotate-[25.23deg] absolute rounded-[99px]" />
          <div className="absolute w-[978px] h-[200px] top-0 left-[200px]">
            <div className="z-10">
              <div className="text-3xl font-semibold text-[#f7dba7] mb-4 [font-family:'Rosario',sans-serif]">
                Meet our puppies
              </div>
              <p className="text-lg text-[#f7dba7] mb-6 [font-family:'Rosario',sans-serif]">
                Take a look at our lovely puppies
              </p>
              <div className="mb-8">
                <label
                  htmlFor="breedSelect"
                  className="block text-lg font-medium text-[#f7dba7] mb-2 [font-family:'Rosario',sans-serif]"
                >
                  Breed:
                </label>
                <select
                  id="geneSelect"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="mt-1 block w-200 pl-3 pr-10 py-2 text-base [font-family:'Rosario',sans-serif] border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="pom">Pomeranian</option>
                  <option value="cvergsnaucer">Cvergsnaucer</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Puppies;
