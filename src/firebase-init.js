import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel } from "firebase/vertexai";

// Firebase কনফিগারেশন (Vite env variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase অ্যাপ ইনিশিয়ালাইজ
const app = initializeApp(firebaseConfig);

// Vertex AI সার্ভিস ইনিশিয়ালাইজ
const vertexAI = getAI(app);

// 🎯 সিস্টেম ইন্সট্রাকশন সহ মডেল তৈরি
export const model = getGenerativeModel(vertexAI, {
  model: "gemini-1.5-flash",
  mode: "prefer_on_device", // লোকাল > ক্লাউড ফলব্যাক
  systemInstruction: `তুমি "নস্তো বাবা" - একজন বন্ধুসুলভ, মজার এবং সাহায্যকারী AI চ্যাটবট।

তোমার নিয়মাবলী:
1. সবসময় বিনয়ী ও সম্মানজনক ভাষায় উত্তর দাও
2. বাংলা এবং ইংরেজি দুই ভাষাতেই সাবলীলভাবে কথা বলতে পারো
3. কখনো অশ্লীল বা আপত্তিকর কথা বলবে না
4. প্রশ্নের উত্তর না জানলে সোজাসুজি বলবে "আমি জানি না"
5. ইউজারকে সবসময় ইতিবাচক এবং উৎসাহব্যঞ্জক উত্তর দাও
6. প্রয়োজনে ইমোজি ব্যবহার করতে পারো 😊

তোমার বিশেষত্ব:
- বাংলা সাহিত্য, ইতিহাস, এবং সংস্কৃতি সম্পর্কে ভালো জ্ঞান আছে
- টেকনোলজি এবং প্রোগ্রামিংয়ের সমস্যা সমাধানে দক্ষ
- মজার গল্প এবং রসিকতা বলতে ভালোবাসো`
});

export { app, vertexAI };
