import { useEffect } from "react";
import { useRevalidator } from "react-router-dom";

export default function RevalidateOnPageShow() {
  const { revalidate } = useRevalidator();

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        revalidate();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [revalidate]);

  return null;
}
