import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { AuthContext } from '../Contex/AuthProvider';
import Swal from 'sweetalert2';
import axiosInstance from '../Axios Instance/axios';
import auth from '../Firebase/firebase.config';

const provider = new GoogleAuthProvider();

// Codes that mean "the user backed out on their own" — not a real error.
const SILENT_GOOGLE_ERROR_CODES = new Set([
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
]);

const describeGoogleError = (error) => {
  switch (error?.code) {
    case 'auth/unauthorized-domain':
      return "This site's domain isn't authorized for Google sign-in yet. Please contact support.";
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled for this app yet. Please contact support.';
    case 'auth/network-request-failed':
      return 'Network error — please check your connection and try again.';
    default:
      return error?.message || 'Google sign-in failed. Please try again.';
  }
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    SigninWithGoogle,
    setUser,
    LoginUser,
    PasswordReset,
  } = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError('');

    const { email, password } = data;

    try {
      LoginUser(email, password)
        .then((result) => {
          setUser(result.user);
          Swal.fire({
            title: "Login Successfully!",
            icon: "success",
            draggable: true,
          });
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1000);
        })
        .catch((error) => {
          setLoginError('Invalid email or password. Please try again.');
          Swal.fire({
            title: `${error.message}`,
            icon: "error",
            draggable: true,
          });
        })
        .finally(() => setLoading(false));
    } catch {
      setLoginError('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  // Shared by both the popup success path and the redirect-completion effect
  // below, since a blocked/auto-closed popup falls back to a full-page
  // redirect (see AuthContext.SigninWithGoogle).
  const completeGoogleLogin = async (googleUser) => {
    try {
      const { data: existingUser } = await axiosInstance.get(`/authusers?email=${googleUser.email}`);

      if (!existingUser) {
        await Swal.fire({
          title: 'No account found!',
          text: 'Please sign up first before logging in with Google.',
          icon: 'error',
        });
        return;
      }

      setUser(googleUser);

      Swal.fire({
        title: 'Signin Successfully!',
        icon: 'success',
        draggable: true,
      });

      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        title: 'Could not sign you in',
        text: error?.response?.data?.message || 'Something went wrong talking to the server. Please try again.',
        icon: 'error',
      });
    }
  };

  const handleGoogleLogin = () => {
    SigninWithGoogle(provider)
      .then((result) => {
        if (result?.user) return completeGoogleLogin(result.user);
      })
      .catch((error) => {
        if (SILENT_GOOGLE_ERROR_CODES.has(error?.code)) return;
        Swal.fire({ title: describeGoogleError(error), icon: 'error' });
      });
  };

  // Completes a Google login that fell back to a full-page redirect —
  // Firebase brings the browser back to this same route, so on remount we
  // check whether a redirect just finished and, if so, run the same
  // lookup logic the popup path uses.
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) return completeGoogleLogin(result.user);
      })
      .catch((error) => {
        if (SILENT_GOOGLE_ERROR_CODES.has(error?.code)) return;
        Swal.fire({ title: describeGoogleError(error), icon: 'error' });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleForgotPassword = async () => {
    const email = getValues('email');
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      Swal.fire({
        title: 'Enter your email first',
        text: 'Type your email in the field above, then click "Forgot password?" again.',
        icon: 'info',
      });
      return;
    }

    setResetLoading(true);
    try {
      await PasswordReset(email);
      Swal.fire({
        title: 'Reset link sent!',
        text: `Check ${email} for instructions to reset your password.`,
        icon: 'success',
      });
    } catch (error) {
      Swal.fire({ title: error.message, icon: 'error' });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Decorative side panel — hidden on small/medium screens */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative bg-gradient-to-br from-maroon to-maroon-dark items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,white,transparent_35%)]" />
        <div className="relative z-10 text-white max-w-md text-center">
          <h1 className="subtitle-font text-3xl xl:text-4xl font-semibold mb-4">
            Welcome Back to Kairali Match Makers
          </h1>
          <p className="text-white/80 text-sm xl:text-base">
            Sign in to continue your journey towards finding a meaningful life partner.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center pt-24 pb-10 px-4 sm:px-6 md:px-10 lg:px-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="bg-white w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl sm:text-3xl subtitle-font font-semibold mb-6 text-center text-maroon">
            Welcome Back
          </h2>

          {loginError && <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>}

          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-gold
              ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-xs mb-2 -mt-2">{errors.email.message}</p>}

          <div className="relative mb-1">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-gold
                ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mb-2">{errors.password.message}</p>}

          <div className="text-right mb-4">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="text-xs sm:text-sm text-maroon hover:underline disabled:opacity-60"
            >
              {resetLoading ? 'Sending…' : 'Forgot password?'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maroon hover:bg-maroon-dark disabled:opacity-60 text-white py-3 rounded transition duration-300 text-sm sm:text-base"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:shadow-md text-gray-700 py-3 rounded transition duration-300 text-sm sm:text-base"
          >
            <FcGoogle size={22} /> Continue with Google
          </button>

          <p className="text-sm text-center mt-4">
            Don't have an account?{' '}
            <Link to="/registerpage" className="text-maroon font-medium hover:underline">
              Create your matrimonial profile
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
