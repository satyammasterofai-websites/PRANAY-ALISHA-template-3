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
    console.log(`\nDoc: ${doc.id}`);
    console.log(` hero: ${data.heroImageUrl?.substring(0, 50)}`);
    console.log(` embedded: ${data.embeddedImageUrl?.substring(0, 50)}`);
    if (data.eventDetails) {
      data.eventDetails.forEach((e, i) => {
        console.log(` event ${i}: ${e.imageUrl?.substring(0, 50)}`);
      });
    }
  });
  process.exit(0);
}
run();
