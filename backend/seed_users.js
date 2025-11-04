// seedLargeDonorsV2.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Donor = require("./models/Donor");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yourdb";

// ----------------- Names -----------------
const firstNames = [
  "Aarav","Vivaan","Aditya","Sai","Arjun","Rohan","Krishna","Ananya","Diya","Ishaan",
  "Kabir","Reyansh","Aanya","Saanvi","Kavya","Meera","Riya","Tanish","Ira","Shaurya",
  "Dhruv","Anika","Prisha","Advait","Yash","Atharv","Vanya","Ishita","Karan","Siddharth",
  "Tanvi","Aadhya","Ansh","Vihaan","Pranav","Lakshya","Navya","Aryan","Sanya","Arya",
];

const lastNames = [
  "Sharma","Verma","Gupta","Patel","Reddy","Kumar","Singh","Chowdhury","Mehta","Jain",
  "Kapoor","Nair","Joshi","Saxena","Malhotra","Desai","Chopra","Bhatia","Trivedi","Kohli",
];

// ----------------- Cities -----------------
const cities = [
  { name: "Mumbai", coords: [72.8777, 19.0760] },
  { name: "Delhi", coords: [77.1025, 28.7041] },
  { name: "Bangalore", coords: [77.5946, 12.9716] },
  { name: "Hyderabad", coords: [78.4867, 17.3850] },
  { name: "Chennai", coords: [80.2707, 13.0827] },
  { name: "Kolkata", coords: [88.3639, 22.5726] },
  { name: "Pune", coords: [73.8567, 18.5204] },
  { name: "Jaipur", coords: [75.7873, 26.9124] },
  { name: "Ahmedabad", coords: [72.5714, 23.0225] },
  { name: "Lucknow", coords: [80.9462, 26.8467] },
];

// ----------------- Blood groups -----------------
const bloodGroups = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];
const bloodProbabilities = [0.37, 0.30, 0.22, 0.07, 0.02, 0.01, 0.01, 0.005];

// ----------------- Medical Histories -----------------
const medicalHistories = [
  { condition: "Mild anemia", diagnosisDate: new Date("2024-01-15"), status: "Resolved", notes: "Treated with iron supplements, stable hemoglobin." },
  { condition: "Seasonal allergies", diagnosisDate: new Date("2023-11-05"), status: "Ongoing", notes: "Uses antihistamines as needed during spring." },
  { condition: "Vitamin D deficiency", diagnosisDate: new Date("2024-03-10"), status: "Resolved", notes: "On supplements, normalized levels." },
  { condition: "Past dengue infection", diagnosisDate: new Date("2022-07-20"), status: "Resolved", notes: "Full recovery, no complications." },
  { condition: "Mild hypertension", diagnosisDate: new Date("2023-06-18"), status: "Ongoing", notes: "Under control with lifestyle modification." },
  { condition: "Previous COVID-19 infection", diagnosisDate: new Date("2021-09-10"), status: "Resolved", notes: "Recovered fully, no lingering effects." },
  { condition: "Low back pain", diagnosisDate: new Date("2024-02-22"), status: "Ongoing", notes: "Doing physiotherapy, improving." },
  { condition: "Sinusitis", diagnosisDate: new Date("2024-04-05"), status: "Resolved", notes: "No current symptoms." },
  { condition: "Gastritis", diagnosisDate: new Date("2024-05-14"), status: "Ongoing", notes: "On medication, monitored by physician." },
  { condition: "Migraine", diagnosisDate: new Date("2022-12-01"), status: "Ongoing", notes: "Triggers identified, managed with mild medication." },
  { condition: "Thyroid disorder (hypothyroidism)", diagnosisDate: new Date("2023-08-11"), status: "Ongoing", notes: "Taking levothyroxine, TSH under control." },
  { condition: "Childhood asthma", diagnosisDate: new Date("2009-04-20"), status: "Resolved", notes: "No symptoms for over 10 years." },
  { condition: "Mild anxiety", diagnosisDate: new Date("2023-09-17"), status: "Ongoing", notes: "Managed through counseling and meditation." },
  { condition: "Eczema", diagnosisDate: new Date("2022-03-10"), status: "Resolved", notes: "Occasional dryness, uses moisturizer." },
  { condition: "Past fracture (left arm)", diagnosisDate: new Date("2020-06-25"), status: "Resolved", notes: "Healed completely, no deformity." },
  { condition: "High cholesterol", diagnosisDate: new Date("2023-07-30"), status: "Ongoing", notes: "On dietary control, regular follow-up." },
  { condition: "Mild obesity", diagnosisDate: new Date("2024-01-02"), status: "Ongoing", notes: "Following nutrition plan, weight improving." },
  { condition: "Past malaria infection", diagnosisDate: new Date("2021-05-14"), status: "Resolved", notes: "No relapse since recovery." },
  { condition: "Acne", diagnosisDate: new Date("2024-03-25"), status: "Ongoing", notes: "Under dermatological care, improving." },
  { condition: "Vitamin B12 deficiency", diagnosisDate: new Date("2024-06-19"), status: "Resolved", notes: "On supplements, stable now." },
];

// ----------------- Helpers -----------------
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAge() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = Math.round(num * 10 + 30);
  if (num < 18) return 18;
  if (num > 65) return 65;
  return num;
}

function randomBloodGroup() {
  const r = Math.random();
  let sum = 0;
  for (let i = 0; i < bloodGroups.length; i++) {
    sum += bloodProbabilities[i];
    if (r <= sum) return bloodGroups[i];
  }
  return "O+";
}

function randomDonationHistory() {
  const history = [];
  const numDonations = Math.floor(Math.random() * 4);
  for (let i = 0; i < numDonations; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    history.push({
      type: randomChoice(["Blood", "Platelets", "Plasma"]),
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      location: randomChoice(cities).name,
      volume: 350 + Math.floor(Math.random() * 200),
    });
  }
  return history;
}

// ----------------- Seeder -----------------
const NUM_DONORS = 2000;

async function seedDonors() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    for (let i = 0; i < NUM_DONORS; i++) {
      const firstName = randomChoice(firstNames);
      const lastName = randomChoice(lastNames);
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 10000)}@example.com`;
      const password = await bcrypt.hash("password123", 10);
      const age = randomAge();
      const bloodGroup = randomBloodGroup();
      const city = randomChoice(cities);
      const isVerified = Math.random() < 0.7;
      const verifiedAt = isVerified ? new Date("2025-09-06T10:00:00Z") : null;

      // Create user
      const user = await User.create({
        username: fullName,
        email,
        password,
        role: "user",
      });

      // Create donor
      await Donor.create({
        userId: user._id,
        age,
        bloodGroup,
        lastDonation: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
        donationHistory: randomDonationHistory(),
        location: city.name,
        locationCoords: { type: "Point", coordinates: city.coords },
        phone: "9" + Math.floor(100000000 + Math.random() * 900000000),
        weight: 50 + Math.floor(Math.random() * 40),
        medicalHistory: [randomChoice(medicalHistories)],
        verifiedAt,
      });

      if (i % 100 === 0) console.log(`Seeded ${i} donors...`);
    }

    console.log(`🎉 ${NUM_DONORS} donors seeded successfully!`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDonors();
