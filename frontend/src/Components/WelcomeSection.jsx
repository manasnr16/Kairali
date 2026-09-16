import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router";


const WelcomeSection = () => {
  return (
    <div className="px-5 py-16">
      {/* Top Section */}
      <div className="max-w-screen-xl mx-auto lg:px-4 flex flex-col md:flex-row gap-10">
        {/* Image Section */}
        <div className="relative w-full md:w-1/2 hidden md:flex">
          <img
            src="/img1.png"
            alt="Couple 1"
            className="rounded-xl shadow-lg w-11/12 object-cover h-3/4"
          />
          <img
            src="/img2.png"
            alt="Couple 2"
            className="absolute bottom-[-20px] left-[30px] md:left-[50px] w-11/12 h-3/4 object-cover rounded-xl border-5 border-gold shadow-xl"
          />
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 text-start md:text-left">
          <h2 className="text-4xl font-bold text-[#A67C2E] mb-2 subtitle-font">WELCOME TO</h2>
          <h3 className="text-3xl text-maroon font-semibold mb-4 subtitle-font">
            KAIRALI MATCH MAKERS
          </h3>
          <p className="text-gray-600 mb-3 poppins">
            Your search for a meaningful life partner begins here. At Kairali Match Makers, we bring together Malayalees and Kerala-origin families looking for meaningful matrimonial relationships. Whether you are from Kerala, living elsewhere in India or part of the global Malayalee community, our platform helps you discover profiles that match your preferences and expectations.
            <br />
            <Link to="/loginpage">
              Start your matrimonial journey today
              <span className="text-maroon font-medium underline cursor-pointer poppins mx-1">
                click here
              </span>
            </Link>{" "}
            to begin!
          </p>
          <hr className="my-4" />
          <p className="text-gray-600 mb-4 poppins">
            Marriage is more than finding a profile. It is about finding someone whose values, aspirations and family outlook complement your own. We aim to make that journey more personal, respectful and convenient.
          </p>

          {/* Contact Info */}
          <div className="flex gap-10 flex-col md:flex-row justify-center md:justify-start mt-6">
            <div className="flex items-center gap-2">
              <div className="bg-ink text-white p-2 rounded-full">
                <FaPhoneAlt />
              </div>
              <span>+0123456789</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-ink text-white p-2 rounded-full">
                <MdEmail />
              </div>
              <span>info@example.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
