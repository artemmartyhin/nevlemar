import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/images/logo.png";
import eng from "../../assets/images/eng.png";
import drop from "../../assets/images/drop.png";
import { ButtonL } from "../../props/ButtonL";

import axios from "axios";

const Header = () => {
  const { user, login } = useAuth();

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/profile", {
        withCredentials: true,
      });

      if (response.status === 200 && response.headers["content-type"]) {
        if (response.headers["content-type"].includes("application/json")) {
          const userData = response.data;
          login(userData);
        }
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUserData();
    }
  }, [user]);

  const handleLogin = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };

  return (
    <div className="justify-center items-center flex flex-col px-16 py-2 max-md:px-5">
      <div className="flex items-center justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
        <div className="items-stretch flex justify-between gap-5 my-auto max-md:max-w-full max-md:flex-wrap">
          <img
            loading="lazy"
            src={logo}
            className="mb-3 mr-10 aspect-[4] object-contain object-center w-[225px] overflow-hidden shrink-0 max-w-full"
          />
          <div className="items-stretch self-center flex justify-between gap-6 my-auto [font-family:'Rosario',sans-serif]">
            <div className="text-sky-950 text-lg font-bold leading-10">
              <Link to="/">Home</Link>
            </div>
            <div className="text-sky-950 text-lg font-bold leading-10">
              <Link to="/poms">Pomeranian</Link>
            </div>
            <div className="text-sky-950 text-lg font-bold leading-10">
              <Link to="/cvergs">Cvergsnaucer</Link>
            </div>
            <div className="text-sky-950 text-lg font-bold leading-10">
              <Link to="/puppies">Puppies</Link>
            </div>
            <div className="text-sky-950 text-lg font-bold leading-10">
              <Link to="/aboutus">About us</Link>
            </div>
            {user?.role == "admin" ? (
              <div className="text-sky-950 text-lg font-bold leading-10">
                <Link to="/admin">Admin</Link>
              </div>
            ) : null}
          </div>
        </div>
        <div className="items-stretch self-stretch flex gap-3.5 max-md:max-w-full max-md:flex-wrap">
          <div className="items-stretch bg-white flex justify-between gap-3 px-4 py-3 rounded-[46px] max-md:pr-5"></div>

          <div className="justify-between flex gap-1 px-2 py-2.5 items-start">
            <div className="flex mt-1 gap-1.5 items-start">

              <img
                loading="lazy"
                src={eng}
                className="aspect-square mt-2 object-contain object-center w-[21px] justify-center items-center overflow-hidden shrink-0 max-w-full"
              />
              <div className="text-sky-950 text-lg font-medium leading-10 self-stretch [font-family:'Rosario',sans-serif]">
                ENG
              </div>
            </div>
            <img
              loading="lazy"
              src={drop}
              className="aspect-square object-contain object-center w-6 overflow-hidden self-stretch shrink-0 max-w-full"
            />
          </div>
        </div>
          <div className="flex gap-1.5 items-start">
              {user ? (
                <div className="text-sky-950 text-lg font-bold leading-10 [font-family:'Rosario',sans-serif]">
                  <span>Welcome, {user.firstName}! </span>
                </div>
              ) : (
                <ButtonL
                  iconLeft={false}
                  iconOnly={true}
                  iconRight={false}
                  text="Login"
                  buttonType="default"
                  onClick={handleLogin}
                  backgroundColor="#00172d"
                />
              )}
        </div>
      </div>
    </div>
  );
};

export default Header;
