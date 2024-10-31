// app.js
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const PORT = 3000;
const dataFilePath = './data/books.json';

// Helper function to read and write data
function readData() {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}

function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// GET all books
app.get('/books', (req, res) => {
    const books = readData();
    res.json(books);
});

// GET a specific book by ISBN
app.get('/books/:isbn', (req, res) => {
    const books = readData();
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) res.json(book);
    else res.status(404).json({ error: 'Book not found' });
});

// POST a new book
app.post('/books', (req, res) => {
    const { title, author, publisher, publishedDate, isbn } = req.body;
    if (!title || !author || !publisher || !publishedDate || !isbn) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const books = readData();
    books.push(req.body);
    writeData(books);
    res.status(201).json(req.body);
});

// PUT update book by ISBN
app.put('/books/:isbn', (req, res) => {
    const books = readData();
    const index = books.findIndex(b => b.isbn === req.params.isbn);
    if (index === -1) return res.status(404).json({ error: 'Book not found' });

    books[index] = {...books[index], ...req.body };
    writeData(books);
    res.json(books[index]);
});

// DELETE a book by ISBN
app.delete('/books/:isbn', (req, res) => {
    let books = readData();
    const newBooks = books.filter(b => b.isbn !== req.params.isbn);
    if (newBooks.length === books.length) return res.status(404).json({ error: 'Book not found' });

    writeData(newBooks);
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));