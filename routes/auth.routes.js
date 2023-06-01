const router = require("express").Router();

// Requerimos modelo de User

const User = require("../models/User.model");

// Requerimos bcrypt una vez instalado

const bcrypt = require("bcrypt");

// POST "/api/auth/signup" => Registra al usuario creando sus credenciales
router.post("/signup", async (req, res, next) => {
  console.log(req.body); //* Funciona

  const { username, email, password } = req.body;

  // Validaciones del servidor

  if (username === "" || email === "" || password === "") {
    res.status(400).json({ errorMessage: "All fields are required." }); // *Funciona
    return;
  }

  // Validación de contraseña (usé el mismo patrón que fue usado en módulo 2)

  const regexPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (regexPattern.test(req.body.password) === false) {
    res.status(400).json({
      //* Recordar mensajes de error detallados/específicos
      errorMessage:
        "Please keep in mind your password needs to contain at least one capital letter, one special character and a length of eight characters.", //* Funciona
    });

    return;
  }

  // Validación de email (varios usuarios podrán tener un nombre repetido pero los emails deben ser únicos), tras esta última validación se creará la cuenta si cumple todas las condiciones.

 
    try {
      const foundUser = await User.findOne({ email: req.body.email });

      if (foundUser !== null) {
        res
          .status(400)
          .json({
            errorMessage:
              "There is already an account created with that email address.", //* Funciona
          });
        return;
      }
      const salt = await bcrypt.genSalt(12);
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      await User.create({
        username: username,
        email: email,
        password: hashPassword,
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({ errorMessage: "Server error" });
    }
  //* Creación de usuario funciona y sale en la DB.

  res.json("Testing signup"); //* Funciona
});



// POST "/api/auth/login" => Valida las credenciales ya creadas del usuario

router.post("/login", (req, res, next) => {
  res.json("Testing login");
});

// GET "/api/auth/verify" => Notifica al front end si el usuario ha iniciado sesión correctamente. (Validación.)

module.exports = router;
