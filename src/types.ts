export interface TextElement {
  id: string;
  text: string;
  top: number;
  left: number;
  color: string;
  fontFamily: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
}

export interface EventDetail {
  id: string;
  heading: string;
  imageUrl: string;
  directionUrl?: string;
}

export interface ECardSettings {
  remixOf?: string;
  openingBgColor: string;
  embeddedImageUrl: string;
  embeddedImageTop: number;
  embeddedImageLeft: number;
  embeddedImageWidth: number;
  textElements: TextElement[];
  heroImageUrl: string;
  musicUrl: string;
  targetDate: string;
  eventDetails: EventDetail[];
  eventsBgColor: string;
  eventsSectionHeadingColor?: string;
  eventsSectionHeadingFont?: string;
  eventsImageHeadingColor?: string;
  eventsHeadingColor?: string; // keeping for backward compatibility
  sectionsBgColor?: string;
  mapHeading?: string;
  mapSubHeading?: string;
  mapAddress?: string;
  showMap?: boolean;
  
  // New section options
  familyInviteHeading?: string;
  familyInviteSubHeading1?: string;
  familyInviteSubHeading2?: string;
  familyInviteSubHeading3?: string;
  familyInviteBgColor?: string;
  
  contactHeading?: string;
  contactName?: string;
  contactPhone?: string;
  contactAddress?: string;
  contactBgColor?: string;
  
  footerInviteHeading?: string;
  footerInviteNames?: string;
  footerInviteDate?: string;
  footerInviteFamilies?: string;
  footerInviteBgColor?: string;
}

export const defaultSettings: ECardSettings = {
  openingBgColor: '#fce7f3',
  embeddedImageUrl: 'https://images.unsplash.com/photo-1607198179219-cd8b835fdda3?q=80&w=800&auto=format&fit=crop', // Default fallback ring image
  embeddedImageTop: 50,
  embeddedImageLeft: 50,
  embeddedImageWidth: 25,
  textElements: [
    {
      id: 'default-1',
      text: 'You are invited!',
      top: 20,
      left: 50,
      color: '#831843',
      fontFamily: 'Playfair Display',
      fontSize: 3,
      textAlign: 'center',
    }
  ],
  heroImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop',
  musicUrl: '',
  targetDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  eventDetails: [
    {
      id: 'event-1',
      heading: 'The Ceremony',
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
      directionUrl: '',
    }
  ],
  eventsBgColor: '#0a4226',
  eventsSectionHeadingColor: '#be185d',
  eventsSectionHeadingFont: 'Cinzel',
  eventsImageHeadingColor: '#be185d',
  eventsHeadingColor: '#be185d',
  sectionsBgColor: '#fdf2f8',
  mapHeading: 'Where we Celebrate',
  mapSubHeading: 'Grand Banquet Hall',
  mapAddress: 'Grand Banquet Hall, New York',
  showMap: true,
  familyInviteHeading: 'WITH LOVE',
  familyInviteSubHeading1: 'The Families',
  familyInviteSubHeading2: 'AWAITING YOUR GRACIOUS PRESENCE',
  familyInviteSubHeading3: 'The Namdev & Mehta Kapadia',
  familyInviteBgColor: '',
  contactHeading: 'CONTACT DETAILS:',
  contactName: 'RAKESH KAPADIA',
  contactPhone: '+91 9456411569',
  contactAddress: 'Address: 42 Lotus Heights, Bandra West, Mumbai 400050',
  contactBgColor: '',
  footerInviteHeading: 'WITH LOVE',
  footerInviteNames: 'AMBIKA & RAKESH',
  footerInviteDate: '12th July 2026',
  footerInviteFamilies: 'NAMDEV & KAPADIA FAMILIES',
  footerInviteBgColor: '',
};
