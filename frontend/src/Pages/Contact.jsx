import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaUser,
  FaChevronDown,
  FaPaperPlane,
} from "react-icons/fa";

const infoCards = [
  {
    icon: <FaPhoneAlt />,
    label: "Call Us",
    value: "+01 7312 5312",
    href: "tel:+0173125312",
  },
  {
    icon: <FaEnvelope />,
    label: "Email Us",
    value: "help@kairalimatchmakers.com",
    href: "mailto:help@kairalimatchmakers.com",
  },
  {
    icon: <FaMapMarkerAlt />,
    label: "Visit Us",
    value: "Kochi, Kerala, India",
    href: null,
  },
];

const faqs = [
  {
    q: "Who can join Kairali Match Makers?",
    a: "Kairali Match Makers is designed for Malayalees and Kerala-origin individuals and families looking for meaningful matrimonial connections.",
  },
  {
    q: "Can Malayalees living outside Kerala or overseas join?",
    a: "Yes. Malayalees living across India and overseas can use the platform to discover matrimonial profiles and connect with people who share their roots.",
  },
  {
    q: "Is Kairali Match Makers a dating platform?",
    a: "No. Kairali Match Makers is focused on matrimonial and marriage-oriented connections rather than casual dating.",
  },
  {
    q: "How quickly will I hear back after sending a message?",
    a: "Our team typically responds within one to two business days. For urgent queries, reach out over WhatsApp or phone.",
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // No backend endpoint exists for this form yet — kept as a local
    // acknowledgement, same as before, just with a brief pending state
    // so the button doesn't feel instant/unresponsive.
    await new Promise((resolve) => setTimeout(resolve, 500));

    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "Thank you for contacting Kairali Match Makers. We will get back to you as soon as possible.",
      confirmButtonColor: "#7A1F2B", // maroon
    });

    setForm({ name: "", email: "", message: "" });
    setSubmitting(false);
  };

  return (
    <section className="py-32 px-4 min-h-screen bg-gradient-to-b from-cream to-sand" id="contact">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h4 className="text-lg text-gold-dark tracking-widest subtitle-font font-semibold">
            WE'D LOVE TO HEAR FROM YOU
          </h4>
          <h2 className="text-3xl sm:text-4xl font-bold subtitle-font text-ink mt-2">
            Get in Touch
          </h2>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto poppins">
            Have a question about your profile, membership or matrimonial journey?
            We're here to help.
          </p>
          <img src="/flower.png" alt="" className="w-40 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: contact info */}
          <div className="lg:col-span-2 space-y-5">
            {infoCards.map(({ icon, label, value, href }) => {
              const Wrapper = href ? "a" : "div";
              return (
                <Wrapper
                  key={label}
                  {...(href ? { href } : {})}
                  className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow duration-300 group"
                >
                  <div className="w-12 h-12 shrink-0 rounded-full bg-maroon/10 text-maroon flex items-center justify-center text-lg group-hover:bg-maroon group-hover:text-white transition-colors duration-300">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-ink font-medium truncate">{value}</p>
                  </div>
                </Wrapper>
              );
            })}

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-br from-maroon to-maroon-dark rounded-2xl p-6 text-white shadow-sm">
              <p className="subtitle-font text-lg mb-1">Prefer WhatsApp?</p>
              <p className="text-white/70 text-sm mb-4 poppins">
                Message us directly for a quick response.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
              >
                <FaWhatsapp size={18} /> Chat on WhatsApp
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-sm text-gray-500 poppins">Follow us:</span>
              {[<FaFacebookF key="fb" />, <FaTwitter key="tw" />, <FaWhatsapp key="wa" />].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gold-dark hover:bg-gold hover:text-white transition-colors duration-300 text-sm"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                />
              </div>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                />
              </div>

              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition resize-none"
              ></textarea>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-maroon hover:bg-maroon-dark disabled:opacity-60 text-white py-3 rounded-lg font-medium transition duration-300"
              >
                {submitting ? (
                  "Sending…"
                ) : (
                  <>
                    <FaPaperPlane size={14} /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h4 className="text-lg text-gold-dark tracking-widest subtitle-font font-semibold">
              COMMON QUESTIONS
            </h4>
            <h2 className="text-3xl font-bold subtitle-font text-ink mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                  >
                    <span className="font-medium text-ink">{faq.q}</span>
                    <FaChevronDown
                      className={`text-gold-dark shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-gray-600 text-sm poppins">{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
