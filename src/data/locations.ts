
export type Location = {
  name: string;
  coords: [number, number];
};

export const kadunaLocations: Location[] = [
  { name: "Kaduna Polytechnic", coords: [7.4833, 10.5333] },
  { name: "KASU", coords: [7.4497, 10.5283] },
  { name: "Ahmadu Bello University", coords: [7.6278, 11.1214] },
  { name: "Nigerian Defence Academy", coords: [7.3500, 10.4667] },
  { name: "Kaduna International Airport", coords: [7.5958, 10.6958] },
  { name: "Murtala Mohammed Square", coords: [7.4425, 10.5227] },
  { name: "Kaduna Central Market", coords: [7.4439, 10.5200] },
  { name: "Rigasa Train Station", coords: [7.3944, 10.4903] },
  { name: "Barnawa Shopping Complex", coords: [7.4083, 10.4667] },
  { name: "Sabo Tasha", coords: [7.3833, 10.4500] },
  { name: "Tudun Wada", coords: [7.4250, 10.5000] },
  { name: "Malali", coords: [7.4667, 10.5500] },
  { name: "Ungwan Rimi", coords: [7.4500, 10.5333] },
  { name: "Kawo", coords: [7.4833, 10.5667] },
  { name: "Gonin Gora", coords: [7.3500, 10.4000] },
  { name: "Television Garage", coords: [7.4000, 10.4833] },
  { name: "Command Junction", coords: [7.3667, 10.4333] },
  { name: "Kakuri", coords: [7.4000, 10.4333] },
  { name: "Narayi", coords: [7.3833, 10.5000] },
  { name: "Zaria", coords: [7.7167, 11.0833] },
];

export const droneStations: Location[] = [
    { name: "Alpha Station", coords: [7.46, 10.54] },
    { name: "Bravo Station", coords: [7.37, 10.44] },
];
