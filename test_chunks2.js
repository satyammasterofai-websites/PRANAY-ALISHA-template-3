import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

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
  let count = 0;
  snap.forEach(doc => {
    if (doc.id.startsWith('file-meta-') || doc.id.startsWith('file-chunk-')) {
      console.log("Found chunk doc:", doc.id);
      count++;
    }
  });
  console.log("Total chunks:", count);
  process.exit(0);
}
run();
