import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDog } from "../../hooks/use.fetchDogs";
import { ProductCard } from "../../props/ProductCard";
import { ButtonL } from "../../props/ButtonL";
import useFetchPuppies from "../../hooks/use.fetchPuppies";

const Puppy: React.FC = () => {
  const [breed, setBreed] = useState("pom");
  const puppies = useFetchPuppies(breed);
  const navigate = useNavigate();

  return (
    <div>
      <div className="w-full h-[250px] bg-[#00172d] rounded-[20px] overflow-hidden">
        <div className="relative w-[1816px] h-[150px] top-[40px] left-[250px]">
          <div className="w-[782px] h-[635px] top-[10px] left-[500px] [background:linear-gradient(180deg,rgb(251.81,238.23,212.99)_6.17%,rgb(251.81,238.23,212.99)_75.14%,rgb(255,230.83,185.94)_100%)] rotate-[25.23deg] absolute rounded-[99px]" />
          <div className="absolute w-[978px] h-[200px] top-0 left-[200px]">
            <div className="z-10">
              <p className="text-lg text-[#f7dba7] mb-6 [font-family:'Rosario',sans-serif]">
                Take a look at some of our lovely puppies
              </p>
              <div className="mb-8">
                <label
                  htmlFor="breedSelect"
                  className="block text-lg font-medium text-[#f7dba7] mb-2 [font-family:'Rosario',sans-serif]"
                >
                  Breed:
                </label>
                <select
                  id="breedSelect"
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {puppies.map((puppy) =>
          !puppy.image ? (
            "404"
          ) : (
            <div
              onClick={() => navigate(`/pups/${puppy._id}`)}
              key={puppy._id}
            >
              <ProductCard
                image={`${process.env.REACT_APP_BACKEND}/uploads/${puppy.image}`}
                name={" "}
                sx= {{height: "300px"}}
              />
            </div>
          )
        )}
      </div>
      <div className="flex justify-center mt-10">
        <ButtonL
          iconLeft={false}
          iconOnly={false}
          iconRight
          text="View more"
          buttonType="outline"
          textColor="#00172d"
        />
      </div>
    </div>
  );
};

export default Puppy;
