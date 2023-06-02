const router = require("express").Router();
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model"); // Modelo de User importado para cuando quiera asociar una receta a un usuario
const isAuthenticated = require("../middlewares/isAuthenticated");

// GET "/api/recipes" => Envían al front end todas las recetas, mostrando nombre (añadiré más según como se vean en el FE)

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const allRecipes = await Recipe.find().select({ name: 1 });
    // console.log(allRecipes) // Funciona
    console.log(req.payload);
    res.json(allRecipes); // Array vacío + recetas de prueba salen al probar la ruta
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST "/api/recipes/create" =>  Recibe del front end los detalles de una receta y es creada en la base de datos

router.post("/create", isAuthenticated, async (req, res, next) => {
  const { name, ingredients, category, instructions, servings, picture } =
    req.body;
  //   console.log(req.payload);
  try {
    if (
      !name ||
      !ingredients ||
      !category || //!!!!!
      !instructions ||
      servings === 0 ||
      !picture
    ) {
      res.status(400).json({
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
      picture,
    });
    res.json("New recipe created");
  } catch (error) {
    next(error);
  }
});

// GET "/api/recipes/:recipeId" => Envía al front end una unica receta segun su ID.

router.get("/:recipeId", async (req, res, next) => {
  const { recipeId } = req.params;
  try {
    const oneRecipe = await Recipe.findById(recipeId); // Funcionando en Postman!
    res.json(oneRecipe);
  } catch (error) {
    next(error);
  }
});

// PUT "/api/recipes/:recipeId" => Recibe información del Front End para editar una receta

router.put("/:recipeId", isAuthenticated, async (req, res, next) => {
  const { recipeId } = req.params;
  const { name, ingredients, category, instructions, servings, picture } =
    req.body;

  try {
    await Recipe.findByIdAndUpdate(recipeId, {
      name,
      ingredients,
      category,
      instructions,
      servings,
      picture,
    });
    res.json("Recipe has been updated!"); // Funciona y el cambio se realiza en la DB
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/recipes/:recipeId" => Borra una receta específica de la base de datos.

router.delete("/:recipeId", isAuthenticated, async (req, res, next) => {
  const { recipeId } = req.params;

  try {
    await Recipe.findByIdAndDelete(recipeId); // Funciona y es eliminada de la base de datos.
    res.json("Recipe has been deleted");
  } catch (error) {
    next(error);
  }
});

// PENDIENTES RUTAS DE COMENTARIOS EN RECETAS Y PARA AñADIR RECETAS A FAVORITOS

// POST "/api/recipes/:recipeId/favourite" => Añade una receta a favouriteRecipes del usuario activo

router.post("/:recipeId/favourite", isAuthenticated, async (req, res, next) => {
  const { recipeId } = req.params;

  try {
    //Primero intenté usar findOne pero si estamos logeados podemos encontrar el usuario con req.payload.id y usar updateById mejor??
    const addToFavourites = await User.findByIdAndUpdate(
      req.payload._id,
      { $push: { favouriteRecipes: recipeId } }, //! NO método de push, etc normal de JS
      { new: true } // Documento actualizado
    );
    res
      .status(200)
      .json({ successMessage: "Recipe has been added to favourites!" }); //! Actualizar resto de mensajes de respuestas de 200
    //! Tengo los mensajes pero sin .status() y creo que sería buena práctica incluirlo??
  } catch (error) {
    next(error);
  }
});

module.exports = router;
