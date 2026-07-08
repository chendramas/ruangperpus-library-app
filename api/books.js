let books = [
  { id: 1, title: "Laskar Pelangi", author: "Andrea Hirata", year: 2005, quantity: 3 },
  { id: 2, title: "Negeri 5 Menara", author: "Ahmad Fuadi", year: 2009, quantity: 5 },
  { id: 3, title: "Dilan: Dia adalah Dilanku Tahun 1990", author: "Pidi Baiq", year: 2014, quantity: 2 },
  { id: 4, title: "Ayat-Ayat Cinta", author: "Habiburrahman El Shirazy", year: 2004, quantity: 7 },
  { id: 5, title: "Bumi Manusia", author: "Pramoedya Ananta Toer", year: 1980, quantity: 4 },
  { id: 6, title: "Laut Bercermin", author: "Remy Sylado", year: 1994, quantity: 1 },
  { id: 7, title: "Sang Pemimpi", author: "Andrea Hirata", year: 2006, quantity: 6 },
  { id: 8, title: "Pulang", author: "Tere Liye", year: 2016, quantity: 9 },
  { id: 9, title: "Perahu Kertas", author: "Dee Lestari", year: 2009, quantity: 2 },
  { id: 10, title: "Sepotong Hati yang Baru", author: "Tere Liye", year: 2010, quantity: 3 },
  { id: 11, title: "Ketika Cinta Bertasbih", author: "Habiburrahman El Shirazy", year: 2004, quantity: 4 },
  { id: 12, title: "Cinta di Dalam Gelas", author: "Andrea Hirata", year: 2005, quantity: 6 },
  { id: 13, title: "Ayah", author: "Andrea Hirata", year: 2010, quantity: 2 },
  { id: 14, title: "Ronggeng Dukuh Paruk", author: "Ahmad Tohari", year: 1982, quantity: 8 },
  { id: 15, title: "Lelaki Harimau", author: "Eka Kurniawan", year: 2004, quantity: 3 },
  { id: 16, title: "Quantitative Trading", author: "Jim Simons", year: 2026, quantity: 2 }
];

let nextId = 17;

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(books);
  }

  if (req.method === 'POST') {
    const book = { ...req.body, id: nextId++ };
    books.push(book);
    return res.status(201).json(book);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
