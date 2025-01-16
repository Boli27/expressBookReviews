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

  // Enviar el token como respuesta
  return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
