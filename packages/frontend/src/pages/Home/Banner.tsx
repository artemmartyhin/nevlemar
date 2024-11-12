import React from "react";
import { ButtonL } from "../../props/ButtonL";
import { Link } from "react-router-dom";
import { useFetchBanner } from "../../hooks/use.fetchBanner";

export const Banner = () => {
  const { bannerData, loading, error } = useFetchBanner();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading banner data</p>;

  return (
    <div className="w-full h-[378px] bg-[#00172d] rounded-[20px] overflow-hidden">
      <div className="relative w-[1816px] h-[1455px] top-[-360px] left-[-331px]">
        <div className="absolute w-[978px] h-[908px] top-0 left-[837px]">
          <div className="w-[782px] h-[635px] top-[136px] left-[114px] [background:linear-gradient(180deg,rgb(251,238,213)_6.17%,rgb(251,238,213)_75.14%,rgb(255,231,186)_100%)] rotate-[25.23deg] absolute rounded-[99px]" />

          {/* Title and Description Container */}
          <div className="absolute top-[400px] left-[200px] w-[500px] flex flex-col space-y-4">
            <div className="[font-family:'Rosario',sans-serif] font-bold text-primary-colordark-blue text-[48px] leading-[60px]">
              {bannerData?.topic}
            </div>
            <p className="[font-family:'Rosario',sans-serif] font-body-12px-medium font-[number:var(--body-12px-medium-font-weight)] text-neutral-color80 text-[16px] leading-[24px] text-right">
              {bannerData?.description}
            </p>
          </div>
        </div>

        <div className="absolute w-[1067px] h-[1067px] top-[389px] left-0">
          <div className="w-[788px] h-[788px] top-[139px] left-[139px] bg-primary-colordark-blue-80 rotate-[28.25deg] absolute rounded-[99px]" />
          <img
            className="absolute w-[440px] h-[230px] top-[7px] left-[400px] object-cover shadow-2xl rounded-[5px] border-[1px] border-[#f7dba7]"
            alt="Banner"
            src={`${process.env.REACT_APP_BACKEND}/uploads/${bannerData?.image}`}
          />
        </div>

        <div className="flex justify-center space-x-4">
          <Link to={bannerData?.url || ""}>
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
