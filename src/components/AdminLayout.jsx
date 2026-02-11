import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Ensure the path is correct

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#FDFCFB]">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Content Area: ml-[250px] matches your sidebar width */}
      <main className="flex-1 ml-[280px] min-h-screen p-8 lg:p-12">
   <Outlet />
</main>
    </div>
  );
};

export default AdminLayout;