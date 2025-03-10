"use client";
import { useEffect } from "react";
import { setPageTitle } from "@/utilities/titleStore";
import Breadcrumb from "./Breadcrumb";

function Page({ title, children, Icon }) {
  useEffect(() => {
    setPageTitle(title);
    return () => setPageTitle("");
  }, [title]);
  
  return (
    <>
      <Breadcrumb Icon={Icon} />
      {children}
    </>
  );
}

export default Page;
