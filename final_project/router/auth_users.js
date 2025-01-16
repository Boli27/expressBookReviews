const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = "mi_clave_secreta";
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validar que los campos estén completos
  if (!username || !password) {
      return res.status(400).json({ message: "Por favor, ingrese todos los datos" });
  }

  // Verificar si el usuario existe y las credenciales son correctas
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
      return res.status(401).json({ message: "Nombre de usuario o contraseña incorrectos" });
  }

  // Crear un JWT
  const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });

  // Guardar el token en la sesión
  req.session.authorization = {
    accessToken: token // Guardamos el token en la sesión para usarlo en futuras solicitudes
  };

  // Enviar el token como respuesta
  return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token
  });
});


// Add a book review
// Endpoint para publicar o modificar una reseña
// Endpoint para publicar o modificar una reseña
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { username } = req.user; // El usuario autenticado se obtiene de la sesión
  const { review } = req.body; // La reseña que se envía en el cuerpo de la solicitud
  const isbn = req.params.isbn; // El ISBN del libro en la URL

  // Verificar que la reseña esté presente
  if (!review) {
      return res.status(400).json({ message: "La reseña no puede estar vacía" });
  }

  // Buscar el libro por ISBN usando Object.values()
  const book = books[isbn] || null;
  if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
  }

  // Si el usuario ya tiene una reseña para este libro, la modificamos
  if (book.reviews[username]) {
      book.reviews[username] = review; // Modificar la reseña existente
      return res.status(200).json({ message: "Reseña modificada con éxito" });
  }

  // Si el usuario no tiene una reseña, la agregamos
  book.reviews[username] = review;
  return res.status(201).json({ message: "Reseña publicada con éxito" });
});

// Endpoint para eliminar una reseña
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.user; // Obtener el nombre de usuario desde la sesión
  const isbn = req.params.isbn; // El ISBN del libro en la URL

  // Buscar el libro por ID (isbn)
  const book = books[isbn] || null;
  if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
  }

  // Verificar si el usuario tiene una reseña para el libro
  if (!book.reviews[username]) {
      return res.status(404).json({ message: "Reseña no encontrada para este libro" });
  }

  // Eliminar la reseña del libro si pertenece al usuario autenticado
  if (book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({ message: "Reseña eliminada con éxito" });
  }

  // En caso de que no se pueda eliminar (no debería llegar aquí por la validación anterior)
  return res.status(400).json({ message: "No se pudo eliminar la reseña" });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
