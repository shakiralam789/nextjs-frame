"use client";
import { useEffect } from "react";
import { setPageTitle } from "@/utilities/titleStore";
import Breadcrumb from "./Breadcrumb";

function Page({ title, children }) {
  useEffect(() => {
    setPageTitle(title);
    return () => setPageTitle("");
  }, [title]);

  return (
    <>
      <Breadcrumb />
      {children}
    </>
  );
}

export default Page;
