// src/pages/Home/Home.tsx
import React from "react";
import { ButtonL } from "../../props/ButtonL";
import { Link } from "react-router-dom";
import { Banner } from "./Banner";

import main from "../../assets/images/main.png";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative w-full h-[600px] bg-white rounded-[0px_0px_20px_20px] overflow-hidden [background:linear-gradient(180deg,rgb(251.81,238.23,212.99)_6.17%,rgb(251.81,238.23,212.99)_75.14%,rgb(255,230.83,185.94)_100%)]">
        <div className="left-[-91px] absolute w-[1531px] h-[1360px]">
          <div className="top-0 left-0 absolute w-[1531px] h-[1360px]">
            <div className="absolute w-[635px] h-[635px] top-[231px] left-[734px] bg-[#f7dba7] rounded-[99px] rotate-[9.35deg]" />
            <div className="absolute w-[635px] h-[635px] top-[201px] left-[791px] bg-[#00172d] rounded-[99px] rotate-[25.23deg]" />
            <div className="absolute w-[67px] h-[67px] top-[90px] left-[214px] bg-secondary-colormon-yellow rounded-[20px] rotate-[25.23deg]" />
            <div className="absolute w-[15px] h-[15px] top-[66px] left-[850px] bg-[#f7dba7] rounded-[4px] rotate-[20.79deg]" />
            <div className="absolute w-[27px] h-[27px] top-[120px] left-[823px] bg-[#f7dba7] rounded-[9px] rotate-[-22.85deg]" />
            <div className="absolute w-[21px] h-[21px] top-[129px] left-[822px] bg-[#00172d] rounded-[6px] rotate-[-43.00deg]" />
            <img
              className="absolute w-[800px] h-[1275px] bottom-[320px] left-[1000px]"
              alt="Good humored woman"
              src={main}
            />
            <div className="absolute top-[108px] left-[221px] [font-family:'Rosario',sans-serif] font-bold text-primary-colordark-blue-80 text-[32px] tracking-[0] leading-[60px] whitespace-nowrap">
              kennel
            </div>
            <div className="absolute top-[167px] left-[221px] [font-family:'Rosario',sans-serif] font-bold text-primary-colordark-blue-80 text-[60px] tracking-[0] leading-[68px] whitespace-nowrap">
              Nevlemar
            </div>
            <p className="absolute w-[480px] top-[251px] left-[221px] [font-family:'Rosario',sans-serif]  font-body-16px-medium font-[number:var(--body-16px-medium-font-weight)] text-neutral-color80 text-[length:var(--body-16px-medium-font-size)] tracking-[var(--body-16px-medium-letter-spacing)] leading-[var(--body-16px-medium-line-height)] [font-style:var(--body-16px-medium-font-style)]">
              Over 20 years of breeding and treating dogs with love and care.
              Our commitment to health, training, and pedigree excellence shines
              through in every puppy, and our track record in dog competitions
              speaks to our passion and expertise.
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Link to="https://www.facebook.com/lemar.cat">
              <ButtonL
                style={{ marginLeft: "48px" }}
                className="!absolute !left-[402px] !top-[358px]"
                iconLeft={false}
                iconOnly={false}
                iconRight={false}
                text="Get In Touch"
                buttonType="default"
                backgroundColor="#00172d"
              />
            </Link>
            <Link to="/puppies">
              <ButtonL
                className="!absolute !left-[221px] !top-[358px]"
                iconLeft={false}
                iconOnly={false}
                iconRight
                text="Our Puppies"
                buttonType="outline"
                backgroundColor="#00172d"
                textColor="#00172d"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <Banner />
      </div>
    </div>
  );
};

export default Home;
