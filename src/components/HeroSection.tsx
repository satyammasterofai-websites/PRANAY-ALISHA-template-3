import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ECardSettings } from '../types';
import { ScratchCardSection } from './ScratchCardSection';
import { MoveDown, MapPin, Settings } from 'lucide-react';

interface Props {
  onOpenAdmin?: () => void;
  settings: ECardSettings;
  key?: string;
}

export function HeroSection({ settings, onOpenAdmin }: Props) {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordSubmit = () => {
    if (password === '4260980201') {
      if (onOpenAdmin) onOpenAdmin();
      setShowPasswordInput(false);
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="relative w-full h-full min-h-full overflow-y-auto"
      style={{ backgroundColor: settings.sectionsBgColor || '#fdf2f8' }}
    >
      <div className="w-full flex flex-col items-center">
        {/* Hero Image Section (3:2 approx if desired, but user wants it to fit in hero section) */}
        <div className="w-full flex flex-col items-center justify-center shrink-0">
          {settings.heroImageUrl ? (
            <img
              src={settings.heroImageUrl}
              className="w-full h-auto block"
              alt="Wedding Hero"
              referrerPolicy="no-referrer"
              
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/1920x1080/fce7f3/f9a8d4?text=Invalid+Hero+Image+URL';
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-[60vh] text-stone-400 font-serif">
              No Hero Image Set
            </div>
          )}
        </div>

        {/* Scroll Down Indicator */}
        <div className="w-full flex flex-col items-center justify-center py-6  gap-2">
          <span className="text-xs tracking-widest text-stone-400 uppercase font-serif">Scroll Down</span>
          <MoveDown className="w-5 h-5 text-stone-400" strokeWidth={1} />
        </div>

        {/* Scratch Card Section */}
        <ScratchCardSection targetDate={settings.targetDate} settings={settings} />

        {/* Event Details Section */}
        {settings.eventDetails && settings.eventDetails.length > 0 && (
          <div 
            className="w-full min-h-screen py-10 relative overflow-hidden flex flex-col items-center"
            style={{ backgroundColor: settings.eventsBgColor || '#0a4226' }}
          >
            {/* Emojis in corners */}
            <motion.div className="absolute top-4 left-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>🌿</motion.div>
            <motion.div className="absolute top-4 right-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, 10, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>🌸</motion.div>
            <motion.div className="absolute bottom-4 left-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, -8, 0], rotate: [0, 8, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>🌼</motion.div>
            <motion.div className="absolute bottom-4 right-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, 12, 0], rotate: [0, -10, 10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>☘️</motion.div>

            <h2 
              className="text-4xl md:text-5xl mb-12 tracking-widest text-center font-bold drop-shadow-lg"
              style={{ 
                color: settings.eventsSectionHeadingColor || settings.eventsHeadingColor || '#be185d',
                fontFamily: settings.eventsSectionHeadingFont || 'Cinzel' 
              }}
            >
              EVENT DETAILS
            </h2>

            <div className="w-full max-w-4xl px-4 flex flex-col gap-16 pb-20">
              {settings.eventDetails.map((event, index) => (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="w-full flex flex-col items-center"
                >
                  <h3 
                    className="text-3xl md:text-4xl font-['Dancing_Script',cursive] mb-6 drop-shadow-md text-center"
                    style={{ color: settings.eventsImageHeadingColor || settings.eventsHeadingColor || '#be185d' }}
                  >
                    {event.heading}
                  </h3>
                  <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src={event.imageUrl} 
                      alt={event.heading}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover"
                      
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/1920x1080/064e3b/d1fae5?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                  {event.directionUrl && (
                    <a 
                      href={event.directionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 px-8 py-3 bg-[#be185d] text-white rounded-full font-serif tracking-widest shadow-lg hover:bg-[#9d174d] hover:scale-105 transition-all text-sm sm:text-base font-semibold flex items-center gap-2"
                    >
                      <MapPin className="w-5 h-5" />
                      GET DIRECTION
                    </a>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Map Integration Section */}
            {settings.showMap !== false && (
              <>
                <div className="w-full flex justify-center items-center py-16 gap-2 text-stone-400/60 font-bold tracking-widest relative z-10">
                  <span>----------</span>
                  <span className="text-2xl">🌸</span>
                  <span>----------</span>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="w-full flex flex-col items-center mt-20 relative z-10 max-w-4xl mx-auto px-4"
              >
                <h3 
                  className="text-3xl md:text-5xl mb-2 tracking-widest text-center font-bold drop-shadow-md"
                  style={{ 
                    color: settings.eventsSectionHeadingColor || settings.eventsHeadingColor || '#be185d',
                    fontFamily: settings.eventsSectionHeadingFont || 'Cinzel' 
                  }}
                >
                  {settings.mapHeading || 'Where we Celebrate'}
                </h3>
                
                {settings.mapSubHeading && (
                  <p 
                    className="text-lg md:text-xl font-['Montserrat',sans-serif] mb-8 text-center bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 bg-clip-text text-transparent drop-shadow-sm font-semibold tracking-[0.2em] uppercase"
                  >
                    {settings.mapSubHeading}
                  </p>
                )}

                <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-white border-4 border-yellow-500/30 aspect-video relative">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.mapAddress || 'Grand Banquet Hall, New York')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    title="Event Location Map"
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
                
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.mapAddress || 'Grand Banquet Hall, New York')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-white rounded-full font-serif tracking-widest shadow-[0_4px_15px_rgba(234,179,8,0.4)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.6)] hover:scale-105 transition-all text-sm sm:text-base font-bold flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  GET DIRECTION
                </a>
              </motion.div>
              </>
            )}
          </div>
        )}

        {/* Flower Separator */}
        <div className="w-full flex justify-center items-center py-8 gap-2 text-stone-400 font-bold tracking-widest relative z-10 ">
          <span>----------</span>
          <span className="text-2xl">🌸</span>
          <span>----------</span>
        </div>

        {/* Celebration Section */}
        <div 
          className="w-full py-24 relative overflow-hidden flex flex-col items-center justify-center px-6 text-center "
        >
          {/* Emojis in corners - similar theme as above */}
          <motion.div className="absolute top-4 left-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>🌿</motion.div>
          <motion.div className="absolute top-4 right-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, 10, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>🌸</motion.div>
          <motion.div className="absolute bottom-4 left-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, -8, 0], rotate: [0, 8, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>🌼</motion.div>
          <motion.div className="absolute bottom-4 right-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, 12, 0], rotate: [0, -10, 10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>☘️</motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <h3 
              className="text-2xl md:text-4xl font-bold tracking-widest drop-shadow-md px-4"
              style={{ 
                color: settings.eventsSectionHeadingColor || settings.eventsHeadingColor || '#be185d',
                fontFamily: settings.eventsSectionHeadingFont || 'Cinzel' 
              }}
            >
              We Can't Wait to Celebrate With You
            </h3>
            
            <div 
              className="text-4xl md:text-5xl"
              style={{ color: settings.eventsSectionHeadingColor || settings.eventsHeadingColor || '#be185d' }}
            >
              ❀
            </div>
            
            <p 
              className="text-2xl md:text-3xl max-w-2xl leading-relaxed drop-shadow-sm font-['Dancing_Script',cursive] px-4"
              style={{ color: settings.eventsImageHeadingColor || settings.eventsHeadingColor || '#be185d' }}
            >
              Two hearts, one promise, and a party that needs you there!
            </p>
          </motion.div>
        </div>

        {/* Flower Separator */}
        <div className="w-full flex justify-center items-center py-8 gap-2 text-stone-400 font-bold tracking-widest relative z-10 ">
          <span>----------</span>
          <span className="text-2xl">🌸</span>
          <span>----------</span>
        </div>

        {/* Family Invite Section */}
        <div 
          className="w-full py-12 relative overflow-hidden flex flex-col items-center justify-center px-6 text-center"
          style={{ backgroundColor: settings.familyInviteBgColor || 'transparent' }}
        >
          <motion.div className="absolute top-4 left-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>🌿</motion.div>
          <motion.div className="absolute top-4 right-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, 10, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>🌸</motion.div>
          <motion.div className="absolute bottom-4 left-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, -8, 0], rotate: [0, 8, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>🌼</motion.div>
          <motion.div className="absolute bottom-4 right-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, 12, 0], rotate: [0, -10, 10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>☘️</motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <h3 className="text-xl md:text-2xl tracking-[0.2em] font-serif mb-2" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>
              {settings.familyInviteHeading}
            </h3>
            <p className="text-3xl md:text-4xl font-['Dancing_Script',cursive]" style={{ color: settings.eventsImageHeadingColor || '#be185d' }}>
              {settings.familyInviteSubHeading1}
            </p>
            <div className="text-3xl my-2" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>❀</div>
            <p className="text-sm md:text-base tracking-[0.15em] font-medium uppercase" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>
              {settings.familyInviteSubHeading2}
            </p>
            <div className="text-3xl my-2" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>❀</div>
            <p className="text-xl md:text-2xl font-serif font-bold tracking-wide" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>
              {settings.familyInviteSubHeading3}
            </p>
          </motion.div>
        </div>

        {/* Flower Separator */}
        <div className="w-full flex justify-center items-center py-8 gap-2 text-stone-400 font-bold tracking-widest relative z-10 ">
          <span>----------</span>
          <span className="text-2xl">🌸</span>
          <span>----------</span>
        </div>

        {/* Contact Details Section */}
        <div 
          className="w-full py-12 relative overflow-hidden flex flex-col items-center justify-center px-6 text-center"
          style={{ backgroundColor: settings.contactBgColor || 'transparent' }}
        >
          <motion.div className="absolute top-4 left-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>🌿</motion.div>
          <motion.div className="absolute top-4 right-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, 10, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>🌸</motion.div>
          <motion.div className="absolute bottom-4 left-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, -8, 0], rotate: [0, 8, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>🌼</motion.div>
          <motion.div className="absolute bottom-4 right-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, 12, 0], rotate: [0, -10, 10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>☘️</motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <h3 className="text-lg md:text-xl tracking-[0.2em] font-bold uppercase mb-4" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>
              {settings.contactHeading}
            </h3>
            <div className="text-3xl mb-4" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>❀</div>
            <p className="text-xl md:text-2xl font-serif font-bold tracking-widest uppercase" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>
              {settings.contactName}
            </p>
            <p className="text-lg md:text-xl font-serif tracking-widest mt-2" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>
              {settings.contactPhone}
            </p>
            <p className="text-base md:text-lg font-serif mt-4 max-w-md mx-auto leading-relaxed" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>
              {settings.contactAddress}
            </p>
          </motion.div>
        </div>

        {/* Flower Separator */}
        <div className="w-full flex justify-center items-center py-8 gap-2 text-stone-400 font-bold tracking-widest relative z-10 ">
          <span>----------</span>
          <span className="text-2xl">🌸</span>
          <span>----------</span>
        </div>

        {/* Footer Invite Section */}
        <div 
          className="w-full py-16 relative overflow-hidden flex flex-col items-center justify-center px-6 text-center"
          style={{ backgroundColor: settings.footerInviteBgColor || 'transparent' }}
        >
          <motion.div className="absolute top-4 left-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>🌿</motion.div>
          <motion.div className="absolute top-4 right-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, 10, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>🌸</motion.div>
          <motion.div className="absolute bottom-4 left-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, -8, 0], rotate: [0, 8, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>🌼</motion.div>
          <motion.div className="absolute bottom-4 right-4 text-xl pointer-events-none z-10 opacity-40" animate={{ y: [0, 12, 0], rotate: [0, -10, 10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>☘️</motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <h3 className="text-lg md:text-xl tracking-[0.2em] font-serif uppercase" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>
              {settings.footerInviteHeading}
            </h3>
            <p className="text-4xl md:text-6xl font-['Dancing_Script',cursive] font-bold tracking-wider py-2" style={{ color: settings.eventsImageHeadingColor || '#be185d' }}>
              {settings.footerInviteNames}
            </p>
            <div className="text-4xl my-2 drop-shadow-sm">💐</div>
            <p className="text-xl md:text-2xl font-serif font-bold tracking-[0.1em]" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>
              {settings.footerInviteDate}
            </p>
            <p className="text-sm md:text-base tracking-[0.2em] font-serif mt-4 font-bold uppercase" style={{ color: settings.eventsSectionHeadingColor || '#be185d' }}>
              {settings.footerInviteFamilies}
            </p>
          </motion.div>
        </div>

        {/* Bottom Line & Credit */}
        <div className="w-full flex flex-col items-center justify-center pb-12 pt-4  relative z-10">
          <div className="w-2/3 max-w-md h-px bg-stone-400/50 mb-6"></div>
          <p className="text-xs md:text-sm font-sans tracking-widest text-stone-500/80 flex items-center gap-2">
            Crafted with 🩷 by digiinvitations_
          </p>
          {onOpenAdmin && (
            <div className="mt-6 flex flex-col items-center">
              {showPasswordInput ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Admin Password"
                      className="px-3 py-2 text-sm border border-stone-300 rounded-md bg-white text-stone-700 outline-none focus:border-stone-500 shadow-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                    />
                    <button
                      onClick={handlePasswordSubmit}
                      className="px-4 py-2 text-sm bg-stone-800 text-white rounded-md hover:bg-stone-900 transition-colors shadow-sm"
                    >
                      Enter
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordInput(false);
                        setPassword('');
                        setPasswordError(false);
                      }}
                      className="px-4 py-2 text-sm bg-white text-stone-600 border border-stone-200 rounded-md hover:bg-stone-50 transition-colors shadow-sm"
                    >
                      Cancel
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-xs">Incorrect password</p>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowPasswordInput(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm text-stone-500/80 hover:text-stone-800 transition-colors bg-white/50 hover:bg-white/80 rounded-full border border-stone-200 shadow-sm"
                  aria-label="Open Admin Panel"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin Panel</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
