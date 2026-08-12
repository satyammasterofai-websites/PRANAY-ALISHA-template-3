import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Settings, Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ECardSettings, defaultSettings } from './types';
import { saveLargeFile, loadLargeFile } from './lib/storage';
import { OpeningPage } from './components/OpeningPage';
import { HeroSection } from './components/HeroSection';
import { AdminPanel } from './components/AdminPanel';
import { FallingEmojis } from './components/FallingEmojis';

import { Butterflies } from './components/Butterflies';

type ViewState = 'opening' | 'hero' | 'admin';

const uploadCache = new Map<string, string>();

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('opening');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [settings, setSettings] = useState<ECardSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  
  const [cardId, setCardId] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get('id') || 'main-settings';
  });

  // Load settings from Firestore or LocalStorage fallback
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, 'ecard', cardId);
        let dataToUse: any = null;

        // Fetch from Firestore first
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          dataToUse = docSnap.data();
          console.log('Loaded data from Firestore');
        } else {
          // If no Firestore data, check local storage
          const saved = localStorage.getItem('wedding-ecard-settings');
          if (saved) {
            try {
              dataToUse = JSON.parse(saved);
              console.log('Recovered data from local storage');
            } catch (e) {
              console.warn('Error parsing local storage:', e);
            }
          }
        }

        // Resolve chunked files regardless of whether it's local or firestore
        if (dataToUse) {
          const resolveUrl = async (url: string) => {
            if (url && typeof url === 'string' && url.startsWith('ecard-file://')) {
              const dataUrl = await loadLargeFile(url);
              if (dataUrl) {
                // Populate cache so we don't re-upload if we save it back
                uploadCache.set(dataUrl, url);
                return dataUrl;
              }
              return ''; // Return empty string so broken ecard-file:// doesn't show up in image src
            }
            return url;
          };
          
          if (dataToUse.heroImageUrl) dataToUse.heroImageUrl = await resolveUrl(dataToUse.heroImageUrl);
          if (dataToUse.embeddedImageUrl) dataToUse.embeddedImageUrl = await resolveUrl(dataToUse.embeddedImageUrl);
          if (dataToUse.musicUrl) dataToUse.musicUrl = await resolveUrl(dataToUse.musicUrl);
          
          if (dataToUse.eventDetails && Array.isArray(dataToUse.eventDetails)) {
            dataToUse.eventDetails = await Promise.all(dataToUse.eventDetails.map(async (e: any) => ({
              ...e,
              imageUrl: await resolveUrl(e.imageUrl)
            })));
          }

          const merged = { ...defaultSettings, ...dataToUse };
          // Migration from old openingText properties
          if (!dataToUse.textElements && dataToUse.openingText) {
            merged.textElements = [{
              id: 'migrated-1',
              text: dataToUse.openingText,
              top: dataToUse.openingTextTop ?? 20,
              left: dataToUse.openingTextLeft ?? 50,
              color: dataToUse.openingTextColor ?? '#831843',
              fontFamily: dataToUse.openingTextFontFamily ?? 'Playfair Display',
              fontSize: dataToUse.openingTextFontSize ?? 3,
              textAlign: dataToUse.openingTextAlign ?? 'center',
            }];
          }
          setSettings(merged);
        } else {
          await setDoc(docRef, defaultSettings);
        }
      } catch (error: any) {
        console.warn('Error in loadSettings:', error.message);
        // Fallback to local storage if EVERYTHING failed and we haven't already
        try {
          const saved = localStorage.getItem('wedding-ecard-settings');
          if (saved) {
            const data = JSON.parse(saved);
            const merged = { ...defaultSettings, ...data };
            if (!data.textElements && data.openingText) {
              merged.textElements = [{
                id: 'migrated-1',
                text: data.openingText,
                top: data.openingTextTop ?? 20,
                left: data.openingTextLeft ?? 50,
                color: data.openingTextColor ?? '#831843',
                fontFamily: data.openingTextFontFamily ?? 'Playfair Display',
                fontSize: data.openingTextFontSize ?? 3,
                textAlign: data.openingTextAlign ?? 'center',
              }];
            }
            setSettings(merged);
          }
        } catch (e) {
          console.warn('Error reading local storage during fallback:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [cardId]);

  // Save settings whenever they change, with a slight debounce
  useEffect(() => {
    if (isLoading) return;
    
    const timeoutId = setTimeout(() => {
      const saveSettings = async () => {
        try {
          // Check for large files and chunk them
          const prepareUrl = async (url: string, id: string) => {
            if (url && typeof url === 'string' && url.startsWith('data:') && url.length > 50000) {
               if (uploadCache.has(url)) {
                 return uploadCache.get(url)!;
               }
               const ecardUrl = await saveLargeFile(`${cardId}-${id}`, url);
               uploadCache.set(url, ecardUrl);
               return ecardUrl;
            }
            return url;
          };
          
          const settingsToSave = { ...settings };
          settingsToSave.heroImageUrl = await prepareUrl(settingsToSave.heroImageUrl, 'hero');
          settingsToSave.embeddedImageUrl = await prepareUrl(settingsToSave.embeddedImageUrl, 'embedded');
          settingsToSave.musicUrl = await prepareUrl(settingsToSave.musicUrl, 'music');
          
          if (settingsToSave.eventDetails && Array.isArray(settingsToSave.eventDetails)) {
             settingsToSave.eventDetails = await Promise.all(settingsToSave.eventDetails.map(async (e, i) => ({
                ...e,
                imageUrl: await prepareUrl(e.imageUrl, `event-${e.id || i}`)
             })));
          }

          await setDoc(doc(db, 'ecard', cardId), settingsToSave);
        } catch (error: any) {
          console.warn('Error saving settings to Firestore, falling back to local storage:', error.message);
          try {
            localStorage.setItem('wedding-ecard-settings', JSON.stringify(settings));
          } catch(e) {
            console.warn('Local storage quota exceeded, unable to save:', e);
          }
        }
      };
      saveSettings();
    }, 1000); // 1s debounce
    
    return () => clearTimeout(timeoutId);
  }, [settings, isLoading, cardId]);

  const handleSaveAndExit = async () => {
    // Force a save to local storage immediately when exiting admin panel
    try {
      localStorage.setItem('wedding-ecard-settings', JSON.stringify(settings));
    } catch(e) {
      console.warn('Error saving to local storage:', e);
    }
    
    try {
      const prepareUrl = async (url: string, id: string) => {
        if (url && typeof url === 'string' && url.startsWith('data:') && url.length > 50000) {
           if (uploadCache.has(url)) {
             return uploadCache.get(url)!;
           }
           const ecardUrl = await saveLargeFile(`${cardId}-${id}`, url);
           uploadCache.set(url, ecardUrl);
           return ecardUrl;
        }
        return url;
      };
      
      const settingsToSave = { ...settings };
      settingsToSave.heroImageUrl = await prepareUrl(settingsToSave.heroImageUrl, 'hero');
      settingsToSave.embeddedImageUrl = await prepareUrl(settingsToSave.embeddedImageUrl, 'embedded');
      settingsToSave.musicUrl = await prepareUrl(settingsToSave.musicUrl, 'music');
      
      if (settingsToSave.eventDetails && Array.isArray(settingsToSave.eventDetails)) {
         settingsToSave.eventDetails = await Promise.all(settingsToSave.eventDetails.map(async (e, i) => ({
            ...e,
            imageUrl: await prepareUrl(e.imageUrl, `event-${e.id || i}`)
         })));
      }

      await setDoc(doc(db, 'ecard', cardId), settingsToSave);
    } catch (error: any) {
      console.warn('Error saving settings to Firestore on exit:', error.message);
    }
    setCurrentView('opening');
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-stone-900 text-stone-300 gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="font-serif animate-pulse">Loading Your E-Card...</p>
      </div>
    );
  }

  const handleStartTransition = () => {
    setIsTransitioning(true);
  };

  const handleEnterCard = () => {
    setIsTransitioning(false);
    setCurrentView('hero');
    if (audioRef.current && settings.musicUrl) {
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay prevented:", err);
      });
    }
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
  };

  if (settings.paymentPending && currentView !== 'admin') {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-stone-900 p-8 text-center relative overflow-hidden selection:bg-stone-200">
        <h1 className="text-2xl md:text-4xl font-serif max-w-4xl leading-relaxed tracking-wide z-10">
          {settings.paymentPendingText || "'Pranay weds Alisha' wedding Invitation website didn't purchase yet"}
        </h1>
        <button
          onClick={handleOpenAdmin}
          className="fixed top-4 right-4 z-[60] p-3 bg-black/5 backdrop-blur-sm hover:bg-black/10 text-stone-600 hover:text-stone-900 rounded-full shadow-sm transition-all"
        >
          <Settings size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-stone-900 selection:bg-stone-200">
      {settings.musicUrl && (
        <audio ref={audioRef} src={settings.musicUrl} loop className="hidden" />
      )}
      <FallingEmojis />
      <Butterflies isOpening={currentView === 'opening' && !isTransitioning} settings={settings} />
      {currentView === 'admin' ? (
        <AdminPanel 
          settings={settings}
          setSettings={setSettings} 
          onExit={handleSaveAndExit} 
        />
      ) : (
        <>
          <AnimatePresence mode="wait">
            {currentView === 'opening' && (
              <OpeningPage 
                key="opening" 
                settings={settings}
                onClickEmbedded={handleEnterCard} 
                onStartTransition={handleStartTransition}
              />
            )}
            
            {currentView === 'hero' && (
              <HeroSection 
                key="hero" 
                settings={settings}
                onOpenAdmin={handleOpenAdmin}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
