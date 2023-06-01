const router = require("express").Router();

// POST "/api/auth/signup" => Registra al usuario creando sus credenciales
 router.post("/signup", (req, res, next)=>{

    console.log(req.body); //* Funciona

    const { username, email, password} = req.body 

    // Validaciones del servidor

    if (username === "" || email === "" || password === ""){
    res.json({errorMessage: "All fields are required."})   // *Funciona  
    return 
    }
    
    // Validación de contraseña 

    const regexPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    if (regexPattern.test(req.body.password) === false) {
      res.json({
        errorMessage:
          "Please keep in mind your password needs to contain at least one capital letter, one special character and a length og eight characters.",  //* Funciona
      })
  
      return;
    }

 res.json("Testing signup") //* Funciona
})

// POST "/api/auth/login" => Valida las credenciales ya creadas del usuario

router.post("/login", (req, res, next)=>{

res.json("Testing login")
})

// GET "/api/auth/verify" => Notifica al front end si el usuario ha iniciado sesión correctamente. (Validación.)

module.exports = router;
