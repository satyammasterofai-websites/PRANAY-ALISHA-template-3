import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
  const snap = await getDocs(collection(db, 'ecard'));
  snap.forEach(doc => {
    const data = doc.data();
    if (data.heroImageUrl?.includes('ecard-file://')) console.log(`${doc.id} has ecard-file in hero`);
    if (data.embeddedImageUrl?.includes('ecard-file://')) console.log(`${doc.id} has ecard-file in embedded`);
    if (data.eventDetails) {
      data.eventDetails.forEach((e, i) => {
        if (e.imageUrl?.includes('ecard-file://')) console.log(`${doc.id} has ecard-file in event ${i}`);
      });
    }
  });
  process.exit(0);
}
run();
