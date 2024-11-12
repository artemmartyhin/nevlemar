import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";

const BannerManager: React.FC = () => {
  const { user } = useAuth();
  const [banner, setBanner] = useState({
    topic: "",
    description: "",
    url: "",
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchBannerData();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchBannerData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND}/banner`);
      const data = response.data;
      setBanner({
        topic: data.topic || "",
        description: data.description || "",
        url: data.url || "",
        image: null,
      });
      if (data.image) {
        setPreviewUrl(`${process.env.REACT_APP_BACKEND}/uploads/${data.image}`);
      }
    } catch (error) {
      console.error("Error fetching banner data:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBanner((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBanner((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("topic", banner.topic);
    formData.append("description", banner.description);
    formData.append("url", banner.url);

    if (banner.image) {
      formData.append("image", banner.image);
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND}/banner`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Banner updated successfully!");
      fetchBannerData();
    } catch (error) {
      console.error("Error updating banner:", error);
    }
  };

  if (user?.role !== "admin") {
    return <p>Sorry. You are not authorized to view this page.</p>;
  }

  return (
    <div className="flex justify-center p-6 bg-gray-100 min-h-screen">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Banner Manager</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField
              label="Topic"
              name="topic"
              value={banner.topic}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Description"
              name="description"
              value={banner.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
            />
          </div>
          <div className="mb-4">
            <TextField
              label="URL"
              name="url"
              value={banner.url}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewUrl && (
              <div className="flex justify-center mt-4">
                <img
                  src={previewUrl}
                  alt="Banner Preview"
                  className="h-48 w-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Save Banner
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BannerManager;
