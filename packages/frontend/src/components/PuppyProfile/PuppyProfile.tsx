import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Box, Grid } from "@mui/material";
import { fetchPuppies, Puppies, Puppy } from "../../hooks/use.fetchPuppies";
import { fetchDog, Dog } from "../../hooks/use.fetchDogs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { ProductCard } from "../../props/ProductCard";
import { styled } from "@mui/material/styles";
import { ButtonL } from "../../props/ButtonL";
import { Link } from "react-router-dom";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const StyledSwiper = styled(Swiper)({
  "& .swiper-button-prev, & .swiper-button-next": {
    color: "rgba(128, 128, 128, 0.7)",
    "&::after": {
      fontSize: "24px",
    },
  },
  "& .swiper-button-prev": {
    left: "10px",
  },
  "& .swiper-button-next": {
    right: "10px",
  },
});

const PuppiesProfile: React.FC = () => {
  const { id } = useParams();
  const [puppiesData, setPuppiesData] = useState<Puppies | null>(null);
  const [selectedPuppy, setSelectedPuppy] = useState<Puppy | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [mom, setMom] = useState<Dog | null>(null);
  const [dad, setDad] = useState<Dog | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPuppiesData = async () => {
      if (id) {
        const data = await fetchPuppies(id);
        setPuppiesData(data);
        setMainImage(`${process.env.REACT_APP_BACKEND}/uploads/${data.image}`);
      }
    };

    const fetchParentData = async () => {
      if (puppiesData?.mom) {
        const momData = await fetchDog(puppiesData.mom);
        setMom(momData);
      }
      if (puppiesData?.dad) {
        const dadData = await fetchDog(puppiesData.dad);
        setDad(dadData);
      }
    };

    fetchPuppiesData();
    fetchParentData();
  }, [id, puppiesData?.mom, puppiesData?.dad]);

  const handleSlideChange = (swiper: any) => {
    const currentIndex = swiper.realIndex;
    if (currentIndex === 0) {
      setSelectedPuppy(null);
    } else {
      setSelectedPuppy(puppiesData?.puppies[currentIndex - 1] || null);
    }
  };

  const handlePuppyClick = (puppy: Puppy) => {
    setMainImage(`${process.env.REACT_APP_BACKEND}/uploads/${puppy.image}`);
    setSelectedPuppy(puppy);
    setLightboxImage(`${process.env.REACT_APP_BACKEND}/uploads/${puppy.image}`);
    setIsOpen(true);
  };

  const handleMainImageClick = () => {
    setMainImage(
      `${process.env.REACT_APP_BACKEND}/uploads/${puppiesData?.image}`
    );
    setSelectedPuppy(null);
    setLightboxImage(
      `${process.env.REACT_APP_BACKEND}/uploads/${puppiesData?.image}`
    );
    setIsOpen(true);
  };

  if (!puppiesData) {
    return <div>Loading...</div>;
  }

  const puppyImages = puppiesData.puppies.map(
    (puppy) => `${process.env.REACT_APP_BACKEND}/uploads/${puppy.image}`
  );

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center"
      style={{ height: "100hv" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgb(251, 238, 213) 6.17%, rgb(251, 238, 213) 75.14%, rgb(255, 231, 186) 100%)",
          height: "100%",
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
          flexGrow: 1,
          flexShrink: 0,
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
            <StyledSwiper
              slidesPerView={1}
              loop={true}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination]}
              onSlideChange={handleSlideChange}
            >
              <SwiperSlide>
                <Box
                  component="img"
                  src={mainImage}
                  alt={puppiesData.breed}
                  sx={{
                    width: "100%",
                    maxWidth: "600px", // Increased size
                    maxHeight: "600px", // Increased size
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "block", // Ensure image is treated as a block element
                    margin: "0 auto", // Center the image horizontally
                  }}
                  onClick={handleMainImageClick}
                />
              </SwiperSlide>
              {puppyImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <Box
                    component="img"
                    src={image}
                    alt={`Puppy ${index + 1}`}
                    sx={{
                      width: "100%",
                      maxWidth: "600px", // Increased size
                      maxHeight: "600px", // Increased size
                      borderRadius: 2,
                      cursor: "pointer",
                      display: "block", // Ensure image is treated as a block element
                      margin: "0 auto", // Center the image horizontally
                    }}
                    onClick={() => handlePuppyClick(puppiesData.puppies[index])}
                  />
                </SwiperSlide>
              ))}
            </StyledSwiper>
          </Box>

          <Box sx={{ width: "100%", textAlign: "center" }}>
            {selectedPuppy ? (
              <>
                <Typography
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  sx={{ fontFamily: "Rosario", mb: 2 }}
                >
                  <strong>{selectedPuppy.name}</strong>
                </Typography>
                <Grid
                  container
                  spacing={2}
                  sx={{ mb: 2, fontFamily: "Rosario" }}
                >
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Born:</strong>{" "}
                      {new Date(selectedPuppy.born).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Gender:</strong> {selectedPuppy.gender}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Typography
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  sx={{ fontFamily: "Rosario", mb: 2 }}
                >
                  <strong>{`${dad?.name} X ${mom?.name}`}</strong>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontFamily: "Rosario", mb: 2 }}
                >
                  <strong>Description:</strong> {puppiesData.description}
                </Typography>
              </>
            )}
            <Link
              to="/aboutus"
              style={{ display: "inline-block", marginTop: "20px" }}
            >
              <ButtonL
                iconLeft={false}
                iconOnly={false}
                iconRight
                text="Get In Touch"
                buttonType="outline"
                backgroundColor="#00172d"
                textColor="#00172d"
              />
            </Link>
          </Box>
        </Paper>
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
      </Container>
      <div className="w-full mt-4">
        <div className="w-full h-[378px] bg-[#00172d] rounded-[20px] overflow-hidden">
          <div className="relative w-full h-full z-30">
            <div className="absolute w-[300px] h-[300px] top-[20%] left-[60%] bg-[#f7dba7] rounded-[99px] rotate-[25.23deg]" />
            <div className="absolute w-[400px] h-[400px] top-[40%] left-[70%] bg-primary-colordark-blue-80 rotate-[28.25deg] absolute rounded-[99px]" />
          </div>
        </div>
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={lightboxImage}
          onCloseRequest={() => setIsOpen(false)}
        />
      )}
      <div className="w-full h-[378px] bg-[#00172d] rounded-[20px] overflow-hidden">
        <div className="relative w-[1816px] h-[1455px] top-[-360px] left-[-331px]">
          <div className="absolute w-[978px] h-[908px] top-0 left-[837px]">
            <div className="w-[782px] h-[635px] top-[136px] left-[114px] [background:linear-gradient(180deg,rgb(251.81,238.23,212.99)_6.17%,rgb(251.81,238.23,212.99)_75.14%,rgb(255,230.83,185.94)_100%)] rotate-[25.23deg] absolute rounded-[99px]" />
            <div className="absolute top-[423px] left-[186px] [font-family:'Rosario',sans-serif] font-bold text-primary-colordark-blue text-[52px] tracking-[0] leading-[68px] whitespace-nowrap"></div>
            <div className="absolute top-[493px] left-[235px] [font-family:'Rosario',sans-serif] font-bold text-primary-colordark-blue text-[36px] tracking-[0] leading-[54px] whitespace-nowrap"></div>
            <p className="absolute w-[394px] top-[555px] left-[195px] [font-family:'Rosario',sans-serif] font-body-12px-medium font-[number:var(--body-12px-medium-font-weight)] text-neutral-color80 text-[length:var(--body-12px-medium-font-size)] text-right tracking-[var(--body-12px-medium-letter-spacing)] leading-[var(--body-12px-medium-line-height)] [font-style:var(--body-12px-medium-font-style)]"></p>
          </div>
          <div className="absolute w-[1067px] h-[1067px] top-[389px] left-0">
            <div className="w-[788px] h-[788px] top-[139px] left-[139px] bg-primary-colordark-blue-80 rotate-[28.25deg] absolute rounded-[99px]" />
          </div>
          <div className="flex justify-center space-x-4"></div>
        </div>
      </div>
    </div>
  );
};

export default PuppiesProfile;
