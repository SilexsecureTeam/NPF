import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://site-visitors-tracker.onrender.com", {
  withCredentials: true,
});

export const usePageViews = () => {
  const [count, setCount] = useState<number | null>(null);
  const hasTracked = useRef(false);

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
          { withCredentials: true }
        );

        setCount(res.data.count);
      } catch (err) {
        console.error("Page view tracking failed", err);
      }
    };

    fetchViews();

    // Listen to real-time updates
    socket.on("visit_update", (data) => {
      setCount(data.count);
    });

    return () => {
      socket.off("visit_update");
    };
  }, []);

  return count;
};
