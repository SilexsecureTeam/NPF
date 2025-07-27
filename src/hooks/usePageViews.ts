import { useEffect, useRef, useState } from "react";
import axios from "axios";

export const usePageViews = () => {
  const [count, setCount] = useState<number | null>(null);
  const hasTracked = useRef(false); // 💡 Prevent double execution

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const fetchViews = async () => {
      try {
        await axios.post(
          "https://site-visitors-tracker.onrender.com/api/track-visit",
          {},
          { withCredentials: true }
        );

        const res = await axios.get(
          "https://site-visitors-tracker.onrender.com/api/today-visits",
          {
            withCredentials: true,
          }
        );

        setCount(res.data.count);
      } catch (err) {
        console.error("Page view tracking failed", err);
      }
    };

    fetchViews();
  }, []);

  return count;
};
