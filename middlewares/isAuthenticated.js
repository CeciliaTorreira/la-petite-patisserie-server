const { expressjwt: jwt } = require("express-jwt");

// OBJETO con todas las configuraciones
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET, //! .ENV
  algorithms: ["HS256"],
  requestProperty: "payload", // Así recibimos el payload tras validar el token
  getToken: (req) => {
    console.log(req.headers); // Error al no recibir token. Insertar bearer token en Postman para verificar
    //* Recibiendo Bearer + token correctamente

    if (req.headers === undefined || req.headers.authorization === undefined) {
      console.log("No token");
      return null;
    }
    const tokenArr = req.headers.authorization.split(" ");
    const tokenType = tokenArr[0];
    const token = tokenArr[1];

    if (tokenType !== "Bearer") {
      console.log("Incorrect token type");
      return null;
    }
    console.log("Token entregado"); //* Funciona
    return token;
  },
});

module.exports = isAuthenticated;
