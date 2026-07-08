const { resolve } = require('path');
const { readFileSync } = require('fs');
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require('jsdom');
const { waitFor, fireEvent } = require('@testing-library/dom');

const data = readFileSync(resolve(__dirname, './server/initial.json'), 'utf8');
const dataJSON = JSON.parse(data);

let windowJSDOM = null;

beforeEach(async () => {
  const { window } = await JSDOM.fromFile('./client/index.html', {
    runScripts: 'dangerously',
    resources: 'usable',
  });

  fetch = jest.fn().mockReturnValueOnce(Promise.resolve({ json: () => dataJSON.books }));

  window.fetch = fetch;
  const d = await new Promise((resolve) => {
    window.addEventListener('load', () => {
      resolve({
        window: window,
        document: window.document,
      });
    });
  });

  windowJSDOM = d;
});

describe('RuangPerpus Library App', () => {
  it('should fetch books from API on page load', async () => {
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenLastCalledWith('http://localhost:3333/books');
  });

  it('should render all seeded books in the table', async () => {
    await waitFor(() => {
      const bookList = windowJSDOM.document.querySelectorAll('.book-item');
      expect(bookList.length).toBe(15);

      const book1 = bookList[0].children;
      expect(book1.length).toBe(5);
      expect(book1[0].textContent).toBe('Laskar Pelangi');
      expect(book1[1].textContent).toBe('Andrea Hirata');
      expect(book1[2].textContent).toBe('2005');
      expect(book1[3].textContent).toBe('3');

      const actions = book1[4].children;
      expect(actions.length).toBe(2);
      expect(actions[0].textContent).toBe('Edit');
      expect(actions[1].textContent).toBe('Hapus');
    });
  });

  describe('Delete Book', () => {
    it('should call DELETE API and remove the book from the table', async () => {
      const dataJSONDelete = [...dataJSON.books];
      dataJSONDelete.shift();

      let bookList = null;

      await waitFor(() => {
        bookList = windowJSDOM.document.querySelectorAll('.book-item');
      });

      expect(bookList.length).toBe(15);

      const book1 = bookList[0].children;
      const actions = book1[4].children;

      windowJSDOM.window.confirm = jest.fn(() => true);
      fireEvent.click(actions[1]);

      const lastCall = fetch.mock.lastCall;
      expect(lastCall[0]).toBe('http://localhost:3333/books/1');
      expect(lastCall[1].method).toBe('DELETE');

      window.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(dataJSONDelete),
      });

      await waitFor(() => {
        const bookListAfterDelete = windowJSDOM.document.querySelectorAll('.book-item');
        expect(bookListAfterDelete.length).toBe(14);
      });
    });
  });

  describe('Edit Book', () => {
    it('should navigate to edit form with prefilled data', async () => {
      const mockData = [...dataJSON.books];
      const mockDataEdit = mockData.shift();

      let bookList = null;

      await waitFor(() => {
        bookList = windowJSDOM.document.querySelectorAll('.book-item');
      });

      const book1 = bookList[0].children;
      const actions = book1[4].children;

      window.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockDataEdit),
      });

      fireEvent.click(actions[0]);

      const lastCall = fetch.mock.lastCall;
      expect(lastCall[0]).toBe('http://localhost:3333/books/1');

      await waitFor(() => {
        const h2 = windowJSDOM.document.getElementsByTagName('h2')[0];
        expect(h2.textContent).toBe('Edit Buku');
      });
    });

    it('should update book via PUT request and re-render', async () => {
      const mockData = [...dataJSON.books];
      let mockDataEdit = mockData.shift();

      let bookList = null;

      await waitFor(() => {
        bookList = windowJSDOM.document.querySelectorAll('.book-item');
      });

      const book1 = bookList[0].children;
      const actions = book1[4].children;

      window.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockDataEdit),
      });

      fireEvent.click(actions[0]);

      const lastCall = fetch.mock.lastCall;
      expect(lastCall[0]).toBe('http://localhost:3333/books/1');

      await waitFor(() => {
        const h2 = windowJSDOM.document.getElementsByTagName('h2')[0];
        expect(h2.textContent).toBe('Edit Buku');
      });

      const inputTitle = windowJSDOM.document.getElementById('title');
      const inputAuthor = windowJSDOM.document.getElementById('author');
      const inputYear = windowJSDOM.document.getElementById('year');
      const inputQuantity = windowJSDOM.document.getElementById('quantity');
      const buttonSubmit = windowJSDOM.document.querySelector('input[type="submit"]');

      expect(inputTitle.value).toBe('Laskar Pelangi');
      expect(inputAuthor.value).toBe('Andrea Hirata');
      expect(inputYear.value).toBe('2005');
      expect(inputQuantity.value).toBe('3');

      fireEvent.change(inputTitle, { target: { value: 'Laskar Pelangi 2' } });
      fireEvent.change(inputAuthor, { target: { value: 'Andrea Hirata 2' } });
      fireEvent.change(inputYear, { target: { value: '2006' } });
      fireEvent.change(inputQuantity, { target: { value: '4' } });

      expect(inputTitle.value).toBe('Laskar Pelangi 2');
      expect(inputAuthor.value).toBe('Andrea Hirata 2');
      expect(inputYear.value).toBe('2006');
      expect(inputQuantity.value).toBe('4');

      window.fetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            message: 'Buku berhasil diperbarui',
          }),
      });

      fireEvent.click(buttonSubmit);

      const lastCallUpdate = fetch.mock.lastCall;
      expect(lastCallUpdate[0]).toBe('http://localhost:3333/books/1');
      expect(lastCallUpdate[1].method).toBe('PUT');

      const editedBookData = [...dataJSON.books];
      editedBookData[0] = {
        id: 1,
        title: 'Laskar Pelangi 2',
        author: 'Andrea Hirata 2',
        year: 2006,
        quantity: 4,
      };

      window.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(editedBookData),
      });

      await waitFor(() => {
        const bookListAfterEdit = windowJSDOM.document.querySelectorAll('.book-item');
        expect(bookListAfterEdit.length).toBe(15);

        const book1AfterEdit = bookListAfterEdit[0].children;
        expect(book1AfterEdit[0].textContent).toBe('Laskar Pelangi 2');
        expect(book1AfterEdit[1].textContent).toBe('Andrea Hirata 2');
        expect(book1AfterEdit[2].textContent).toBe('2006');
        expect(book1AfterEdit[3].textContent).toBe('4');
      });
    });
  });

  describe('Add Book', () => {
    it('should navigate to add form, submit via POST, and render new book', async () => {
      const a = windowJSDOM.document.querySelector('a');
      fireEvent.click(a);

      await waitFor(() => {
        const h2 = windowJSDOM.document.getElementsByTagName('h2')[0];
        expect(h2.textContent).toBe('Tambah Buku');
      });

      const inputTitle = windowJSDOM.document.getElementById('title');
      const inputAuthor = windowJSDOM.document.getElementById('author');
      const inputYear = windowJSDOM.document.getElementById('year');
      const inputQuantity = windowJSDOM.document.getElementById('quantity');
      const buttonSubmit = windowJSDOM.document.querySelector('input[type="submit"]');

      fireEvent.change(inputTitle, { target: { value: 'Laskar Pelangi 2' } });
      fireEvent.change(inputAuthor, { target: { value: 'Andrea Hirata 2' } });
      fireEvent.change(inputYear, { target: { value: '2006' } });
      fireEvent.change(inputQuantity, { target: { value: '99' } });

      expect(inputTitle.value).toBe('Laskar Pelangi 2');
      expect(inputAuthor.value).toBe('Andrea Hirata 2');
      expect(inputYear.value).toBe('2006');
      expect(inputQuantity.value).toBe('99');

      window.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ message: 'Buku berhasil ditambahkan' }),
      });

      fireEvent.click(buttonSubmit);

      expect(fetch.mock.lastCall[0]).toBe('http://localhost:3333/books');
      expect(fetch.mock.lastCall[1].method).toBe('POST');

      window.fetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve([
            ...dataJSON.books,
            {
              id: 16,
              title: 'Laskar Pelangi 2',
              author: 'Andrea Hirata 2',
              year: 2006,
              quantity: 99,
            },
          ]),
      });

      await waitFor(() => {
        const bookList = windowJSDOM.document.querySelectorAll('.book-item');
        expect(bookList.length).toBe(16);

        const book1 = bookList[15].children;
        expect(book1[0].textContent).toBe('Laskar Pelangi 2');
        expect(book1[1].textContent).toBe('Andrea Hirata 2');
        expect(book1[2].textContent).toBe('2006');
        expect(book1[3].textContent).toBe('99');
      });
    });
  });
});
