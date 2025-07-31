import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://site-visitors-tracker.onrender.com", {
  withCredentials: true,
});

export const usePageViews = () => {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const fetchViews = async () => {
      try {
        await axios.post(
          "https://dash.npfinsurance.com/api/page-visits/record",
          {
            page_url: window.location.href,
            page_title: document.title,
          },
          { withCredentials: true }
        );

        const res = await axios.get(
          `https://dash.npfinsurance.com/api/page-visits?page_url=${window.location.href}`,
          { withCredentials: true }
        );

        setCount(res.data.count);
      } catch (err) {
        console.error("Page view tracking failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViews();

    // socket.on("visit_update", (data) => {
    //   setCount(data.count);
    // });

    // return () => {
    //   socket.off("visit_update");
    // };
  }, []);

  return { count, isLoading };
};
