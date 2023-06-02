const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User.model")


// GET "/api/profile" => Recibe la informacion del usuario activo y la envía al front end

router.get("/", isAuthenticated, async (req, res, next) =>{
  try {
    console.log(req.payload._id);
    User.findById(req.payload._id)

    res.json("User data obtained")
  } catch (error) {
    next(error);
  }
 
})

// GET "/api/profile/favourite" => Recibe la información de las recetas favoritas del usuario y las envía al FE
// PENDIENTE HASTA TERMINAR LA RUTA DE RECETA PERTINENTE
module.exports = router;