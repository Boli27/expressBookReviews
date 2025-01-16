const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const SECRET_KEY = "mi_clave_secreta";
app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    let token = req.session.authorization ? req.session.authorization['accessToken'] : null; // Buscar el token en la sesión
 
    // if (!token && req.headers['authorization']) {
    //     // Si no hay token en la sesión, buscarlo en la cabecera Authorization
    //     token = req.headers['authorization'].split(' ')[1]; // El token es parte de la cabecera 'Bearer <token>'
    // }
 
    if (token) {
        // Verificar el JWT del usuario
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (!err) {
                req.user = user; // Guardamos los datos del usuario en la solicitud
                next(); // Continuamos con la siguiente función de middleware
            } else {
                return res.status(403).json({ message: "Usuario no autenticado" });
            }
        });
    } else {
        return res.status(403).json({ message: "Usuario no ha iniciado sesión" });
    }
 });
 

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
