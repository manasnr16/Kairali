import React from 'react';

const testimonials = [
  {
    names: 'Devika & Nandhu',
    marriedOn: '20 Feb 2024',
    image: '/img2.png',
    quote:
      'Kairali Match Makers helped us find each other and made this journey truly memorable.',
  },
  {
    names: 'Maria & George',
    marriedOn: '12 Jan 2024',
    image: '/img3.png',
    quote:
      'From our very first conversation, we knew this was the beginning of something beautiful.',
  },
  {
    names: 'Megha & Vivek',
    marriedOn: '08 Mar 2024',
    image: '/img5.png',
    quote: 'Kairali made it easy to connect with someone who truly understood our values and expectations.',
  },
];

const CoupleTestimonials = () => {
  return (
    <div className="pb-32 px-4 max-w-screen-xl mx-auto lg:px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <div
            key={t.names}
            data-aos="fade-up"
            data-aos-delay={index * 150}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <img
              src={t.image}
              alt={t.names}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <span className="text-3xl text-gold-dark font-serif leading-none">“</span>
              <p className="text-gray-600 italic -mt-2">{t.quote}</p>
              <h3 className="text-lg font-semibold text-maroon mt-4 subtitle-font">
                {t.names}
              </h3>
              <p className="text-sm text-gray-400">Married on {t.marriedOn}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoupleTestimonials;
