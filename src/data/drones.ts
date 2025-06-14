
export type Drone = {
  id: string;
  name: string;
  model: string;
  status: 'Available' | 'En Route' | 'On Site' | 'Returning' | 'Charging';
  imageUrl: string;
  station: string;
};

export const drones: Drone[] = [
  {
    id: 'phoenix-1',
    name: 'Phoenix-1',
    model: 'Heavy-Lift Extinguisher',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=800',
    station: 'Alpha Station',
  },
  {
    id: 'aqua-jet-3',
    name: 'Aqua-Jet 3',
    model: 'Rapid Response Water Cannon',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1519669556878-63bd526d6878?w=800',
    station: 'Alpha Station',
  },
  {
    id: 'sky-marshal',
    name: 'Sky-Marshal',
    model: 'Surveillance & Suppression',
    status: 'Charging',
    imageUrl: 'https://images.unsplash.com/photo-1507563812226-03c2b900438a?w=800',
    station: 'Bravo Station',
  },
    {
    id: 'inferno-douser-5',
    name: 'Inferno Douser 5',
    model: 'High-Capacity Foam Dropper',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1614107775599-766d59266935?w=800',
    station: 'Bravo Station',
  },
];
