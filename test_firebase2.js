import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcF4-qa-yr6CO0kNqx-tlLLhARV1Yxzhw",
  authDomain: "om-online-works.firebaseapp.com",
  projectId: "om-online-works",
  storageBucket: "om-online-works.firebasestorage.app",
  messagingSenderId: "110051953109",
  appId: "1:110051953109:web:3041db0feea780ea00d55c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const snap2 = await getDoc(doc(db, 'ecard', 'main-settings'));
  const data = snap2.data();
  console.log("main-settings eventDetails images:");
  if (data?.eventDetails) {
    data.eventDetails.forEach((e, i) => {
      console.log(`event ${i}:`, e.imageUrl.substring(0, 100));
    });
  }
  process.exit(0);
}
run();
