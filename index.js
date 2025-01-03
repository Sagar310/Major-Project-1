const express = require("express")
require("dotenv").config();

const app = express();
const { initializeDatabase } = require("./db/db.connect")
const Book = require("./models/book.models")

app.use(express.json());

initializeDatabase();

async function createBook(newBook) {
    try{
        const book = new Book(newBook);
        const saveBook = await book.save();
        return saveBook;
    }
    catch(error){
        console.log(error);
    }
}

app.post("/books", async (req, res) => {
    try{
        const savedBook = await createBook(req.body)
        res.status(201).json({message: "Book added successfully.", book: savedBook})
    }
    catch(error){
        res.status(500).json({error: "Failed to add the book."})
    }
})

async function readAllBooks() {
    try{
        const books = await Book.find()
        return books;
    }
    catch(error){
        throw error;
    }
}

app.get("/books", async (req, res) => {
    try {
        const books = await readAllBooks();
        if(books.length > 0)
        {
            res.json(books);
        }
        else{
            res.status(404).json({error: "No books found."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch books."});
    }
})

async function readBookByTitle(bookTitle){
    try{
        const book = await Book.findOne({title: bookTitle});
        return book;
    }
    catch(error){
        throw error
    }
}

app.get("/books/:title", async (req, res) => {
    try{
        const book = await readBookByTitle(req.params.title);
        if(book){
            res.json(book);
        }
        else{
            res.status(404).json({error: "Book not found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch book."});
    }
})

async function readBooksByAuthor(authorName){
    try{
        const books = await Book.find({author: authorName});
        return books;
    }
    catch(error){
        throw error
    }
}

app.get("/books/author/:authorName", async (req, res) => {
    try{
        const books = await readBooksByAuthor(req.params.authorName);
        if(books.length > 0){
            res.json(books);
        }
        else{
            res.status(404).json({error: "No books found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch books."});
    }
})

async function readBooksByGenre(bookGenre){
    try{
        const books = await Book.find({genre: bookGenre});
        return books;
    }
    catch(error){
        throw error
    }
}

app.get("/books/genre/:bookGenre", async (req, res) => {
    try{
        const books = await readBooksByGenre(req.params.bookGenre);
        if(books.length > 0){
            res.json(books);
        }
        else{
            res.status(404).json({error: "No books found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch books."});
    }
})

async function readBooksByReleaseYear(releaseYear){
    try{
        const books = await Book.find({publishedYear: releaseYear});
        return books;
    }
    catch(error){
        throw error
    }
}

app.get("/books/year/:releaseYear", async (req, res) => {
    try{
        const books = await readBooksByReleaseYear(req.params.releaseYear);
        if(books.length > 0){
            res.json(books);
        }
        else{
            res.status(404).json({error: "No books found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch books."});
    }
})

async function updateBook(bookId, dataToUpdate) {
    try {
        const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {
            new: true
        });
        return updatedBook;
    } catch (error) {
        throw error;
    }
}

app.post("/books/:bookId", async (req, res) => {
    try {
        const updatedBook = await updateBook(req.params.bookId, req.body);
        if(updatedBook){            
            res.status(200).json({message: "Book updated successfully.", updatedBook: updatedBook});
        }
        else{
            res.status(404).json({message: "Book does not exist."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update the book."});
    }
})

async function updateBookByTitle(bookTitle, dataToUpdate) {
    try {
        const updatedBook = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {
            new: true
        });
        return updatedBook;
    } catch (error) {
        throw error;
    }
}

app.post("/books/title/:bookTitle", async (req, res) => {
    try {
        const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body);
        if(updatedBook){            
            res.status(200).json({message: "Book updated successfully.", updatedBook: updatedBook});
        }
        else{
            res.status(404).json({message: "Book does not exist."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update the book."});
    }
})

async function deleteBookById(bookId) {
    try {
        const deletedBook = Book.findByIdAndDelete(bookId);
        return deletedBook;
    } catch (error) {
        throw error;
    }
}

app.delete("/books/:bookId", async (req, res) => {
    try {
        const deletedBook = await deleteBookById(req.params.bookId);
        if(deletedBook){
            res.status(200).json({message: "Book deleted successfully.", deletedBook: deletedBook});
        }
        else{
            res.status(404).json({error: "Book does not exist."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to delete the book."});
    }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});