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
  const metaSnap = await getDoc(doc(db, 'ecard', 'file-meta-main-settings-hero'));
  console.log("main-settings-hero exists?", metaSnap.exists());
  
  const snap2 = await getDoc(doc(db, 'ecard', 'main-settings'));
  console.log("main-settings heroImageUrl:", snap2.data()?.heroImageUrl);
  
  process.exit(0);
}
run();
