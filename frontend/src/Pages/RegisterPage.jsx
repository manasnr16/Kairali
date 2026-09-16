import React, { useState, useContext, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { AuthContext } from '../Contex/AuthProvider';
import Swal from 'sweetalert2';
import axiosInstance from '../Axios Instance/axios';
import OtpInput from '../Components/OtpInput';
import auth from '../Firebase/firebase.config';

const provider = new GoogleAuthProvider();
const RESEND_SECONDS = 30;

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
      return error?.message || 'Google sign-up failed. Please try again.';
  }
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const { CreateUser, SigninWithGoogle, setUser, UpdateUserProfile } =
    useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // step: 'form' -> 'otp' -> submit happens right after otp verifies
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const cooldownRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(cooldownRef.current);
  }, []);

  const startCooldown = () => {
    setResendCooldown(RESEND_SECONDS);
    clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async (email) => {
    setSendingOtp(true);
    setOtpError('');
    try {
      await axiosInstance.post('/otp/send', { email, purpose: 'register' });
      startCooldown();
      return true;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to send verification code';
      Swal.fire({ title: message, icon: 'error' });
      return false;
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 1: validate the form, then send an OTP to the given email.
  const onSubmitDetails = async (data) => {
    setSubmitError('');
    const sent = await sendOtp(data.email);
    if (sent) {
      setFormData(data);
      setOtp('');
      setStep('otp');
    }
  };

  // Step 2: verify the OTP, then actually create the Firebase + DB account.
  const onVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter the 6-digit code');
      return;
    }
    setVerifyingOtp(true);
    setOtpError('');

    try {
      await axiosInstance.post('/otp/verify', {
        email: formData.email,
        otp,
        purpose: 'register',
      });
    } catch (error) {
      setVerifyingOtp(false);
      setOtpError(error?.response?.data?.message || 'Incorrect code. Please try again.');
      return;
    }

    setLoading(true);
    const { name, email, password } = formData;

    try {
      await CreateUser(email, password);
      await UpdateUserProfile({ displayName: name });

      const userInfo = { name, email, role: 'user' };
      await axiosInstance.post('/users', userInfo);

      Swal.fire({
        title: 'Signup Successfully!',
        icon: 'success',
        draggable: true,
      });

      navigate('/');
      reset();
    } catch (error) {
      setSubmitError(error.message || 'Something went wrong');
      setStep('form');
      Swal.fire({ title: error.message || 'Something went wrong', icon: 'error' });
    } finally {
      setLoading(false);
      setVerifyingOtp(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !formData?.email) return;
    setOtp('');
    setOtpError('');
    await sendOtp(formData.email);
  };

  // Shared by both the popup success path and the redirect-completion effect
  // below, since a blocked/auto-closed popup falls back to a full-page
  // redirect (see AuthContext.SigninWithGoogle).
  const completeGoogleSignup = async (googleUser) => {
    setUser(googleUser);

    const userInfo = {
      name: googleUser.displayName,
      email: googleUser.email,
      role: 'user',
      authProvider: 'google',
    };

    try {
      await axiosInstance.post('/users', userInfo);
      Swal.fire({
        title: 'Signup Successfully!',
        icon: 'success',
        draggable: true,
      });
      navigate('/');
    } catch (error) {
      Swal.fire({
        title: 'Could not finish signup',
        text: error?.response?.data?.message || 'Failed to save your account. Please try again.',
        icon: 'error',
      });
    }
  };

  const handleGoogleLogin = () => {
    SigninWithGoogle(provider)
      .then((result) => {
        if (result?.user) return completeGoogleSignup(result.user);
      })
      .catch((error) => {
        if (SILENT_GOOGLE_ERROR_CODES.has(error?.code)) return;
        Swal.fire({ title: describeGoogleError(error), icon: 'error' });
      });
  };

  // Completes a Google signup that fell back to a full-page redirect —
  // Firebase brings the browser back to this same route, so on remount we
  // check whether a redirect just finished and, if so, run the same
  // account-creation logic the popup path uses.
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) return completeGoogleSignup(result.user);
      })
      .catch((error) => {
        if (SILENT_GOOGLE_ERROR_CODES.has(error?.code)) return;
        Swal.fire({ title: describeGoogleError(error), icon: 'error' });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Decorative side panel — hidden on small/medium screens */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative bg-gradient-to-br from-maroon to-maroon-dark items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%)]" />
        <div className="relative z-10 text-white max-w-md text-center">
          <h1 className="subtitle-font text-3xl xl:text-4xl font-semibold mb-4">
            Begin Your Matrimony Journey
          </h1>
          <p className="text-white/80 text-sm xl:text-base">
            Create your matrimonial profile and discover meaningful connections within the Malayalee community.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center pt-24 pb-10 px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          {step === 'form' && (
            <>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-1 text-center subtitle-font text-maroon">
                Create Your Account
              </h2>
              <p className="text-center text-gray-500 text-sm mb-6">
                We'll email you a verification code to confirm it's really you.
              </p>

              {submitError && (
                <p className="text-red-500 text-sm mb-4 text-center">{submitError}</p>
              )}

              <form onSubmit={handleSubmit(onSubmitDetails)} noValidate>
                <input
                  type="text"
                  placeholder="Full Name"
                  className={`w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-gold ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('name', { required: 'Full Name is required' })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mb-2 -mt-2">{errors.name.message}</p>
                )}

                <input
                  type="email"
                  placeholder="Email"
                  className={`w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-gold ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mb-2 -mt-2">{errors.email.message}</p>
                )}

                <div className="relative mb-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-gold ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
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
                {errors.password && (
                  <p className="text-red-500 text-xs mb-2">{errors.password.message}</p>
                )}

                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="w-full mt-3 bg-maroon hover:bg-maroon-dark disabled:opacity-60 text-white py-3 rounded transition duration-300 text-sm sm:text-base"
                >
                  {sendingOtp ? 'Sending code…' : 'Continue'}
                </button>
              </form>

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
                <FcGoogle size={22} /> Sign up with Google
              </button>

              <p className="text-sm text-center mt-4">
                Already have an account?{' '}
                <Link to="/loginpage" className="text-maroon font-medium hover:underline">
                  Login here
                </Link>
              </p>
            </>
          )}

          {step === 'otp' && (
            <>
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex items-center gap-2 text-gray-500 hover:text-maroon text-sm mb-4"
              >
                <FaArrowLeft /> Back
              </button>

              <h2 className="text-2xl sm:text-3xl font-semibold mb-1 text-center subtitle-font text-maroon">
                Verify Your Email
              </h2>
              <p className="text-center text-gray-500 text-sm mb-6 break-words">
                Enter the 6-digit code sent to <span className="font-medium text-gray-700">{formData?.email}</span>
              </p>

              <OtpInput value={otp} onChange={setOtp} disabled={verifyingOtp || loading} error={!!otpError} />
              {otpError && <p className="text-red-500 text-xs text-center mt-3">{otpError}</p>}

              <button
                type="button"
                onClick={onVerifyOtp}
                disabled={verifyingOtp || loading}
                className="w-full mt-6 bg-maroon hover:bg-maroon-dark disabled:opacity-60 text-white py-3 rounded transition duration-300 text-sm sm:text-base"
              >
                {verifyingOtp || loading ? 'Verifying…' : 'Verify & Create Account'}
              </button>

              <div className="text-center mt-4 text-sm text-gray-500">
                {resendCooldown > 0 ? (
                  <span>Resend code in {resendCooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={sendingOtp}
                    className="text-maroon font-medium hover:underline disabled:opacity-60"
                  >
                    {sendingOtp ? 'Resending…' : "Didn't get it? Resend code"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
