import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export const usePageViews = () => {
  const location = useLocation();
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const page_url = window.location.href;
        const page_title = document.title;

        await axios.post(
          "https://dash.npfinsurance.com/api/page-visits/record",
          {
            page_url,
            page_title,
          }
        );

        const { data } = await axios.get(
          `https://dash.npfinsurance.com/api/page-visits?page_url=${page_url}`
        );

        setCount(data.data.total);
        console.log("Page view count:", data);
      } catch (err) {
        console.error("Page view tracking failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViews();
  }, [location.pathname]); // 🔁 runs on every route change

  return { count, isLoading };
};
