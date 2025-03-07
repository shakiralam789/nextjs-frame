"use client";
import { useEffect } from "react";
import { setPageTitle } from "@/utilities/titleStore";

function Page({ title, children }) {
  useEffect(() => {
    setPageTitle(title);
    return () => setPageTitle("");
  }, [title]);
  
  return <>{children}</>;
}

export default Page;