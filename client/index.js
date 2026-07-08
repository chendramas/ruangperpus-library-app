function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const API_URL = window.APP_CONFIG?.API_URL || 'http://localhost:3333/books';

let currentPage = 'home';
let currentBook = null;
let books = [];
let filteredBooks = [];

const main = document.querySelector('main');

function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  toast.className = `toast fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-y-0 opacity-100`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function showError(message) {
  showToast(message, 'error');
}

const pageListMainContent = `<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
  <h2 class="text-2xl font-bold">Daftar Buku Perpustakaan</h2>
  <div class="flex items-center gap-3">
    <div class="relative">
      <input type="text" id="searchInput" placeholder="Cari buku..." class="w-64 pl-10 pr-4 py-2 text-sm" oninput="handleSearch(this.value)" />
      <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
    </div>
    <div id="loadingIndicator" class="hidden">
      <i class="fas fa-spinner fa-spin text-green-500"></i>
    </div>
  </div>
</div>

<table class="min-w-full border border-gray-300">
  <thead>
    <tr class="table-header">
      <th class="px-6 py-3 border-b text-left cursor-pointer hover:bg-white/5" onclick="handleSort('title')">Judul <i class="fas fa-sort text-xs ml-1 opacity-50"></i></th>
      <th class="px-6 py-3 border-b text-left cursor-pointer hover:bg-white/5" onclick="handleSort('author')">Penulis <i class="fas fa-sort text-xs ml-1 opacity-50"></i></th>
      <th class="px-6 py-3 border-b text-left cursor-pointer hover:bg-white/5" onclick="handleSort('year')">Tahun Terbit <i class="fas fa-sort text-xs ml-1 opacity-50"></i></th>
      <th class="px-6 py-3 border-b text-left cursor-pointer hover:bg-white/5" onclick="handleSort('quantity')">Jumlah <i class="fas fa-sort text-xs ml-1 opacity-50"></i></th>
      <th class="px-6 py-3 border-b text-center">Action</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>

<div id="emptyState" class="hidden text-center py-12 text-gray-500">
  <i class="fas fa-book-open text-4xl mb-3"></i>
  <p>Tidak ada buku yang ditemukan</p>
</div>`;

const pageEditBookMainContent = `<h2 class="text-2xl font-bold mb-4">Edit Buku</h2>

<form class="max-w-sm mx-auto" onsubmit="return handleEditForm(event)">
</form>
`;

const pageAddBookMainContent = `<h2 class="text-2xl font-bold mb-4">Tambah Buku</h2>

<form class="max-w-sm mx-auto" onsubmit="return handleAddForm(event)" id="addForm" novalidate>
  <div class="mb-4">
    <label for="title" class="font-semibold mb-2">Judul Buku</label>
    <input required type="text" id="title" name="title" class="w-full" />
    <p class="text-red-500 text-xs mt-1 hidden" id="titleError">Judul buku wajib diisi</p>
  </div>
  <div class="mb-4">
    <label for="author" class="font-semibold mb-2">Penulis Buku</label>
    <input required type="text" id="author" name="author" class="w-full" />
    <p class="text-red-500 text-xs mt-1 hidden" id="authorError">Nama penulis wajib diisi</p>
  </div>
  <div class="mb-4">
    <label for="year" class="font-semibold mb-2">Tahun Terbit</label>
    <input required type="number" id="year" name="year" class="w-full" min="1000" max="2099" />
    <p class="text-red-500 text-xs mt-1 hidden" id="yearError">Tahun harus antara 1000-2099</p>
  </div>
  <div class="mb-4">
    <label for="quantity" class="font-semibold mb-2">Jumlah Stok</label>
    <input required type="number" id="quantity" name="quantity" class="w-full" min="0" />
    <p class="text-red-500 text-xs mt-1 hidden" id="quantityError">Jumlah stok minimal 0</p>
  </div>
  <div class="flex justify-center">
    <input type="submit" class="btn-accent" value="Tambah Buku" />
  </div>
</form>
`;

let sortField = null;
let sortDirection = 'asc';

function handleSearch(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    filteredBooks = [...books];
  } else {
    filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q)
    );
  }
  renderTable();
}

