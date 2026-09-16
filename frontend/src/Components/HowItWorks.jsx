import React from "react";
// AOS is initialized once globally in MainLayout — no per-section init here,
// otherwise re-initializing resets/duplicates the observer and throws off
// the scroll-trigger offsets for the rest of the page.

const steps = [
  {
    title: "Create Your Profile",
    description: "Create your matrimonial profile and share the details that help others know you better.",
    image: "/rings.png",
    position: "right",
  },
  {
    title: "Discover Your Matches",
    description: "Explore Malayalee profiles based on your preferences, interests and expectations.",
    image: "/wedding-2.png",
    position: "left",
  },
  {
    title: "Send Interest",
    description: "Found someone you would like to know better? Send an interest.",
    image: "/love-birds.png",
    position: "right",
  },
  {
    title: "Connect",
    description: "Once there is mutual interest, begin a respectful conversation.",
    image: "/network.png",
    position: "left",
  },
  {
    title: "Get to Know Each Other",
    description: "Take time to understand each other's values, goals, family and expectations.",
    image: "/chat.png",
    position: "right",
  },
  {
    title: "Begin Your Next Chapter",
    description: "When two families and two individuals find the right connection, a new journey begins.",
    image: "/wedding-couple.png",
    position: "left",
  },
];

const HowItWorks = () => {
  return (
    <div className="py-16  overflow-x-hidden">
      <h4
        data-aos="fade-down"
        className="text-lg text-[#A67C2E] tracking-widest subtitle-font font-semibold text-center"
      >
        YOUR MATRIMONY JOURNEY
      </h4>
      <h2
        data-aos="fade-up"
        className="text-center text-3xl sm:text-4xl font-bold subtitle-font text-[#2B211C] mt-2"
      >
        How It Works
      </h2>
      <img
        data-aos="zoom-in"
        src="/flower.png"
        alt=""
        className="w-50 mx-auto mb-16"
      />

      <div className="relative w-full max-w-4xl mx-auto">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-maroon" />

        {steps.map((step, index) => (
          <div
            key={index}
            data-aos={step.position === "right" ? "fade-left" : "fade-right"}
            className={`mb-10 flex items-center justify-between w-full  overflow-hidden ${
              step.position === "right" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-1/2 px-4">
              <div className="bg-sand p-3 md:p-6 rounded-lg shadow-md">
                <h3 className="text-[14px] md:text-xl subtitle-font font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-[12px] md:text-base poppins">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Center Dot */}
            <div className="relative z-10 w-8 h-8 bg-maroon border-4 border-white rounded-full shadow-md" />

            <div className="w-1/2 flex justify-center px-4">
              <img
                src={step.image}
                alt={step.title}
                className="w-20 md:w-30"
                data-aos="zoom-in"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
