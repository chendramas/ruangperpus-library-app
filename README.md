# RuangPerpus - Library Management App

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A full-stack **Library Management System** built with vanilla JavaScript, featuring a serverless REST API backend and complete **CRUD** operations for book inventory management.

**[Live Demo](https://ruangperpus-library-app.vercel.app)**

---

## Tentang Aplikasi

**RuangPerpus** adalah aplikasi manajemen inventaris buku perpustakaan yang dirancang untuk memudahkan pustakawan atau admin dalam mengelola data koleksi buku. Aplikasi ini menyediakan antarmuka yang bersih dan responsif untuk melakukan operasi CRUD (Create, Read, Update, Delete) pada database buku.

### Use Case

- **Pustakawan/Admin** dapat menambahkan buku baru ke dalam sistem
- **Pustakawan/Admin** dapat melihat daftar seluruh buku yang tersedia
- **Pustakawan/Admin** dapat mengedit informasi buku (judul, penulis, tahun terbit, jumlah stok)
- **Pustakawan/Admin** dapat menghapus buku dari inventaris

### Data yang Dikelola

| Field | Tipe | Deskripsi |
|-------|------|-----------|
| `title` | string | Judul buku |
| `author` | string | Nama penulis |
| `year` | number | Tahun terbit |
| `quantity` | number | Jumlah stok yang tersedia |

### Keunggulan

- **Vanilla JavaScript** - Murni ES6+ dengan DOM manipulation, tanpa framework
- **Dark Theme** - Desain modern dengan konsistensi warna dan UX yang baik
- **XSS Protection** - Semua output di-escape untuk mencegah script injection
- **Confirmation Dialog** - Konfirmasi sebelum menghapus data
- **Responsive** - Dapat diakses dari berbagai ukuran layar
- **Tested** - 6 test case yang covers semua alur CRUD

---

## Features

| Feature | Description |
|---------|-------------|
| **View Books** | Menampilkan daftar buku dalam tabel dengan judul, penulis, tahun, dan stok |
| **Add Book** | Form input untuk menambahkan buku baru ke database |
| **Edit Book** | Form edit dengan data yang sudah terisi - update informasi buku |
| **Delete Book** | Hapus buku dengan konfirmasi dialog |
| **Real-time UI** | Semua operasi CRUD update tabel secara instan tanpa refresh halaman |
| **Test Coverage** | Jest test suite yang covers semua alur CRUD |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| **Styling** | Tailwind CSS (CDN) + Font Awesome icons |
| **Backend** | Vercel Serverless Functions (production) / json-server (local) |
| **Database** | In-memory (production) / `server/db.json` (local) |
| **Testing** | Jest + jsdom + @testing-library/dom |
| **Deployment** | Vercel (frontend + API) |

## Getting Started

### Prerequisites

- Node.js (v14+)

### Installation

```bash
git clone https://github.com/chendramas/ruangperpus-library-app.git
cd ruangperpus-library-app
npm install
```

### Running Locally

```bash
npm start
```

This starts both the API server (port 3333) and client (port 3000) concurrently.

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Running Tests

```bash
npm test         # silent mode
npm run test:debug   # verbose mode
```

## API Reference

### Local Development (json-server)

The REST API runs on `http://localhost:3333` via **json-server**.

### Production (Vercel Serverless)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/books` | List all books |
| `POST` | `/api/books` | Add a new book |
| `PUT` | `/api/books/:id` | Update a book by ID |
| `DELETE` | `/api/books/:id` | Delete a book by ID |

### Request Body Format (POST/PUT)

```json
{
  "title": "string",
  "author": "string",
  "year": "number",
  "quantity": "number"
}
```

## Project Structure

```
ruangperpus-library-app/
├── api/
│   ├── books.js            # Vercel serverless: GET/POST /api/books
│   └── books/
│       └── [id].js         # Vercel serverless: GET/PUT/DELETE /api/books/:id
├── client/
│   ├── index.html          # App shell (Tailwind CSS styling)
│   └── index.js            # Main app logic (CRUD, DOM, API calls)
├── server/
│   ├── db.json             # Books database (json-server, local dev)
│   └── initial.json        # Initial seed data (for tests)
├── main.test.js            # Jest test suite
├── jest.config.js          # Jest configuration
├── jest-setup.js           # Jest setup (jsdom, globals)
├── vercel.json             # Vercel deployment config
├── package.json            # Dependencies & scripts
└── README.md               # This file
```

## License

This project is licensed under the MIT License.

---

<p align="center">
  Built with care by <strong>Chendra Muhammad Azhari Sofyan</strong>
</p>
