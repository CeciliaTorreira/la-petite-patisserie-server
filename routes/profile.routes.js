const router = require("express").Router();
//MODELOS
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

//MIDDLEWARES
const isAuthenticated = require("../middlewares/isAuthenticated");

// GET "/api/profile" => Recibe la informacion del usuario activo y la envía al front end

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    console.log(req.payload._id);
    await User.findById(req.payload._id);

    res.json("User data obtained");
  } catch (error) {
    next(error);
  }
});

// GET "/api/profile/favourite" => Recibe la información de las recetas favoritas del usuario y las envía al FE

router.get("/favourite", isAuthenticated, async (req, res, next) => {
  try {
    const userFavouriteRecipes = await User.findById(req.payload._id).populate(
      "favouriteRecipes"
    );
    res.json(userFavouriteRecipes.favouriteRecipes); // Funciona y me muestra un array vacío [ ] al no tener recetas favoritas
    // Metí usando Mongo un objeto en favoritos del usuario que tengo activo y ahora muestra ese item correctamente
  } catch (error) {
    next(error);
  }
});

// GET "/api/profile/created" => Recibe la información de las recetas creadas por el usuario activo y las envía al FE.

router.get("/created", isAuthenticated, async (req, res, next) => {
  try {
    const createdRecipes = await Recipe.find({ creator: req.payload._id });
    res.json(createdRecipes); // Funciona y muestra las dos recetas creadas de pruebas
  } catch (error) {
    next(error);
  }
});

module.exports = router;
