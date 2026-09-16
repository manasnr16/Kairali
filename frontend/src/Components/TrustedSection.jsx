import React from 'react';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



const testimonials = [
  {
    name: 'ANJALI MENON',
    location: 'Kochi',
    image: 'https://i.ibb.co/sJDVfgFb/9.jpg',
    text: 'Kairali Match Makers helped us find a genuine connection built on shared values and understanding.',
  },
  {
    name: 'ARUN NAIR',
    location: 'Dubai',
    image: 'https://i.ibb.co/VYBxmLRb/8.jpg',
    text: 'Even while living abroad, I stayed connected to my roots and found someone who understood my background.',
  },
  {
    name: 'MEERA PILLAI',
    location: 'Thrissur',
    image: 'https://i.ibb.co/WN3Pxs9Q/7.jpg',
    text: 'The experience felt warm and respectful, much like being introduced through family.',
  },
  {
    name: 'VISHNU KARTHA',
    location: 'Bengaluru',
    image: 'https://i.ibb.co/v4Zhqvn6/6.jpg',
    text: 'A thoughtful platform that made it easy to find someone who shares my values and outlook.',
  },
];


const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-0 top-1/2 z-10 transform -translate-y-1/2 bg-[#C89B3C] text-white p-3 rounded-full shadow-md hover:bg-[#A67C2E] transition-colors duration-300 sm:-left-3 sm:p-2"
    aria-label="Previous Slide"
  >
    <FaChevronLeft />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-0 top-1/2 z-10 transform -translate-y-1/2 bg-[#C89B3C] text-white p-3 rounded-full shadow-md hover:bg-[#A67C2E] transition-colors duration-300 sm:-right-3 sm:p-2"
    aria-label="Next Slide"
  >
    <FaChevronRight />
  </button>
);

const TrustedSection = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,         
    autoplaySpeed: 3000,     
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="py-16 mt-12">
      <div className="text-center mb-10 px-4 sm:px-6 lg:px-8">
        <h4 className="text-lg text-[#A67C2E] tracking-widest subtitle-font font-semibold">BUILT ON TRUST</h4>
        <h2 className="text-3xl sm:text-4xl font-bold subtitle-font  text-[#2B211C] mt-2">
          Meaningful Connections Begin With <span className="text-5xl font-extrabold">Trust</span>
        </h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          We believe matrimonial relationships should begin with authenticity, respect and genuine intentions.
        </p>
        <div className="flex justify-center mt-4">
          <img src="/flower.png" alt="decor" className="w-52" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Slider {...settings}>
          {testimonials.map((item, idx) => (
            <div key={idx} className="px-3">
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center h-[300px] md:h-[280px] relative">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Colored corners */}
                  <div className="absolute w-2 h-2 bg-maroon top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm" />
                  <div className="absolute w-2 h-2 bg-gold bottom-0 left-0 -translate-x-1/2 translate-y-1/2 rounded-sm" />
                  <div className="absolute w-2 h-2 bg-forest top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-sm" />
                  <div className="absolute w-2 h-2 bg-gold-dark bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 rounded-sm" />
                </div>
                <p className="text-gray-600 text-sm mb-4">{item.text}</p>
                <h3 className="text-[#2B211C] font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.location}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TrustedSection;
