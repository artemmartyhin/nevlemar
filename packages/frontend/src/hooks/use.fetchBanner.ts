import { useState, useEffect } from "react";
import axios from "axios";

interface BannerData {
  topic: string;
  description: string;
  image: string;
  url: string;
}

export const useFetchBanner = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchBannerData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/banner`);
            setBannerData(response.data);
        } catch (err) {
            setError(err as any);
            console.error("Error fetching banner data:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchBannerData();
}, []);

  return { bannerData, loading, error };
};
