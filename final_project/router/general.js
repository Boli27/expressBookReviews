const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
    const { username, password } = req.body; 

    if (!username || !password) {
        return res.status(400).json({ message: "Por favor, ingrese todos los datos" });
    }

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "Este usuario ya existe" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "Usuario registrado correctamente" });
});


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {

    const booksList = await new Promise((resolve, reject) => {

      setTimeout(() => {
        resolve(books); 
      }, 1000);
    });

    res.json(booksList);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los libros" });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    const book = await new Promise((resolve, reject) => {
      // Simulamos un pequeño retraso para la operación asincrónica
      setTimeout(() => {
        resolve(books[isbn] || null); // Retornamos el libro encontrado o null si no existe
      }, 1000);
    });

    return book ? res.json(book) : res.status(404).json({ message: "Libro no encontrado" });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el libro" });
  }
});

  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;

    const booksByAuthor = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = Object.values(books).filter(book => book.author === author);
        resolve(result); 
      }, 1000);
    });

    return booksByAuthor.length > 0
      ? res.json(booksByAuthor)
      : res.status(404).json({ message: "No se encontraron libros del autor" });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los libros por autor" });
  }
});


// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;

    const booksByTitle = await new Promise((resolve, reject) => {

      setTimeout(() => {
        const result = Object.values(books).filter(book => book.title === title);
        resolve(result); 
      }, 1000);
    });

    return booksByTitle.length > 0
      ? res.json(booksByTitle)
      : res.status(404).json({ message: "No se encontraron libros con ese título" });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los libros por título" });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn] || null;

  return book ? res.json({reviews: book.reviews}): res.send("Libro no encontrado");
});

module.exports.general = public_users;
