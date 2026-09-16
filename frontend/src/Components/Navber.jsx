import { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaTimes, FaUserCircle, FaHeart, FaPaperPlane, FaUserEdit, FaChartPie, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../Contex/AuthProvider";
import Avatar from "./Avatar";
import Swal from "sweetalert2";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  const toggleDrawer = () => setIsOpen(!isOpen);

  const { user, biodata, authUser, LogOut } = useContext(AuthContext);

  const handleLinkClick = () => {
    if (isOpen) toggleDrawer();
  };

  const isAdmin = authUser?.role === "admin";

  // Close the profile dropdown when clicking anywhere outside it.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    setIsOpen(false);
    LogOut()
      .then(() => {
        Swal.fire({ title: "Logged out successfully", icon: "success" });
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({ title: error.message, icon: "error" });
      });
  };

  const userMenuItems = [
    { to: "/userDashboard", label: "My Profile", icon: <FaUserCircle /> },
    { to: "/userDashboard/editbio", label: "Edit My Biodata", icon: <FaUserEdit /> },
    { to: "/userDashboard/myContactRequest", label: "Contact Requests", icon: <FaPaperPlane /> },
    { to: "/userDashboard/favourites", label: "Shortlisted Profiles", icon: <FaHeart /> },
  ];

  const adminMenuItems = [
    { to: "/adminDashboard", label: "Admin Dashboard", icon: <FaChartPie /> },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  // Plain nav links — shared between desktop bar and the mobile drawer.
  const primaryLinks = (
    <>
      <NavLink to="/" onClick={handleLinkClick} className="block  py-2 hover:text-maroon">Home</NavLink>
      <NavLink to="/about" onClick={handleLinkClick} className="block  py-2 hover:text-maroon">About Us</NavLink>
      <NavLink to="/biodataspage" onClick={handleLinkClick} className="block  py-2 hover:text-maroon">Find Matches</NavLink>
      <NavLink to="/contact" onClick={handleLinkClick} className="block py-2 hover:text-maroon">Contact</NavLink>
      <NavLink to="/blog" onClick={handleLinkClick} className="block py-2 hover:text-maroon">Success Stories</NavLink>
    </>
  );

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[#FBF6EC] shadow-md fixed  w-full z-50 ">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center poppins  ">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <img src="/logo.png" className="w-44" alt="Logo" />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 md:text-sm lg:text-base items-center text-ink subtitle-font  font-bold">
            {primaryLinks}

            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  className="relative shrink-0"
                  aria-label="Account menu"
                >
                  <Avatar
                    src={biodata?.profileImage || user?.photoURL}
                    className="w-10 h-10 border-2 border-gold cursor-pointer"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#FBF6EC] border border-gold flex items-center justify-center">
                    <FaChevronDown className={`text-[8px] text-maroon transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
                  </span>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#FBF6EC] rounded-xl shadow-xl border border-gold/30 py-2 z-50 poppins font-normal normal-case overflow-hidden">
                    <div className="px-4 py-3 border-b border-gold/20 bg-white/40">
                      <p className="subtitle-font text-maroon font-semibold truncate">{biodata?.name || user?.displayName || "Member"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {isAdmin ? "Administrator" : <>Biodata ID: {biodata?.bioId || "N/A"}</>}
                      </p>
                    </div>
                    <div className="py-1">
                      {menuItems.map(({ to, label, icon }) => (
                        <NavLink
                          key={to}
                          to={to}
                          end={to === "/userDashboard"}
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-gold/15 hover:text-maroon transition-colors"
                        >
                          <span className="text-gold-dark">{icon}</span> {label}
                        </NavLink>
                      ))}
                    </div>
                    <div className="border-t border-gold/20 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-maroon hover:bg-maroon/10 transition-colors"
                      >
                        <FaSignOutAlt /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/loginpage"
                className="bg-maroon hover:bg-maroon-dark text-white px-4 py-2 rounded-3xl mt-2 md:mt-0 text-center"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleDrawer}
              className="text-gray-700 mr-2  text-2xl focus:outline-none"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30  z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={toggleDrawer}
      ></div>

      {/* Drawer panel */}
      <div
        className={`fixed  top-0 right-0 w-64 h-full bg-[#FBF6EC] z-50 shadow-lg transform transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="py-6 px-4 flex justify-between items-center border-b border-gray-200 ">
          <span className="text-lg font-semibold ">
            {
              user ?

                <div className="flex gap-2">
                  <Avatar
                    src={biodata?.profileImage || user?.photoURL}
                    className="w-10 h-10 border-2 border-[#A67C2E]"
                  />
                  <div className="flex flex-col gap-1 primary-color">
                    <h1 className="text-[12px] overflow-hidden">{biodata?.name || user?.displayName}</h1>
                    <h1 className="text-[12px] overflow-hidden uppercase">
                      {isAdmin ? (
                        "admin"
                      ) : (
                        <span>ID NO : {biodata?.bioId || "N/A"}</span>
                      )}
                    </h1>
                  </div>
                </div>

                :

                <h1 className="subtitle-font">Menu</h1>
            }
          </span>
          <button onClick={toggleDrawer} className="text-gray-700  text-xl ">
            <FaTimes color="#7A1F2B" className="mr-2" />
          </button>
        </div>
        <div className="flex flex-col p-4 text-gray-700 subtitle-font font-bold ">

          {primaryLinks}

          {user ? (
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-1">
              {menuItems.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/userDashboard"}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 py-2 text-sm hover:text-maroon"
                >
                  {icon} {label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 py-2 text-sm text-red-600"
              >
                <FaSignOutAlt /> Log Out
              </button>
            </div>
          ) : (
            <Link
              to="/loginpage"
              onClick={handleLinkClick}
              className="bg-maroon hover:bg-maroon-dark text-white px-4 py-2 rounded-3xl mt-4 text-center"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
