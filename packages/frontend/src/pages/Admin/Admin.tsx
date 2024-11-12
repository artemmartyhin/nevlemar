import React, { useState } from "react";

import DogsManager from "./DogsManager";
import PuppiesManager from "./PuppiesManager";
import BannerManager from "./BannerManager";

const Admin: React.FC = () => {
  const [panel, setPanel] = useState("dogs");
  return (
    <div>
      <div className="w-full h-[200px] bg-[#00172d] rounded-[20px] overflow-hidden">
        <div className="relative w-[1816px] h-[150px] top-[40px] left-[250px]">
          <div className="w-[782px] h-[635px] top-[10px] left-[500px] [background:linear-gradient(180deg,rgb(251.81,238.23,212.99)_6.17%,rgb(251.81,238.23,212.99)_75.14%,rgb(255,230.83,185.94)_100%)] rotate-[25.23deg] absolute rounded-[99px]" />
          <div className="absolute w-[978px] h-[200px] top-0 left-[200px]">
            <div className="z-10">
              <div className="text-3xl font-semibold text-[#f7dba7] mb-4 [font-family:'Rosario',sans-serif]">
                Admin Panel
              </div>
              <div className="mb-8">
                <label
                  htmlFor="breedSelect"
                  className="block text-lg font-medium text-[#f7dba7] mb-2 [font-family:'Rosario',sans-serif]"
                >
                  Managers:
                </label>
                <select
                  id="manageSelect"
                  value={panel}
                  onChange={(e) => setPanel(e.target.value)}
                  className="mt-1 block w-200 pl-3 pr-10 py-2 text-base [font-family:'Rosario',sans-serif] border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="dogs">Dogs Manager</option>
                  <option value="breeds">Puppies Manager</option>
                  <option value="banner">Banner Manager</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        panel === "dogs" && <DogsManager />
      }
      {
        panel === "breeds" && <PuppiesManager />
      }
      {
        panel === "banner" && <BannerManager />
      }
    </div>
  );
};


export default Admin;