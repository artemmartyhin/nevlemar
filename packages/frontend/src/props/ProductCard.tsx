import React from "react";

import { ButtonL } from "../props/ButtonL";

interface ProductCardProps {
  name: string;
  breed: string;
  gender: boolean;
  age: string;
  className?: string;
  image?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  className,
  image,
}) => {
  return (
    <div
      className={`shadow-md rounded-lg bg-white relative m-2 ${className}`}
      style={{ width: "264px" }}
    >
      <div className="w-full h-[300px] overflow-hidden rounded-t-lg bg-white">
        <img
          className="object-contain h-full w-full rounded-[10px]"
          alt={name}
          src={image}
        />
      </div>
      <div className="text-center">
        <br />
        <div className="mt-1 [font-family:'Rosario',sans-serif] text-lg font-bold text-gray-900">
          {name}
        </div>
        <br />
      </div>
    </div>
  );
};
