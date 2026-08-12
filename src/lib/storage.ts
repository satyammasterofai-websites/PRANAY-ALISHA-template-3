import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CHUNK_SIZE = 900000; // 900KB per chunk

export async function saveLargeFile(id: string, dataUrl: string): Promise<string> {
  const chunks = Math.ceil(dataUrl.length / CHUNK_SIZE);
  
  // Save metadata
  await setDoc(doc(db, 'ecard', `file-meta-${id}`), {
    chunks,
    timestamp: Date.now()
  });

  // Save chunks
  for (let i = 0; i < chunks; i++) {
    const chunkData = dataUrl.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    await setDoc(doc(db, 'ecard', `file-chunk-${id}-${i}`), {
      data: chunkData
    });
  }
  
  return `ecard-file://${id}`;
}

export async function loadLargeFile(id: string): Promise<string | null> {
  if (!id.startsWith('ecard-file://')) return id;
  const actualId = id.replace('ecard-file://', '');
  
  try {
    const metaSnap = await getDoc(doc(db, 'ecard', `file-meta-${actualId}`));
    if (!metaSnap.exists()) return null;
    
    const chunks = metaSnap.data().chunks;
    let dataUrl = '';
    
    for (let i = 0; i < chunks; i++) {
      const chunkSnap = await getDoc(doc(db, 'ecard', `file-chunk-${actualId}-${i}`));
      if (chunkSnap.exists()) {
        dataUrl += chunkSnap.data().data;
      }
    }
    
    return dataUrl;
  } catch (e) {
    console.error("Error loading large file:", e);
    return null;
  }
}
