"use client";
import React, { useState } from "react";
import Header from "./partial/Header";
import SidebarMenu from "./partial/SidebarMenu/SidebarMenu";

const sidebarMenu = [
  { title: "Dashboard", icon: "dashboard", link: "/dashboard" },
  { 
    title: "Users", 
    icon: "users",
    link: "/users",
  },
  { title: "Mail", icon: "mail", link: "/mail" },
  {
    title: "Project",
    icon: "document",
    children: [
      { title: "Project List", link: "/projects/list" },
      { title: "Add Project", link: "/projects/add" }
    ]
  },
  { title: "Time", icon: "clock", link: "/time" },
  { title: "Forms", icon: "form", link: "/forms" },
  { title: "Settings", icon: "settings", link: "/settings" },
  { title: "Components", icon: "components", link: "/components" }
];

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div className="flex h-screen bg-gray-light">
      <SidebarMenu 
        menuItems={sidebarMenu} 
        isCollapsed={isCollapsed} 
        toggleCollapse={toggleCollapse} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 2xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
