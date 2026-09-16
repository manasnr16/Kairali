// components/HeroSlider.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { Link } from "react-router";

const slides = [
  "/img1.png",
  "/img2.png",
  "/img3.png",
  "/img4.png",
];

const HeroSlider = () => {
  return (
    <div className="relative w-full h-[900px] md:h-[95vh] overflow-hidden max-w-[100vw]">
      {/* Swiper Slider */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        className="h-full"
      >
        {slides.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center animate-zoom"
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 to-black/90 flex flex-col justify-center items-center text-center px-4 max-w-full">
        {/* Text */}
        <div className="text-white mb-8 mt-32 md:mt-20 max-w-[95vw]">
          <p className="text-[12px] md:text-base tracking-widest poppins">
            KERALA'S MALAYALEE MATRIMONY
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold subtitle-font break-words">
            Meet Your <span className="text-maroon">Life Partner</span>
          </h1>
          <p className="mt-2 text-sm w-10/12 mx-auto md:text-lg poppins">
            Discover meaningful matrimonial connections among Malayalees from Kerala, across India and around the world.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-gradient-to-r from-cream to-sand bg-opacity-10 p-6 md:p-5 rounded-lg w-full max-w-5xl mx-4">
          <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full">
            <select className="px-3 py-2 rounded text-black w-full">
              <option>I'm looking for</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <select className="px-3 py-2 rounded text-black w-full">
              <option>Age</option>
              <option>18-25</option>
              <option>26-35</option>
              <option>36-45</option>
              <option>46+</option>
            </select>
            <select className="px-3 py-2 rounded text-black w-full">
              <option>Religion</option>
              <option>Hindu</option>
              <option>Christian</option>
              <option>Muslim</option>
              <option>Other</option>
            </select>
            <select className="px-3 py-2 rounded text-black w-full">
              <option>Location</option>
              <option>Kerala</option>
              <option>Kochi</option>
              <option>Thiruvananthapuram</option>
              <option>Kozhikode</option>
              <option>Thrissur</option>
            </select>
            <Link to="/biodataspage">
              <button className="bg-maroon hover:bg-maroon-dark py-2 text-white font-semibold rounded w-full">
                Find Your Match
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
