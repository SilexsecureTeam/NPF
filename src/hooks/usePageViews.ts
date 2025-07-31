import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const VIEW_EXPIRY_HOURS = 12; // Only count one view every 12 hours per page

export const usePageViews = () => {
  const location = useLocation();
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const fetchViews = async () => {
      const pathname = window.location.pathname;
      const page_title = document.title;
      const storageKey = `page_viewed_${pathname}`;
      const now = Date.now();

      const lastView = localStorage.getItem(storageKey);
      const lastViewTime = lastView ? parseInt(lastView, 10) : 0;

      const hasExpired =
        now - lastViewTime > VIEW_EXPIRY_HOURS * 60 * 60 * 1000;

      try {
        if (hasExpired) {
          await axios.post(
            "https://dash.npfinsurance.com/api/page-visits/record",
            {
              page_url: pathname,
              page_title,
            }
          );

          localStorage.setItem(storageKey, now.toString());
        }

        const { data } = await axios.get(
          `https://dash.npfinsurance.com/api/page-visits?page_url=${pathname}`
        );

        setCount(data.data.total);
      } catch (err) {
        console.error("Page view tracking failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViews();
  }, [location.pathname]);

  return { count, isLoading };
};
