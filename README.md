# 📚 RuangPerpus — Library Management App

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A full-stack **Library Management System** built with vanilla JavaScript, featuring a mock REST API backend and complete **CRUD** operations for book inventory management.

**[🔗 Live Demo](https://libraryapp-chendramuhammad.netlify.app/client/index.html)**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **📖 View Books** | Displays all books in a clean table with title, author, year, and stock |
| **➕ Add Book** | Form-based input to add new books to the library database |
| **✏️ Edit Book** | Pre-filled edit form — update any book's details |
| **🗑️ Delete Book** | One-click removal with confirmation dialog |
| **⚡ Real-time UI** | All CRUD operations update the table instantly without page refresh |
| **🧪 Test Coverage** | Jest test suite covering all CRUD flows |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| **Styling** | Tailwind CSS (CDN) + Font Awesome icons |
| **Backend** | json-server — mock REST API |
| **Database** | `server/db.json` — pre-seeded Indonesian literature books |
| **Testing** | Jest + jsdom + @testing-library/dom |
| **Deployment** | Netlify |

## 🚀 Getting Started

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

## 📁 Project Structure

```
ruangperpus-library-app/
├── client/
│   ├── index.html          # App shell (Tailwind CSS styling)
│   └── index.js            # Main app logic (CRUD, DOM, API calls)
├── server/
│   ├── db.json             # Books database (json-server)
│   └── initial.json        # Initial seed data (for tests)
├── main.test.js            # Jest test suite
├── jest.config.js          # Jest configuration
├── jest-setup.js           # Jest setup (jsdom, globals)
├── package.json            # Dependencies & scripts
└── README.md               # This file
```

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ by <strong>Chendra Muhammad Azhari Sofyan</strong>
</p>
