import React, { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  FaBars,
  FaTimes,
  FaUserEdit,
  FaEye,
  FaHeart,
  FaPaperPlane,
  FaDoorOpen,
  FaChevronRight,
} from "react-icons/fa";
import { AuthContext } from "../Contex/AuthProvider";
import Avatar from "../Components/Avatar";
import Swal from "sweetalert2";


const UserDashboardLayout = () => {

  const { user ,  LogOut  , biodata } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const links = [
    { to: "/userDashboard", label: "My Profile", icon: <FaEye /> },
    { to: "/userDashboard/editbio", label: "Edit My Biodata", icon: <FaUserEdit /> },
    { to: "/userDashboard/myContactRequest", label: "Contact Requests", icon: <FaPaperPlane /> },
    { to: "/userDashboard/favourites", label: "Shortlisted Profiles", icon: <FaHeart /> },
  ];

  const HandalLogOut =() =>{
    LogOut()
      .then(() => {
        Swal.fire({
          title: "Logout Successfully",
          icon: "success",
        });
      
      })
      .catch((error) => {
        Swal.fire({
          title: error.message,
          icon: "error",
        });
      });
  };

  return (
    <div className="bg-[#FBF6EC]">
      <div className="min-h-screen  flex flex-col md:flex-row relative">

        {/* Desktop Sidebar */}
        <aside className="hidden bg-[#FBF6EC] md:flex md:flex-col  w-60 lg:w-72  p-4 shadow-md">
          <h2 className="text-xl font-bold mb-8 mt-3 text-maroon subtitle-font text-center">
            User Dashboard
          </h2>
          <nav className="flex flex-col space-y-4 font-semibold">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/userDashboard"} 
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-black poppins hover:bg-gold/20 px-3 py-2 rounded ${
                    isActive ? "bg-gold/30 text-maroon-dark font-semibold" : ""
                  }`
                }
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}
            <button
              className="mt-10 text-black hover:underline flex items-center"
             onClick={HandalLogOut}
            >
              <FaDoorOpen className="mr-2" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Mobile Navbar */}
        <div className="flex md:hidden items-center justify-between bg-cream p-4 shadow-md">
          <h2 className="text-xl font-bold text-maroon subtitle-font">User Dashboard</h2>
          <button onClick={toggleDrawer} className="text-2xl text-gold-dark">
            {drawerOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/40">
            <div
              className="absolute top-0 right-0 w-64 h-full bg-cream p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-4">
                <button onClick={toggleDrawer} className="text-2xl text-gold-dark">
                  <FaTimes />
                </button>
              </div>
              <nav className="flex flex-col space-y-4 font-semibold text-gold-dark">
                {links.map(({ to, label, icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/userDashboard"}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-black hover:bg-gold/20 px-3 py-2 rounded ${
                        isActive ? "bg-gold/30 text-maroon-dark font-semibold" : ""
                      }`
                    }
                  >
                    {icon}
                    <span>{label}</span>
                  </NavLink>
                ))}
                <button
                  className="mt-10 text-black hover:underline flex items-center"
                  onClick={HandalLogOut}
                >
                  <FaDoorOpen className="mr-2" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1  p-3 items-center bg-white">
          <div className="flex justify-between items-center border-b-2 pb-4 lg:mx-10 border-gray-200">
            <div className="flex gap-1.5 md:gap-3 lg:gap-10 *:hover:text-gold-dark">
              <NavLink to="/" className="">Home </NavLink>
              <FaChevronRight className="mt-2" />
              <NavLink to="/about">About</NavLink>
              <FaChevronRight className="mt-2" />
              <NavLink to="/contact">Contact</NavLink>
            </div>
            <Avatar src={biodata?.profileImage || user?.photoURL} className="w-10 h-10 border-2 border-gold" />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
