import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Why should I register as a donor?",
    answer:
      "Registering allows you to be part of a life-saving network, ensuring patients receive blood quickly when hospitals or blood banks may not have the right type available.",
  },
  {
    question: "Is it safe to donate?",
    answer:
      "Yes! Blood donation is safe when performed under professional supervision. SaviourSync only connects you to certified hospitals and blood banks.",
  },
  {
    question: "How will I be notified in an emergency?",
    answer:
      "Our system uses location-based matching and instant notifications to reach you if a patient nearby needs your blood type.",
  },
  {
    question: "Do I have to donate every time I’m contacted?",
    answer:
      "No. You can choose to accept or decline donation requests. Registration simply makes you part of the network when available.",
  },
  {
    question: "How does this help hospitals and blood banks?",
    answer:
      "Hospitals can reach donors directly, supplementing their stock and ensuring critical patients receive timely transfusions.",
  },
];

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans relative overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div
        className="absolute w-96 h-96 bg-red-400 rounded-full opacity-10 blur-3xl top-20 left-10"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-red-500 rounded-full opacity-10 blur-3xl bottom-20 right-20"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-60 h-60 bg-red-300 rounded-full opacity-10 blur-3xl top-1/3 right-1/4"
        animate={{ x: [0, 50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hero Section */}
      <section className="bg-red-700 text-white flex flex-col justify-center items-center text-center px-6 py-[15vh] relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-4 font-poppins"
        >
          About SaviourSync
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90 font-inter mb-6"
        >
          SaviourSync bridges the critical gap between donors and patients, ensuring
          life-saving blood reaches those who need it — quickly, reliably, and safely.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link
            to="/register"
            className="bg-white text-red-700 px-8 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
          >
            Register Now
          </Link>
        </motion.div>
      </section>

      {/* Why This Initiative */}
      <motion.section
        className="max-w-6xl mx-auto py-[10vh] px-6 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-red-700 mb-8 text-center font-poppins">
          Why This Initiative?
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed font-inter">
          While blood banks and hospitals play a vital role in maintaining supplies, emergencies often arise when:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-3 mb-6 font-inter">
          <li>Blood banks may run out of rare blood types.</li>
          <li>Immediate transfusion is required, and delays can cost lives.</li>
          <li>Hospitals may not have up-to-date information on nearby donors.</li>
        </ul>
        <p className="text-gray-700 leading-relaxed font-inter">
          By letting users register as donors, SaviourSync creates a dynamic, real-time
          network of individuals ready to help. This complements existing blood bank systems
          and saves lives faster.
        </p>
      </motion.section>

      {/* How it Works */}
      <motion.section
        className="bg-white py-[10vh] px-6 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-red-700 mb-12 text-center font-poppins">
          How SaviourSync Works
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[...Array(4)].map((_, idx) => {
            const items = [
              {
                title: "⚡ Fast Emergency Response",
                desc: "Registered donors can be notified instantly, reducing critical delays in emergencies.",
              },
              {
                title: "❤️ Life-Saving Impact",
                desc: "Every donor increases survival chances, especially for rare blood types or urgent cases.",
              },
              {
                title: "🌍 Community Driven",
                desc: "A collaborative network of donors, hospitals, and volunteers maximizes reach and impact.",
              },
              {
                title: "📊 Smarter Planning",
                desc: "Blood banks can use donor data to predict supply trends and optimize inventory management.",
              },
            ];
            const item = items[idx];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className="p-6 bg-gray-100 rounded-2xl shadow hover:shadow-lg transition text-center font-inter"
              >
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Guidelines Section */}
      <motion.section
        className="bg-gray-50 py-[10vh] px-6 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-red-700 mb-8 text-center font-poppins">
          Donation Guidelines
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Four guideline cards */}
          {[
            {
              title: "✅ Before Donating",
              items: [
                "Ensure you are at least 18 years old and in good health.",
                "Eat a healthy meal and stay hydrated before donation.",
                "Avoid alcohol or smoking at least 24 hours before donating.",
              ],
            },
            {
              title: "🩸 During Donation",
              items: [
                "Bring a valid ID for verification.",
                "Stay calm and relaxed — the process is safe and supervised.",
                "Inform staff if you feel uneasy or unwell.",
              ],
            },
            {
              title: "🍎 After Donation",
              items: [
                "Rest for 10–15 minutes before leaving.",
                "Drink plenty of fluids and eat iron-rich foods.",
                "Avoid heavy exercise for the next 24 hours.",
              ],
            },
            {
              title: "⚠️ Who Should Avoid",
              items: [
                "People with recent infections, surgeries, or chronic illnesses.",
                "Anyone weighing under 50kg or under 18 years of age.",
                "Individuals who recently received vaccinations (check guidelines).",
              ],
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-red-700 mb-3 font-poppins">{card.title}</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 font-inter">
                {card.items.map((li, i) => (
                  <li key={i}>{li}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="max-w-4xl mx-auto py-[10vh] px-6 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-red-700 mb-8 text-center font-poppins">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Disclosure key={idx} as={motion.div} className="bg-white rounded-xl shadow p-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full text-left text-gray-700 font-inter font-medium text-lg">
                    <span>{faq.question}</span>
                    <ChevronUpIcon
                      className={`w-6 h-6 text-red-700 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-2 text-gray-600 font-inter">
                    {faq.answer}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default About;
