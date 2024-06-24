import React from "react";
import { useParams } from "react-router-dom";
import { Container, Paper, Typography, Box, Button, Grid } from "@mui/material";
import { useFetchDog } from "../../hooks/use.fetchDogs";
import { ButtonL } from "../../props/ButtonL";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

const DogProfile = () => {
  const { id } = useParams();
  const dog = useFetchDog(id || "");

  if (!dog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div
        className="relative w-full h-[600px] bg-white rounded-[0px_0px_20px_20px] overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgb(251, 238, 213) 6.17%, rgb(251, 238, 213) 75.14%, rgb(255, 231, 186) 100%)",
        }}
      >
        <div className="absolute w-[1531px] h-[1360px]">
          <div className="top-0 left-0 absolute w-[1531px] h-[1360px]">
            <div className="absolute w-[635px] h-[635px] top-[231px] left-[734px] bg-[#f7dba7] rounded-[99px] rotate-[9.35deg]" />
            <div className="absolute w-[635px] h-[635px] top-[201px] left-[791px] bg-[#00172d] rounded-[99px] rotate-[25.23deg]" />
            <div className="absolute w-[67px] h-[67px] top-[90px] left-[264px] bg-secondary-colormon-yellow rounded-[20px] rotate-[25.23deg] z-30" />
            <div className="absolute w-[15px] h-[15px] top-[66px] left-[900px] bg-[#f7dba7] rounded-[4px] rotate-[20.79deg] z-30" />
            <div className="absolute w-[27px] h-[27px] top-[120px] left-[873px] bg-[#f7dba7] rounded-[9px] rotate-[-22.85deg] z-30" />
            <div className="absolute w-[21px] h-[21px] top-[129px] left-[872px] bg-[#00172d] rounded-[6px] rotate-[-43.00deg] z-30" />
            <Container
              maxWidth="lg"
              sx={{
                position: "relative",
                zIndex: 10,
                marginTop: "1rem",
                fontFamily: "Rosario",
                marginRight: "2rem",
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  gap: 4,
                  fontFamily: "Rosario",
                }}
              >
                <Box sx={{ flexGrow: 1, position: "relative" }}>
                  <Swiper slidesPerView={1} loop={true}>
                    {dog.images?.map((image, index) => (
                      <SwiperSlide key={index}>
                        <Box
                          component="img"
                          src={`${process.env.REACT_APP_BACKEND}/uploads/${image}`}
                          alt={dog.name}
                          sx={{
                            width: "100%",
                            maxWidth: "500px",
                            maxHeight: "500px",
                            borderRadius: 2,
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>

                <Box sx={{ flexGrow: 2, maxWidth: "500px" }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    color="00172d"
                    sx={{ fontFamily: "Rosario", mb: 2 }}
                  >
                    {dog.name}
                  </Typography>

                  <Grid
                    container
                    spacing={2}
                    sx={{ mb: 2, fontFamily: "Rosario" }}
                  >
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Breed:</strong> {dog.breed}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Gender:</strong>{" "}
                        {dog.gender ? "male" : "female"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Born:</strong>{" "}
                        {new Date(dog.born).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "Rosario", my: 2 }}
                  >
                    <strong>Description:</strong>{" "}
                    {dog.description ||
                      "No description available for this dog."}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <ButtonL
                      iconLeft={false}
                      iconOnly={false}
                      iconRight
                      text="Contact Us"
                      buttonType="default"
                      backgroundColor="#00172d"
                    />
                  </Box>
                </Box>
              </Paper>
            </Container>
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="w-full h-[378px] bg-[#00172d] rounded-[20px] overflow-hidden">
          <div className="relative w-[1816px] h-[1455px] top-[-360px] left-[-331px]">
            <div className="absolute w-[978px] h-[908px] top-0 left-[837px]">
              <div className="w-[635px] h-[635px] top-[128px] left-[204px] [background:linear-gradient(180deg,rgb(251.81,238.23,212.99)_6.17%,rgb(251.81,238.23,212.99)_75.14%,rgb(255,230.83,185.94)_100%)] rotate-[25.23deg] absolute rounded-[99px]" />
            </div>
            <div className="absolute w-[1067px] h-[1067px] top-[389px] left-0">
              <div className="w-[635px] h-[788px] top-[132px] left-[226px] bg-primary-colordark-blue-80 rotate-[28.25deg] absolute rounded-[99px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogProfile;
