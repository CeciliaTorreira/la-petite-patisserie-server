const router = require("express").Router();
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model") // Modelo de User importado para cuando quiera asociar una receta a un usuario
const isAuthenticated = require("../middlewares/isAuthenticated")


// GET "/api/recipes" => Envían al front end todas las recetas, mostrando nombre (añadiré más según como se vean en el FE)

router.get("/", isAuthenticated, async (req, res, next) => {
     try {
    const allRecipes = await Recipe.find().select({ name: 1 });
    // console.log(allRecipes) // Funciona
    console.log(req.payload);
    res.json(allRecipes); // Array vacío + recetas de prueba salen al probar la ruta
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Server error" });
  }
});

// POST "/api/recipes/create" =>  Recibe del front end los detalles de una receta y es creada en la base de datos

router.post("/create", isAuthenticated, async (req, res, next) => {
  const {
    name,
    ingredients,
    category,
    instructions,
    servings,
    picture,
  } = req.body;
//   console.log(req.payload);
  try {
    if (
      !name ||
      !ingredients ||
      !category ||
      !instructions ||
      !servings ||
      !picture
    ) {
      res
        .status(400)
        .json({
          errorMessage: "Some mandatory fields are empty, please try again.",
        });

      return;
    }
    

    await Recipe.create({
    name,
    ingredients,
    category,
    instructions,
    creator: req.payload._id, // En la DB se crea perfectamente y asigna su creador como el usuario activo!! :)
    servings,
    picture
    })
    res.json("New recipe created")
    
   
  } catch (error) {
    next(error);
  }
});

module.exports = router;
