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
  const snap = await getDoc(doc(db, 'ecard', 'remix-mspz34lk-2xmyo'));
  const snap2 = await getDoc(doc(db, 'ecard', 'remix-msq115e2-06eoh'));
  
  const h1 = snap.data()?.heroImageUrl;
  console.log("remix1 heroImageUrl:", h1 ? h1.substring(0, 100) : null);
  
  const h2 = snap2.data()?.heroImageUrl;
  console.log("remix2 heroImageUrl:", h2 ? h2.substring(0, 100) : null);
  
  process.exit(0);
}
run();
