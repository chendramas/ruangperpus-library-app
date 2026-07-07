let currentPage = 'home';
let currentBook = null;
let books = [];
let rows = '';
let formInput = '';

const API_URL = 'http://localhost:3333/books';
const main = document.querySelector('main');

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
  errorDiv.textContent = message;
  main.prepend(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

const pageListMainContent = `<div class="flex items-center justify-between mb-4">
  <h2 class="text-2xl font-bold">Daftar Buku Perpustakaan</h2>
  <div id="loadingIndicator" class="hidden">
    <i class="fas fa-spinner fa-spin text-green-500"></i>
  </div>
</div>

<table class="min-w-full border border-gray-300">
  <thead>
    <tr class="table-header">
      <th class="px-6 py-3 border-b text-left">Judul</th>
      <th class="px-6 py-3 border-b text-left">Penulis</th>
      <th class="px-6 py-3 border-b text-left">Tahun Terbit</th>
      <th class="px-6 py-3 border-b text-left">Jumlah</th>
      <th class="px-6 py-3 border-b text-center">Action</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>

<div id="errorContainer" class="hidden"></div>`;

const pageEditBookMainContent = `<h2 class="text-2xl font-bold mb-4">Edit Buku</h2>

<form class="max-w-sm mx-auto" onsubmit="return handleEditForm(event)">
</form>
`;

const pageAddBookMainContent = `<h2 class="text-2xl font-bold mb-4">Tambah Buku</h2>

<form class="max-w-sm mx-auto" onsubmit="return handleAddForm(event)">
  <div class="mb-4">
    <label for="title" class="font-semibold mb-2">Judul Buku</label>
    <input required type="text" id="title" name="title" class="w-full" />
  </div>
  <div class="mb-4">
    <label for="author" class="font-semibold mb-2">Penulis Buku</label>
    <input required type="text" id="author" name="author" class="w-full" />
  </div>
  <div class="mb-4">
    <label for="year" class="font-semibold mb-2">Tahun Terbit</label>
    <input required type="number" id="year" name="year" class="w-full" />
  </div>
  <div class="mb-4">
    <label for="quantity" class="font-semibold mb-2">Jumlah Stok</label>
    <input required type="number" id="quantity" name="quantity" class="w-full" />
  </div>
  <div class="flex justify-center">
    <input type="submit" class="btn-accent" value="Tambah Buku" />
  </div>
</form>
`;

async function handleClickEditButton(bookId) {
  try {
    const response = await fetch(`${API_URL}/${bookId}`);
    currentBook = await response.json();
    currentPage = 'edit';
    loadPage();
  } catch (error) {
    console.log(error);
    showError('Terjadi kesalahan saat mengambil data buku');
  }
}

async function handleClickDeleteButton(bookId) {
  try {
    await deleteBook(bookId);
    loadPage();
  } catch (error) {
    console.log(error);
    showError('Terjadi kesalahan saat menghapus buku');
  }
}

async function handleEditForm(event) {
  try {
    event.preventDefault();

    const book = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      year: parseInt(document.getElementById('year').value),
      quantity: parseInt(document.getElementById('quantity').value),
    };

    await editBook(book);

    currentBook = null;
    currentPage = 'home';
    loadPage();
  } catch (error) {
    console.log(error);
    showError('Terjadi kesalahan saat mengubah buku');
  }
}

async function handleAddForm(event) {
  try {
    event.preventDefault();

    const book = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      year: parseInt(document.getElementById('year').value),
      quantity: parseInt(document.getElementById('quantity').value),
    };

    await addBook(book);

    currentPage = 'home';
    loadPage();
  } catch (error) {
    console.log(error);
    showError('Terjadi kesalahan saat menambah buku');
  }
}

function handleClickAddNav() {
  currentPage = 'add';
  loadPage();
}

const navLinks = document.querySelectorAll('li a');
navLinks.forEach((navLink) => {
  navLink.addEventListener('click', () => {
    handleClickAddNav();
  });
});

function generateRows(books) {
  let rows = '';
  if (books.length === 0) {
    rows = `<tr>
   <td colspan="5" class="px-6 py-4 border-b text-center text-gray-400">Tidak ada buku yang ditemukan</td>
</tr>`;
  } else {
    books.forEach((objek) => {
      let data = `<tr class="book-item">
        <td class="px-6 py-4 border-b">${objek.title}</td>
        <td class="px-6 py-4 border-b">${objek.author}</td>
        <td class="px-6 py-4 border-b">${objek.year}</td>
        <td class="px-6 py-4 border-b">${objek.quantity}</td>
        <td class="px-6 py-4 border-b text-center">
          <button class="btn-blue" onclick="handleClickEditButton(${objek.id})">Edit</button>
          <button class="btn-danger" onclick="handleClickDeleteButton(${objek.id})">Hapus</button>  
        </td>
      </tr>`;
      rows = rows + data;
    });
  }
  return rows;
}

function generateEditFormInput() {
  return `<div class="mb-4">
  <label for="title" class="font-semibold mb-2">Judul Buku</label>
  <input required type="text" id="title" name="title" class="w-full" value="${currentBook?.title ?? ''}">
</div>
<div class="mb-4">
  <label for="author" class="font-semibold mb-2">Penulis Buku</label>
  <input required type="text" id="author" name="author" class="w-full" value="${currentBook?.author ?? ''}">
</div>
<div class="mb-4">
  <label for="year" class="font-semibold mb-2">Tahun Terbit</label>
  <input required type="number" id="year" name="year" class="w-full" value="${currentBook?.year ?? ''}">
</div>
<div class="mb-4">
  <label for="quantity" class="font-semibold mb-2">Jumlah Stok</label>
  <input required type="number" id="quantity" name="quantity" class="w-full" value="${currentBook?.quantity ?? ''}">
</div>
<div class="flex justify-center">
  <input type="submit" class="btn-accent" value="Simpan" />
</div>`;
}

async function loadPage() {
  switch (currentPage) {
    case 'home':
      main.innerHTML = pageListMainContent;

      const loadingIndicator = document.getElementById('loadingIndicator');
      if (loadingIndicator) loadingIndicator.classList.remove('hidden');

      await fetchBooks();

      if (loadingIndicator) loadingIndicator.classList.add('hidden');

      const tableBody = document.querySelector('tbody');
      if (tableBody) {
        const generatedRows = generateRows(books);
        tableBody.innerHTML = generatedRows;
      }

      break;
    case 'edit':
      main.innerHTML = pageEditBookMainContent;

      const form = document.querySelector('form');
      if (form) {
        const generatedFormInput = generateEditFormInput();
        form.innerHTML = generatedFormInput;
      }

      break;
    case 'add':
      main.innerHTML = pageAddBookMainContent;
      break;
  }
}

async function fetchBooks() {
  try {
    const response = await fetch(API_URL);
    const hasil = await response.json();
    books = hasil;
  } catch (error) {
    console.log(error);
    showError('Terjadi kesalahan saat mengambil data buku');
    books = [];
  }
}

async function addBook(book) {
  try {
    const response = await fetch(API_URL, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(book),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    showError('Terjadi kesalahan saat menambah buku');
  }
}

async function editBook(book) {
  try {
    const response = await fetch(`${API_URL}/${currentBook.id}`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
      method: 'PUT',
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    showError('Terjadi kesalahan saat mengubah buku');
  }
}

async function deleteBook(bookId) {
  try {
    const response = await fetch(`${API_URL}/${bookId}`, { method: 'DELETE' });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    showError('Terjadi kesalahan saat menghapus buku');
  }
}

loadPage();