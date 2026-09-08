import React from 'react';
import { Link } from 'react-router';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-ink pt-24 pb-5 text-white">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0 md:max-w-sm">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                className="w-40"
                alt="Kairali Match Makers"
              />
            </Link>
            <p className="text-gray-300">
              A premium matrimony platform for Malayalee families — built on
              trust, verified profiles, and genuine intent.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gold">Explore</h2>
              <ul className="text-white font-medium">
                <li className="mb-4">
                  <Link to="/about" className="hover:underline hover:text-gold transition-colors">About Us</Link>
                </li>
                <li className="mb-4">
                  <Link to="/" className="hover:underline hover:text-gold transition-colors">How It Works</Link>
                </li>
                <li className="mb-4">
                  <Link to="/blog" className="hover:underline hover:text-gold transition-colors">Success Stories</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:underline hover:text-gold transition-colors">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gold">Legal</h2>
              <ul className="text-white font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline hover:text-gold transition-colors">Privacy Policy</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline hover:text-gold transition-colors">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="hover:underline hover:text-gold transition-colors">Safety Guidelines</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gold">Get in Touch</h2>
              <ul className="text-white font-medium space-y-4">
                <li className="flex items-start gap-2">
                  <FaEnvelope className="mt-1 text-gold shrink-0" />
                  <a href="mailto:support@kairalimatchmakers.example" className="hover:underline hover:text-gold transition-colors break-all">
                    support@kairalimatchmakers.example
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <FaPhoneAlt className="mt-1 text-gold shrink-0" />
                  <a href="tel:+914840000000" className="hover:underline hover:text-gold transition-colors">
                    +91 484 000 0000
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1 text-gold shrink-0" />
                  <span>Kochi, Kerala, India</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-600 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-center">
          <span className="text-sm text-gray-300 sm:text-center">
            © 2026 Kairali Match Makers. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
