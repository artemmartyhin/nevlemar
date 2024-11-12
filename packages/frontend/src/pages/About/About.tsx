import React from "react";
import { ButtonL } from "../../props/ButtonL";
import { Link } from "react-router-dom";

import main from "../../assets/images/main.png";

const About: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative w-full h-[600px] bg-white rounded-[0px_0px_20px_20px] overflow-hidden [background:linear-gradient(180deg,rgb(251.81,238.23,212.99)_6.17%,rgb(251.81,238.23,212.99)_75.14%,rgb(255,230.83,185.94)_100%)]">
        <div className="left-[-91px] absolute w-[1531px] h-[1360px]">
          <div className="top-0 left-0 absolute w-[1531px] h-[1360px]">
            <div className="absolute w-[635px] h-[635px] top-[231px] left-[734px] bg-[#f7dba7] rounded-[99px] rotate-[9.35deg]" />
            <div className="absolute w-[635px] h-[635px] top-[201px] left-[791px] bg-[#00172d] rounded-[99px] rotate-[25.23deg]" />
            <img
              className="absolute w-[800px] h-[1275px] bottom-[320px] left-[1000px]"
              alt="About Nevlemar"
              src={main}
            />
            <div className="absolute top-[108px] left-[221px] [font-family:'Rosario',sans-serif] font-bold text-primary-colordark-blue-80 text-[32px] tracking-[0] leading-[60px] whitespace-nowrap">
              About Us
            </div>
            <p className="absolute w-[480px] top-[180px] left-[221px] [font-family:'Rosario',sans-serif] font-body-18px-medium font-[number:var(--body-18px-medium-font-weight)] text-neutral-color80 text-[18px] tracking-[var(--body-18px-medium-letter-spacing)] leading-[var(--body-18px-medium-line-height)]">
              Welcome to Nevlemar! Our kennel is dedicated to breeding and
              raising dogs with love, care, and a focus on quality and health.
              With over 20 years of experience, we are committed to excellence
              in pedigree, training, and health for all our puppies.
            </p>
            <h3 className="text-2xl font-semibold text-primary-colordark-blue-80 mt-10 [font-family:'Rosario',sans-serif]">
              Follow Us
            </h3>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/nevlemar"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ButtonL
                  style={{ marginLeft: "48px" }}
                  className="!absolute !left-[402px] !top-[358px]"
                  iconLeft={false}
                  iconOnly={false}
                  iconRight={false}
                  text="Facebook"
                  buttonType="default"
                  backgroundColor="#00172d"
                />
              </a>
              <a
                href="https://www.instagram.com/nevlemar"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ButtonL
                  style={{ marginLeft: "48px" }}
                  className="!absolute !left-[150px] !top-[358px]"
                  iconLeft={false}
                  iconOnly={false}
                  iconRight={false}
                  text="Instagram"
                  buttonType="default"
                  backgroundColor="#00172d"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center mt-8">
        <h2 className="text-3xl font-bold text-primary-colordark-blue-80 [font-family:'Rosario',sans-serif]">
          Contact Us
        </h2>
        <p className="text-lg text-neutral-color80 mt-4 [font-family:'Rosario',sans-serif]">
          Feel free to reach out to us with any questions or inquiries!
        </p>

        <div className="flex flex-col mt-6 space-y-4 text-center text-neutral-color80">
          <div>
            <strong>Phone:</strong>{" "}
            <a
              href="tel:+1234567890"
              className="text-primary-colordark-blue-80"
            >
              +38 (050) 175-6050
            </a>
          </div>
          <div>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:contact@nevlemar.com"
              className="text-primary-colordark-blue-80"
            >
              nevlemar@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
