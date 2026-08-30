export type InteriorImage = {
  src: string;
  alt: string;
};

export type InteriorProject = {
  id: string;
  title: string;
  images: InteriorImage[];
};

export const interiorProjects: InteriorProject[] = [
  {
    id: '3bhk-studio-apartment',
    title: '3BHK Studio Apartment',
    images: [
      { src: '/images/interior/3bhk-living-room-1.jpg', alt: '3BHK studio apartment — living room' },
      { src: '/images/interior/3bhk-living-room-2.jpg', alt: '3BHK studio apartment — living room seating' },
      { src: '/images/interior/3bhk-dining-area.jpg', alt: '3BHK studio apartment — dining area' },
      { src: '/images/interior/3bhk-tv-unit.jpg', alt: '3BHK studio apartment — TV unit' },
      { src: '/images/interior/3bhk-mandir-with-jula.jpg', alt: '3BHK studio apartment — mandir with jula swing' },
      { src: '/images/interior/3bhk-parents-bedroom-1.jpg', alt: '3BHK studio apartment — parents bedroom' },
    ],
  },
  {
    id: 'residential-show-flat',
    title: 'Residential Show Flat',
    images: [
      { src: '/images/interior/residential-show-flat-1.jpg', alt: 'Residential show flat — bedroom' },
      { src: '/images/interior/residential-show-flat-2.jpg', alt: 'Residential show flat, view 2' },
      { src: '/images/interior/residential-show-flat-3.jpg', alt: 'Residential show flat, view 3' },
    ],
  },
  {
    id: 'entrance-lobby',
    title: 'Entrance Lobby',
    images: [
      { src: '/images/interior/entrance-lobby-1.jpg', alt: 'Entrance lobby with reception desk' },
      { src: '/images/interior/entrance-lobby-2.jpg', alt: 'Entrance lobby, view 2' },
      { src: '/images/interior/entrance-lobby-3.jpg', alt: 'Entrance lobby, view 3' },
    ],
  },
  {
    id: 'cancer-care-clinic',
    title: 'Cancer Care Clinic',
    images: [
      { src: '/images/interior/cancer-care-clinic-1.jpg', alt: 'Cancer care clinic — reception' },
      { src: '/images/interior/cancer-care-clinic-2.jpg', alt: 'Cancer care clinic, view 2' },
      { src: '/images/interior/cancer-care-clinic-3.jpg', alt: 'Cancer care clinic, view 3' },
      { src: '/images/interior/cancer-care-clinic-4.jpg', alt: 'Cancer care clinic, view 4' },
      { src: '/images/interior/cancer-care-clinic-5.jpg', alt: 'Cancer care clinic, view 5' },
      { src: '/images/interior/cancer-care-clinic-7.jpg', alt: 'Cancer care clinic, view 7' },
    ],
  },
];
