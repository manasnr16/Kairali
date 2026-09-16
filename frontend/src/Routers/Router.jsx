import { createBrowserRouter, Navigate, Outlet } from "react-router";
import MainLayout from "../MainLayout/MainLayout";
import HomePage from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import BiodatasPage from "../Pages/BiodatasPage/BiodatasPage";

// Layouts
import UserDashboardLayout from "../MainLayout/UserDashboardLayout";
import AdminDashboardLayout from "../MainLayout/AdminDashboardLayout";

// User Pages
import MyFavourites from "../Pages/DashBoard/User/MyFavourites";
import EditBiodata from "../Pages/DashBoard/User/EditBiodata";
import ViewBiodata from "../Pages/DashBoard/User/ViewBiodata";
import MyContactRequest from "../Pages/DashBoard/User/MyContactRequest";
import GotMarried from "../Pages/DashBoard/User/GotMarried";

// Admin Pages
import AdminDashboardHome from "../Pages/DashBoard/Admin/AdminDashboardHome";
import ManageUsers from "../Pages/DashBoard/Admin/ManageUsers";
import ApprovedPremium from "../Pages/DashBoard/Admin/ApprovedPremium";
import ApprovedContactRequest from "../Pages/DashBoard/Admin/ApprovedContactRequest";


// Route Guards (Assuming you'll implement them)
import PrivateRoute from "./PrivateRoute";
import SuccessStories from "../Pages/DashBoard/Admin/SuccessStories";
import BiodataDetails from "../Components/BiodataDetails";
import CheckoutPage from "../Pages/CheckoutPage";
import PrivateAdmin from "./PrivateAdmin";
import Contact from "../Pages/Contact";
import AboutPage from "../Pages/AboutPage";
import SuccessStoryBlog from "../Components/SuccessStoryBlog";
import SuccessStoryDetails from "../Components/SuccessStoryDetails";

// /admin control panel (separate username/password auth, not Firebase)
import { AdminAuthProvider } from "../Contex/AdminAuthContext";
import AdminPrivateRoute from "./AdminPrivateRoute";
import AdminLoginPage from "../Pages/AdminPanel/AdminLoginPage";
import AdminPanelLayout from "../Pages/AdminPanel/AdminPanelLayout";
import AdminStatsPage from "../Pages/AdminPanel/AdminStatsPage";
import AdminProfilesPage from "../Pages/AdminPanel/AdminProfilesPage";




export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        path: "/",
        index: true,
        Component: HomePage,
      },
      {
        path: "/loginpage",
        Component: LoginPage,
      },
      {
        path: "/registerpage",
        Component: RegisterPage,
      },
      {
        path: "/biodataspage",
        Component: BiodatasPage,
      },
      {
        path: "/biodata/:biodataId",
        element: <PrivateRoute><BiodataDetails></BiodataDetails></PrivateRoute>
      },
      {
        path: "/checkout/:bioId",
        Component: CheckoutPage
      },
      {
        path: "/contact",
        Component: Contact
      },
      {
        path: "/about",
        Component: AboutPage
      },
      {
        path: "/blog",
        Component: SuccessStoryBlog
      },
      {
        path: "/success-story/:storyId",
        Component: SuccessStoryDetails
      }

    ],
  },

  // ✅ User Dashboard Routes
  {
    path: "/userDashboard",
    element: (
      <PrivateRoute>
        <UserDashboardLayout />

      </PrivateRoute>
    ),
    children: [
      {
        path: "/userDashboard",
        index: true,
        element: <ViewBiodata />,
      },
      {
        path: "editbio",
        element: <EditBiodata />,
      },

      {
        path: "myContactRequest",
        element: <MyContactRequest />,
      },
      {
        path: "favourites",
        element: <MyFavourites />,
      },
      {
        path: "gotMarried",
        element: <GotMarried />,
      },
    ],
  },

  // ✅ Admin Dashboard Routes
  {
    path: "/adminDashboard",
    element: (

      <PrivateAdmin>
        <AdminDashboardLayout />
      </PrivateAdmin>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardHome />,
      },
      {
        path: "manage",
        element: <ManageUsers />,
      },
      {
        path: "approvedPremium",
        element: <ApprovedPremium />,
      },
      {
        path: "approvedContactRequest",
        element: <ApprovedContactRequest />,
      },
      {
        path: "successStories",
        element: <SuccessStories />,
      },
    ],
  },

  // ✅ /admin control panel — username/password staff login, isolated from
  // the Firebase-based site auth used everywhere else.
  {
    path: "/admin",
    element: (
      <AdminAuthProvider>
        <Outlet />
      </AdminAuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/login" replace />,
      },
      {
        path: "login",
        element: <AdminLoginPage />,
      },
      {
        path: "dashboard",
        element: (
          <AdminPrivateRoute>
            <AdminPanelLayout />
          </AdminPrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminStatsPage />,
          },
          {
            path: "profiles",
            element: <AdminProfilesPage />,
          },
        ],
      },
    ],
  },
]);
