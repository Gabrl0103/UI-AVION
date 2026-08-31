export const flightData = {
  1: {
    id: 1,
    name: "Business Class",
    price: 480,
    totalSeats: 48,
    occupied: ['1C', '1D', '2B', '3F', '4E'] 
  },
  2: {
    id: 2,
    name: "Premium",
    price: 250,
    totalSeats: 48,
    occupied: ['1A', '2A', '3B', '4C', '5D', '6E', '8F']
  },
  3: {
    id: 3,
    name: "Economy",
    price: 90,
    totalSeats: 48,
    occupied: ['1B', '2C', '3D', '4A', '5F', '7A', '7B', '8C', '8D']
  }
};

export const layout = {
  rows: ['A', 'B', 'C', 'D', 'E', 'F'],
  cols: [1, 2, 3, 4, 5, 6, 7, 8]
};

export const state = {
  activeClass: 1,
  selectedSeats: [
    { id: '1A', classId: 1, price: 480 },
    { id: '2A', classId: 1, price: 480 },
    { id: '3A', classId: 1, price: 480 },
    { id: '4A', classId: 1, price: 480 }
  ] 
};
