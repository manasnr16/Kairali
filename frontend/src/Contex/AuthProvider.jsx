import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import auth from "../Firebase/firebase.config";
import { toast, Bounce } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../Axios Instance/axios";

// Create context
export const AuthContext = createContext({});

const imgbbApiKey =  import.meta.env.VITE_IMGBB_API_KEY;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Tracks only "has Firebase told us the initial auth state yet?" — this is
  // what route guards (PrivateRoute/PrivateAdmin) should gate on. `loading`
  // above is also reused as a per-action busy flag by CreateUser/LoginUser/
  // etc., and those only clear it on success; a single failed login before
  // this component ever mounted again would otherwise wedge every protected
  // route behind an infinite spinner even though auth itself resolved fine.
  const [authChecked, setAuthChecked] = useState(false);

  // 🖼️ Image Upload State
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // 🔄 Upload Image Function
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        const url = data.data.display_url;
        setUploadedImageUrl(url);
        SuccessTost("Image uploaded successfully!");
        return url;
      } else {
        ErrorTost("Image upload failed");
        return "";
      }
    } catch (error) {
      console.error("Image upload error:", error);
      ErrorTost("Upload error");
      return "";
    } finally {
      setUploading(false);
    }
  };

  // ✅ Toast
  const SuccessTost = (message) => {
    return toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  const ErrorTost = (message) => {
    return toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  // ✅ Firebase Auth Methods
  // Each of these clears `loading` again on failure — success is already
  // covered by the onAuthStateChanged listener below, but a rejected
  // promise here never reaches that listener, so without this `loading`
  // would stay stuck true (see the `authChecked` note above for why route
  // guards no longer depend on this flag at all, but other UI still might).
  const CreateUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).catch((error) => {
      setLoading(false);
      throw error;
    });
  };

  const UpdateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  const LoginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).catch((error) => {
      setLoading(false);
      throw error;
    });
  };

  const LogOut = () => {
    setLoading(true);
    return signOut(auth).catch((error) => {
      setLoading(false);
      throw error;
    });
  };

  // Popups are blocked outright (or silently force-closed within
  // milliseconds by a strict Cross-Origin-Opener-Policy) in a lot of
  // sandboxed/embedded dev environments and some browsers — that used to
  // fail with no visible feedback and leave `loading` stuck true forever.
  // This now falls back to a full-page redirect when that happens, and
  // always resets `loading` so a failed attempt doesn't wedge the app.
  const SigninWithGoogle = async (provider) => {
    setLoading(true);
    const startedAt = Date.now();

    try {
      return await signInWithPopup(auth, provider);
    } catch (error) {
      const elapsed = Date.now() - startedAt;
      const shouldFallBackToRedirect =
        error.code === "auth/popup-blocked" ||
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/operation-not-supported-in-this-environment" ||
        // A "closed by user" that fires almost instantly is very rarely a
        // real click — it's usually the browser/COOP policy tearing the
        // popup down before the user could ever interact with it.
        (error.code === "auth/popup-closed-by-user" && elapsed < 1500);

      if (shouldFallBackToRedirect) {
        await signInWithRedirect(auth, provider);
        return null; // the browser is navigating away; nothing left to do here
      }

      setLoading(false);
      throw error;
    }
  };

  const PasswordReset = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email).catch((error) => {
      setLoading(false);
      throw error;
    });
  };

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      setUser(null);
    }
    setLoading(false);
    setAuthChecked(true);
  });

  return () => unsubscribe();
}, []);

// manage role Authuser data section 

  const { data: authUser = {}, refetch: refetchAuthUser } = useQuery({
  queryKey: ["authUser", user?.email],
  enabled: !!user?.email,
  queryFn: async () => {
    const res = await axiosInstance.get(`/authusers?email=${user?.email}`);
    return res.data;
  },
});

  // console.log(authUser)

  // my biodata section 
  
  // ✅ Fetch biodata using email
    const { data: biodata ,isLoading , isError , refetch: refetchBiodata, } = useQuery({
      queryKey: ['biodata', user?.email],
      queryFn: async () => {
        const res = await axiosInstance.get(`/biodata?email=${user?.email}`);
        return res.data.data;
      },
      enabled: !!user?.email,
    });

  // console.log(biodata)
  // console.log(biodata?.profileImage)
  // console.log(biodata?.email)

  useEffect(() => {
  if (
    authUser?.isPremium &&
    biodata?.email 
    
  ) {
    axiosInstance
      .post("all-premium-members", biodata)
      .then(() => {
        // console.log("Premium member posted");
      })
      .catch((err) => {
        if (err.response?.status !== 409) {
          // console.error("Failed to post premium member:", err);
        }
      });
  }
}, [authUser?.isPremium, biodata]);

  // ✅ All values provided to children
  const info = {
    user,
    setUser,
    CreateUser,
    LoginUser,
    LogOut,
    SigninWithGoogle,
    UpdateUserProfile,
    SuccessTost,
    ErrorTost,
    loading,
    setLoading,
    authChecked,
    PasswordReset,

    // 🖼️ Image upload values
    uploadedImageUrl,
    uploadImage,
    uploading,
   
    // user role manage section 

    authUser,
    refetchAuthUser,

    //my biodata value 

    biodata ,
    isLoading,
    isError,
    refetchBiodata

  };

  return <AuthContext.Provider value={info}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