function handleSort(field) {
  if (sortField === field) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortField = field;
    sortDirection = 'asc';
  }

  filteredBooks.sort((a, b) => {
    let valA = a[field];
    let valB = b[field];
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  renderTable();
}

function renderTable() {
  const tableBody = document.querySelector('tbody');
  const emptyState = document.getElementById('emptyState');

  if (filteredBooks.length === 0) {
    if (tableBody) tableBody.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    if (tableBody) {
      tableBody.innerHTML = generateRows(filteredBooks);
    }
  }
}

function validateField(fieldId, errorId, validator) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!input || !error) return true;

  const isValid = validator(input.value);
  if (isValid) {
    error.classList.add('hidden');
    input.style.borderColor = '';
  } else {
    error.classList.remove('hidden');
    input.style.borderColor = '#ef4444';
  }
  return isValid;
}

async function handleClickEditButton(bookId) {
  try {
    const response = await fetch(`${API_URL}/${bookId}`);
    currentBook = await response.json();
    currentPage = 'edit';
    loadPage();
  } catch (error) {
    showError('Terjadi kesalahan saat mengambil data buku');
  }
}

async function handleClickDeleteButton(bookId) {
  try {
    if (!confirm('Yakin mau hapus buku ini?')) return;
    await deleteBook(bookId);
    showToast('Buku berhasil dihapus');
    loadPage();
  } catch (error) {
    showError('Terjadi kesalahan saat menghapus buku');
  }
}

async function handleEditForm(event) {
  try {
    event.preventDefault();

    const book = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      year: parseInt(document.getElementById('year').value, 10),
      quantity: parseInt(document.getElementById('quantity').value, 10),
    };

    await editBook(book);

    currentBook = null;
    currentPage = 'home';
    showToast('Buku berhasil diupdate');
    loadPage();
  } catch (error) {
    showError('Terjadi kesalahan saat mengubah buku');
  }
}

async function handleAddForm(event) {
  try {
    event.preventDefault();

    const isTitleValid = validateField('title', 'titleError', v => v.trim().length > 0);
    const isAuthorValid = validateField('author', 'authorError', v => v.trim().length > 0);
    const isYearValid = validateField('year', 'yearError', v => {
      const n = parseInt(v, 10);
      return !isNaN(n) && n >= 1000 && n <= 2099;
    });
    const isQuantityValid = validateField('quantity', 'quantityError', v => {
      const n = parseInt(v, 10);
      return !isNaN(n) && n >= 0;
    });

    if (!isTitleValid || !isAuthorValid || !isYearValid || !isQuantityValid) return;

    const book = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      year: parseInt(document.getElementById('year').value, 10),
      quantity: parseInt(document.getElementById('quantity').value, 10),
    };

    await addBook(book);

    currentPage = 'home';
    showToast('Buku berhasil ditambahkan');
    loadPage();
  } catch (error) {
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
    rows = '';
  } else {
    books.forEach((objek) => {
      let data = `<tr class="book-item">
        <td class="px-6 py-4 border-b">${escapeHtml(objek.title)}</td>
        <td class="px-6 py-4 border-b">${escapeHtml(objek.author)}</td>
        <td class="px-6 py-4 border-b">${escapeHtml(String(objek.year))}</td>
        <td class="px-6 py-4 border-b">${escapeHtml(String(objek.quantity))}</td>
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
  <input required type="text" id="title" name="title" class="w-full" value="${escapeHtml(currentBook?.title ?? '')}">
</div>
<div class="mb-4">
  <label for="author" class="font-semibold mb-2">Penulis Buku</label>
  <input required type="text" id="author" name="author" class="w-full" value="${escapeHtml(currentBook?.author ?? '')}">
</div>
<div class="mb-4">
  <label for="year" class="font-semibold mb-2">Tahun Terbit</label>
  <input required type="number" id="year" name="year" class="w-full" value="${escapeHtml(String(currentBook?.year ?? ''))}">
</div>
<div class="mb-4">
  <label for="quantity" class="font-semibold mb-2">Jumlah Stok</label>
  <input required type="number" id="quantity" name="quantity" class="w-full" value="${escapeHtml(String(currentBook?.quantity ?? ''))}">
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

      filteredBooks = [...books];
      renderTable();

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
    showError('Terjadi kesalahan saat mengubah buku');
  }
}

async function deleteBook(bookId) {
  try {
    const response = await fetch(`${API_URL}/${bookId}`, { method: 'DELETE' });
    const result = await response.json();
    return result;
  } catch (error) {
    showError('Terjadi kesalahan saat menghapus buku');
  }
}

loadPage();
