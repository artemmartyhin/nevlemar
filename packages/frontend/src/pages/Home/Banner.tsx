import React from "react";
import { ButtonL } from "../../props/ButtonL";
import { Link } from "react-router-dom";

import banner from "../../assets/images/banner.jpg";

export const Banner = () => {
  return (
    <div className="w-full h-[378px] bg-[#00172d] rounded-[20px] overflow-hidden">
      <div className="relative w-[1816px] h-[1455px] top-[-360px] left-[-331px]">
        <div className="absolute w-[978px] h-[908px] top-0 left-[837px]">
          <div className="w-[782px] h-[635px] top-[136px] left-[114px] [background:linear-gradient(180deg,rgb(251.81,238.23,212.99)_6.17%,rgb(251.81,238.23,212.99)_75.14%,rgb(255,230.83,185.94)_100%)] rotate-[25.23deg] absolute rounded-[99px]" />
          <div className="absolute top-[423px] left-[186px] [font-family:'Rosario',sans-serif] font-bold text-primary-colordark-blue text-[52px] tracking-[0] leading-[68px] whitespace-nowrap">
            Dog Show Kyiv 2014
          </div>
          <div className="absolute top-[493px] left-[235px] [font-family:'Rosario',sans-serif] font-bold text-primary-colordark-blue text-[36px] tracking-[0] leading-[54px] whitespace-nowrap">
            Meet our winners
          </div>
          <p className="absolute w-[394px] top-[555px] left-[195px] [font-family:'Rosario',sans-serif] font-body-12px-medium font-[number:var(--body-12px-medium-font-weight)] text-neutral-color80 text-[length:var(--body-12px-medium-font-size)] text-right tracking-[var(--body-12px-medium-letter-spacing)] leading-[var(--body-12px-medium-line-height)] [font-style:var(--body-12px-medium-font-style)]">
            Our Pride and Joy Triumphs at the 2014 Dog Show in Kyiv!
            We're thrilled to announce that our beloved Nevlemar Tornado, has recently clinched a Best of the Best.
            Congratilations!
          </p>
        </div>
        <div className="absolute w-[1067px] h-[1067px] top-[389px] left-0">
          <div className="w-[788px] h-[788px] top-[139px] left-[139px] bg-primary-colordark-blue-80 rotate-[28.25deg] absolute rounded-[99px]" />
          <img
            className="absolute w-[440px] h-[230px] top-[7px] left-[400px] object-cover shadow-2xl rounded-[5px] border-[1px] border-[#f7dba7]"
            alt="Horizontal shot"
            src={banner}
          />
        </div>
        <div className="flex justify-center space-x-4">
          <Link to="/males">
            <ButtonL
              className="!absolute !left-[519px] !top-[670px]"
              iconLeft={false}
              iconOnly={false}
              iconRight={false}
              text="Explore"
              buttonType="default"
              backgroundColor="#f7dba7"
              textColor="#00172d"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
