const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn] || null;


  return book ? res.send(book): res.send("Libro no encontrado");
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const book = JSON.stringify(
    Object.values(books).filter(book => book.author === author),
    null,
    2
);
  return book ? res.send(book): res.send("Libro no encontrado");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const book = JSON.stringify(
    Object.values(books).filter(book => book.title === title),
    null,
    2
);
  return book ? res.send(book): res.send("Libro no encontrado");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn] || null;

  return book ? res.json({reviews: book.reviews}): res.send("Libro no encontrado");
});

module.exports.general = public_users;
