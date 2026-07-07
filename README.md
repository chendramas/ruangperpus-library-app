# 📚 RuangPerpus — Library Management App

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Netlify](https://img.shields.io/badge/deployed-Netlify-brightgreen)

A full-stack **Library Management System** built with vanilla JavaScript, featuring a mock REST API backend and complete **CRUD** operations for book inventory management. Originally developed as a final project, now polished as a portfolio showcase.

**[🔗 Live Demo](https://libraryapp-chendramuhammad.netlify.app/client/index.html)** — deployed on Netlify

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **📖 View Books** | Displays all books in a clean table with title, author, year, and stock |
| **➕ Add Book** | Form-based input to add new books to the library database |
| **✏️ Edit Book** | Pre-filled edit form — update any book's details |
| **🗑️ Delete Book** | One-click removal of books from the inventory |
| **⚡ Real-time UI** | All CRUD operations update the table instantly without page refresh |
| **🧪 Test Coverage** | 7 Jest test cases covering all CRUD flows and deployment verification |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| **Styling** | Tailwind CSS (CDN) + Font Awesome icons |
| **Backend** | json-server — mock REST API |
| **Database** | `library-db.json` — 15 seeded Indonesian literature books |
| **Testing** | Jest + jsdom + @testing-library/dom |
| **Deployment** | Netlify |
| **Package Manager** | pnpm / npm |

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- pnpm _(recommended)_ or npm

### Installation

```bash
# Clone the repo
git clone https://github.com/chendra-mas/ruangperpus-library-app.git
cd ruangperpus-library-app

# Install dependencies
pnpm install
```

### Running Locally

Start both the API server and client concurrently:

```bash
# Start backend (json-server on port 3333)
pnpm start:server

# In another terminal, start frontend (port 3000)
pnpm start:client
```

Or use the combined command:

```bash
pnpm start
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Running Tests

```bash
pnpm test         # silent mode
pnpm test:debug   # verbose mode
```

All **7 test cases** must pass to verify the application is working correctly.

## 📡 API Reference

The REST API runs on `http://localhost:3333` via **json-server**.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/books` | List all books |
| `POST` | `/books` | Add a new book |
| `PUT` | `/books/:id` | Update a book by ID |
| `DELETE` | `/books/:id` | Delete a book by ID |

### Request Body Format (POST/PUT)

```json
{
  "title": "string",
  "author": "string",
  "year": "number",
  "quantity": "number"
}
```

## 🗃️ Sample Data

The database comes pre-seeded with 15 classic Indonesian literary works:

- **Laskar Pelangi** — Andrea Hirata
- **Bumi Manusia** — Pramoedya Ananta Toer
- **Dilan: Dia adalah Dilanku Tahun 1990** — Pidi Baiq
- **Negeri 5 Menara** — Ahmad Fuadi
- And 12 more titles spanning modern and classic Indonesian literature.

## 📸 Screenshots

> _Add screenshots here. Recommended:_
> - Home page with book table
> - Add book form
> - Edit book form with pre-filled data
> - Mobile responsive view

## 🧪 Test Suite

Tests validate:

- ✅ API fetch on page load (`GET /books`)
- ✅ Correct rendering of 15 seeded books
- ✅ Delete book flow (click → API call → re-render)
- ✅ Edit navigation and pre-filled form
- ✅ Edit submission (PUT request + updated render)
- ✅ Add navigation and new book POST
- ✅ Deployed site verification (student name + ID present)

## 🌐 Deployment

This app is deployed on **Netlify**:

**🔗 [libraryapp-chendramuhammad.netlify.app](https://libraryapp-chendramuhammad.netlify.app/client/index.html)**

To deploy your own fork:

1. Push to GitHub
2. Connect repo to Netlify
3. Set build command to `pnpm install`
4. Set publish directory to `./client`

## 📁 Project Structure

```
ruangperpus-library-app/
├── client/
│   ├── index.html          # App shell (Tailwind CSS styling)
│   └── index.js            # Main app logic (CRUD, DOM, API calls)
├── server/
│   ├── db.json             # Books database (json-server)
│   └── initial.json        # Initial seed data (for tests)
├── main.test.js            # Jest test suite (7 test cases)
├── jest.config.js          # Jest configuration
├── jest-setup.js           # Jest setup (jsdom, globals)
├── deployData.js           # Deployment verification data
├── package.json            # Dependencies & scripts
└── README.md               # This file
```

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ by <strong>Chendra Muhammad Azhari Sofyan</strong>
</p>