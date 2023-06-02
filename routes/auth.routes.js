const router = require("express").Router();

// Requerimos modelo de User

const User = require("../models/User.model");

// Requerimos bcrypt una vez instalado

const bcrypt = require("bcrypt");

// Requerimos jsonwebtoken

const jwt = require("jsonwebtoken")

// Requerimos middleware isAuthenticated

const isAuthenticated = require("../middlewares/isAuthenticated")

// POST "/api/auth/signup" => Registra al usuario creando sus credenciales
router.post("/signup", async (req, res, next) => {
  console.log(req.body); //* Funciona

  const { username, email, password } = req.body;

  // Validaciones de que todos los campos estén llenos

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
      res.status(400).json({
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
    });
  } catch (error) {
        next(error)
  }
  //* Creación de usuario funciona y sale en la DB.

  res.json("Testing signup"); //* Funciona
});

// POST "/api/auth/login" => Valida las credenciales ya creadas del usuario

router.post("/login", async (req, res, next) => {
  console.log(req.body); // Info de las credenciales. Funciona, visualizándolas en la consola.
  const { email, password, role } = req.body;

  // Validación de que ambos campos estén llenos
  if (email === "" || password === "") {
    res.status(400).json({ errorMessage: "Both fields are required." }); // *Funciona
    return;
  }

  // Validación de que el usuario existe

  try {
    const foundUser = await User.findOne({ email: email });
    if (foundUser === null) {
      res.status(400).json({
        errorMessage:
          "There is not an account created with that email address.",
      });
    }

    //Validación de contraseña correcta o no

   const isPasswordCorrect = await bcrypt.compare(
    password,
    foundUser.password)

    if (isPasswordCorrect === false){
    res.status(400).json({errorMessage: "Password is not correct, please try again."}) //* Funciona
    return
    }
   
    //* Tenemos que crear el token y enviarlo al cliente.
    //* PAYLOAD = INFORMACION DE LOGIN
    const payload = {
     _id: foundUser._id,
     email: foundUser.email,
     role: foundUser.role, 
    username: foundUser.username,
    
        }
    
   const authToken = jwt.sign(
    payload, // Información del usuario
    process.env.TOKEN_SECRET,  // Plabra secreta
     {algorithm: "HS256", expiresIn: "7d" }        // Configuraciones (algoritmo y expiración (opcional))
    
    )

    // res.json("Testing login")
    res.json({authToken: authToken}); //* Funciona
  } catch (error) {
    next(error);
  }
});

// GET "/api/auth/verify" => Notifica al front end si el usuario ha iniciado sesión correctamente. (Validación.)

 router.get("/verify", isAuthenticated , (req, res, next) =>{ // => Recibe y valida el token => extrae el payload //! PASAMOS ISAUTHENTICATED COMO ARGUMENTO
   

  // req.payload = Usuario haciendo la llamada (recordar req.session.activeUser del módulo 2)
console.log(req.payload); //! Usar req.payload.role para funciones de solo admin????
 res.json({payload: req.payload}) 

})


module.exports = router;


//! DESCARGAMOS JSONWEBTOKEN Y REQUERIRLO
//! DESCARGAMOS EXPRESS-JWT 