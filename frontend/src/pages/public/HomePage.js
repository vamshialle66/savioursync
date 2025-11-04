import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import { FaHeartbeat, FaHospital, FaSyringe } from "react-icons/fa";
import { GiBlood } from "react-icons/gi";

const Home = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    let isScrolling = false;
    const handleWheel = (e) => {
      e.preventDefault();
      if (isScrolling) return;

      const delta = e.deltaY;
      const currentSectionIndex = sectionsRef.current.findIndex(
        (sec) =>
          sec.getBoundingClientRect().top >= 0 &&
          sec.getBoundingClientRect().top < window.innerHeight
      );

      let nextIndex = currentSectionIndex;
      if (delta > 0 && currentSectionIndex < sectionsRef.current.length - 1) {
        nextIndex = currentSectionIndex + 1;
      } else if (delta < 0 && currentSectionIndex > 0) {
        nextIndex = currentSectionIndex - 1;
      }

      if (nextIndex !== currentSectionIndex) {
        isScrolling = true;
        sectionsRef.current[nextIndex].scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          isScrolling = false;
        }, 800);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const headerHeight = 80;

  return (
    <div className="relative bg-white text-gray-900 overflow-hidden">
      <Header />

      {/* Floating Health Icons */}
      <motion.div
        className="absolute top-10 left-16 text-red-600 opacity-30 text-4xl"
        animate={{ y: [0, -30, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaHeartbeat />
      </motion.div>

      <motion.div
        className="absolute bottom-24 right-20 text-red-500 opacity-25 text-5xl"
        animate={{ y: [0, 40, 0], rotate: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <GiBlood />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-1/4 text-red-400 opacity-30 text-4xl"
        animate={{ x: [0, 50, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaSyringe />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/3 text-red-600 opacity-20 text-5xl"
        animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaHospital />
      </motion.div>

      {/* Hero Section */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="relative h-screen flex flex-col justify-center items-center text-center px-6"
        style={{ paddingTop: `${headerHeight}px` }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight mb-6"
        >
          Connect. Donate. Save Lives.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl mb-10 max-w-2xl opacity-90"
        >
          SaviourSync links donors to recipients instantly — your blood could be
          the difference between life and death.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link
            to="/apply-donor"
            className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold shadow hover:bg-red-700 transition"
          >
            Join as a Donor
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="h-screen flex flex-col justify-center items-center px-6 bg-gray-50 relative z-10"
        style={{ paddingTop: `${headerHeight}px` }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-red-700 mb-14 text-center"
        >
          Why Choose SaviourSync?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl">
          {[
            {
              icon: "⚡",
              color: "text-red-600",
              title: "Fast Matching",
              desc: "Smart system finds compatible donors in minutes, cutting response time in emergencies.",
            },
            {
              icon: "❤️",
              color: "text-pink-600",
              title: "Life-Saving Impact",
              desc: "Every registered donor increases survival chances for patients in critical need.",
            },
            {
              icon: "🌍",
              color: "text-green-600",
              title: "Community Driven",
              desc: "Join a network of donors and hospitals working together to save lives daily.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="p-8 bg-white shadow-lg rounded-2xl hover:shadow-xl transition flex flex-col items-center text-center"
            >
              <div className="bg-white rounded-full p-4 shadow-md mb-4">
                <span className={`${item.color} text-3xl`}>{item.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="h-screen flex flex-col justify-center items-center px-6 bg-white relative z-10"
        style={{ paddingTop: `${headerHeight}px` }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-900"
        >
          Be a Life Saver. Anytime, Anywhere.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl mb-8 max-w-2xl text-center text-gray-600"
        >
          Register as a donor today — your donation could save someone’s life in
          minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link
            to="/apply-donor"
            className="bg-red-600 text-white px-10 py-4 rounded-xl font-semibold shadow hover:bg-red-700 transition"
          >
            Get Started
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
