import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Box, Grid } from "@mui/material";
import { useFetchDog, fetchDog, Dog } from "../../hooks/use.fetchDogs";
import { ProductCard } from "../../props/ProductCard";
import Lightbox from "react-image-lightbox";
import 'react-image-lightbox/style.css';

const DogProfile: React.FC = () => {
  const { id } = useParams();
  const dog = useFetchDog(id || "");
  const [mom, setMom] = useState<Dog | null>(null);
  const [dad, setDad] = useState<Dog | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParents = async () => {
      if (dog?.mom) {
        const momData = await fetchDog(dog.mom);
        setMom(momData);
      } else {
        setMom(null);
      }

      if (dog?.dad) {
        const dadData = await fetchDog(dog.dad);
        setDad(dadData);
      } else {
        setDad(null);
      }
    };

    if (dog) {
      fetchParents();
    }
  }, [dog]);

  useEffect(() => {
    setMom(null);
    setDad(null);
  }, [id]);

  if (!dog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgb(251, 238, 213) 6.17%, rgb(251, 238, 213) 75.14%, rgb(255, 231, 186) 100%)",
        }}
      >
        <div className="top-0 left-0 absolute w-[1531px] h-[1360px]">
          <div className="absolute w-[635px] h-[735px] top-[231px] left-[734px] bg-[#f7dba7] rounded-[99px] rotate-[9.35deg]" />
          <div className="absolute w-[635px] h-[735px] top-[201px] left-[791px] bg-[#00172d] rounded-[99px] rotate-[25.23deg]" />
          <div className="absolute w-[67px] h-[67px] top-[90px] left-[1068px] bg-secondary-colormon-yellow rounded-[20px] rotate-[25.23deg] z-30" />
          <div className="absolute w-[15px] h-[15px] top-[66px] left-[1084px] bg-[#f7dba7] rounded-[4px] rotate-[20.79deg] z-30" />
          <div className="absolute w-[27px] h-[27px] top-[120px] left-[1091px] bg-[#f7dba7] rounded-[9px] rotate-[-22.85deg] z-30" />
          <div className="absolute w-[21px] h-[21px] top-[129px] left-[1090px] bg-[#00172d] rounded-[6px] rotate-[-43.00deg] z-30" />
        </div>
      </div>

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 10,
          marginTop: "1rem",
          fontFamily: "Rosario",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            fontFamily: "Rosario",
            flexGrow: 1,
            maxWidth: "75%", // Adjusted width
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.99)",
          }}
        >
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Box
              component="img"
              src={`${process.env.REACT_APP_BACKEND}/uploads/${dog.images?.[0]}`}
              alt={dog.name}
              sx={{
                width: "100%",
                maxWidth: "600px", // Increased size
                maxHeight: "600px", // Increased size
                borderRadius: 2,
                display: "block", // Ensure image is treated as a block element
                margin: "0 auto", // Center the image horizontally
                cursor: "pointer", // Add cursor pointer
              }}
              onClick={() => setIsOpen(true)} // Open lightbox on click
            />
          </Box>

          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Typography
              variant="h5"
              component="h2"
              color="textPrimary"
              sx={{ fontFamily: "Rosario", mb: 2 }}
            >
              <strong>{dog.name}</strong>
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2, fontFamily: "Rosario" }}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Breed:</strong> {dog.breed}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Gender:</strong> {dog.gender ? "Male" : "Female"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Born:</strong>{" "}
                  {new Date(dog.born).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="body1" sx={{ fontFamily: "Rosario", my: 2 }}>
              <strong>Description:</strong>{" "}
              {dog.description || "No description available for this dog."}
            </Typography>
          </Box>
        </Paper>

        {(mom || dad) && (
          <Paper
            elevation={6}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              fontFamily: "Rosario",
              flexGrow: 1,
              maxWidth: "70%", // Adjusted width
              textAlign: "center",
              marginBottom: "20px", // Adjusted bottom margin
              height: "800px", // Fixed height
              backgroundColor: "rgba(255, 255, 255, 0.99)",
            }}
          >
            <Box
              sx={{
                width: "100%", // Full width for mobile
                display: "flex",
                flexDirection: "column", // Stack cards vertically
                alignItems: "center", // Center items horizontally
              }}
            >
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  sx={{ fontFamily: "Rosario", mb: 2 }} // Added margin bottom to typography
                >
                  <strong>Parents</strong>
                </Typography>
              </Grid>

              {mom && (
                <div
                  onClick={() => navigate(`/dog/${mom._id}`)}
                  style={{ marginBottom: "10px", width: "100%" }}
                >
                  <ProductCard
                    image={`${process.env.REACT_APP_BACKEND}/uploads/${mom.images?.[0]}`}
                    name={`Mom: ${mom.name}`}
                    breed={mom.breed}
                    age={String(mom.born)}
                    gender={mom.gender}
                    sx={{
                      height: "150px",
                      width: "90%",
                      objectFit: "cover",
                      marginBottom: "200px", // Adjusted margin bottom
                      transform: "scale(0.8)", // Adjusted size
                    }}
                  />
                </div>
              )}

              {dad && (
                <div
                  onClick={() => navigate(`/dog/${dad._id}`)}
                  style={{ marginBottom: "20px", width: "100%" }}
                >
                  <ProductCard
                    image={`${process.env.REACT_APP_BACKEND}/uploads/${dad.images?.[0]}`}
                    name={`Dad: ${dad.name}`}
                    breed={dad.breed}
                    age={String(dad.born)}
                    gender={dad.gender}
                    sx={{
                      height: "150px",
                      width: "90%",
                      objectFit: "cover",
                      transform: "scale(0.8)", // Adjusted size
                    }}
                  />
                </div>
              )}
            </Box>
          </Paper>
        )}
      </Container>
      <div className="w-full mt-4">
        <div className="w-full h-[378px] bg-[#00172d] rounded-[20px] overflow-hidden z-30">
          <div className="relative w-full h-full z-30">
            <div className="absolute w-[300px] h-[300px] top-[20%] left-[60%] bg-[#f7dba7] rounded-[99px] rotate-[25.23deg] z-30" />
            <div className="absolute w-[400px] h-[400px] top-[40%] left-[70%] bg-primary-colordark-blue-80 rotate-[28.25deg] absolute rounded-[99px] z-30" />
          </div>
        </div>
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={`${process.env.REACT_APP_BACKEND}/uploads/${dog.images?.[0]}`}
          onCloseRequest={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DogProfile;
