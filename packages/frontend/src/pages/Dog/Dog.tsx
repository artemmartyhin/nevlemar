import React, { useState } from "react";
import useFetchDogs from "../../hooks/use.fetchDogs";
import { ProductCard } from "../../props/ProductCard";
import { ButtonL } from "../../props/ButtonL";

import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

interface Props {
  breed: string;
}

const Dog: React.FC<Props> = (props) => {
  const [gender, setGender] = useState(true);
  const dogs = useFetchDogs(props.breed, gender);
  const navigate = useNavigate();


  return (
    <div>
      <div className="w-full h-[250px] bg-[#00172d] rounded-[20px] overflow-hidden">
        <div className="relative w-[1816px] h-[150px] top-[40px] left-[250px]">
          <div className="w-[782px] h-[635px] top-[10px] left-[500px] [background:linear-gradient(180deg,rgb(251.81,238.23,212.99)_6.17%,rgb(251.81,238.23,212.99)_75.14%,rgb(255,230.83,185.94)_100%)] rotate-[25.23deg] absolute rounded-[99px]" />
          <div className="absolute w-[978px] h-[200px] top-0 left-[200px]">
            <div className="z-10">
              <div className="text-3xl font-semibold text-[#f7dba7] mb-4 [font-family:'Rosario',sans-serif]">
                {props.breed === "pom" ? " Pomeranian Spitz" : "Cvergsnaucer"}
              </div>
              <p className="text-lg text-[#f7dba7] mb-6 [font-family:'Rosario',sans-serif]">
                Take a look at some of our lovely dogs
              </p>
              <div className="mb-8">
                <label
                  htmlFor="breedSelect"
                  className="block text-lg font-medium text-[#f7dba7] mb-2 [font-family:'Rosario',sans-serif]"
                >
                  Gene:
                </label>
                <select
                  id="geneSelect"
                  value={String(gender)}
                  onChange={(e) =>
                    setGender(Boolean(JSON.parse(e.target.value)))
                  }
                  className="mt-1 block w-200 pl-3 pr-10 py-2 text-base [font-family:'Rosario',sans-serif] border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="true">Male</option>
                  <option value="false">Female</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {dogs.map((dog) =>
          !dog.images ? (
            "404"
          ) : (
            <div onClick={() => navigate(`/dog/${dog._id}`)} key={dog._id}>
              <ProductCard
                image={`${process.env.REACT_APP_BACKEND}/uploads/${dog.images[0]}`}
                name={dog.name}
                breed={dog.breed}
                age={String(dog.born)}
                gender={dog.gender}
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

export default Dog;
