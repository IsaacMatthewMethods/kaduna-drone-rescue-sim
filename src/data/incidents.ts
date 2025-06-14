
export type Incident = {
  id: number;
  location: string;
  coords: [number, number];
  status: 'Reported' | 'In Progress' | 'Resolved';
  report: string;
  timestamp: string;
};

export const incidents: Incident[] = [
  {
    id: 1,
    location: 'Kaduna Central Market',
    coords: [7.4439, 10.5200],
    status: 'Reported',
    report: 'Smoke seen coming from the electronics section.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    location: 'KASU',
    coords: [7.4497, 10.5283],
    status: 'Reported',
    report: 'Small grass fire reported near the faculty of science.',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
];
