const router = require("express").Router();

//* Modelos importados
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model"); // Modelo de User importado para cuando quiera asociar una receta a un usuario
const Comment = require("../models/Comment.model");

//* Middlewares
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");

// GET "/api/recipes" => Envían al front end todas las recetas, mostrando nombre (añadiré más según como se vean en el FE)

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const allRecipes = await Recipe.find().select({ name: 1, picture: 1 });
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
      creator: req.payload._id, // En la DB se crea perfectamente y asigna su creador como el usuario activo!!
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

router.delete(
  "/:recipeId",
  isAuthenticated,
  isAdmin,
  async (req, res, next) => {
    const { recipeId } = req.params;

    try {
      await Recipe.findByIdAndDelete(recipeId); // Funciona y es eliminada de la base de datos.
      res.json("Recipe has been deleted");
    } catch (error) {
      next(error);
    }
  }
);

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

// POST "/api/recipes/:recipeId/remove"

router.post(
  "/:recipeId/favourite/remove",
  isAuthenticated,
  async (req, res, next) => {
    const { recipeId } = req.params;

    try {
      //! No quiero borrar la receta, quiero sacarla del array que sería favouriteRecipes del usuario activo
      //Fallo solucionado ^^^^
      await User.findByIdAndUpdate(
        req.payload._id,
        { $pull: { favouriteRecipes: recipeId } },
        { new: true }
      );
      res.json("Recipe has been removed from your favourite list") // Funciona
    } catch (error) {
      next(error);
    }
  }
);

//* COMENTARIOS EN RECETAS

// GET "/api/recipes/:recipeId/comments" => Se envían al FE los comentarios que haya en una receta

router.get("/:recipeId/comments", async (req, res, next) => {
  const { recipeId } = req.params;

  try {
    const recipeComments = await Comment.find({ recipe: recipeId }); // Buscamos comentarios hechos únicamente sobre la receta con dicho ID específico (recipeId)
    console.log(recipeComments); // [ ] No tenemos ni un único comentario todavía, creo que si al menos me devuelve un array vacío es porue está bien
    res.json(recipeComments); //! Actualizado, ahora sale en la búsqueda el comentario que creé con la siguiente ruta
  } catch (error) {
    next(error);
  }
});

// POST "/api/recipes/:recipeId/comments" => Se reciben los datos del FE para crear un nuevo comentario y añadirlo a la base de datos

router.post("/:recipeId/comments", isAuthenticated, async (req, res, next) => {
  const { recipeId } = req.params;
  const { description, rating } = req.body;
  try {
    if (!description || rating === 0) {
      res.status(400).json({
        errorMessage: "Some mandatory fields are empty, please try again.",
      });

      return;
    }
    await Comment.create({
      description,
      rating,
      creator: req.payload._id, // Funciona, se agrega el comentario a la receta con creator: Id del usuario activo
      recipe: recipeId, // Funciona igualmente y se crea un comentario con recipe: id de la receta pertinente sobre la que comentamos
    });
    res.json("Comment posted");
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/profile/favourite" => Elimina una receta de la lista de recetas favoritas de un usuario

router.delete(
  "/:recipeId/comments/:commentId",
  isAuthenticated,
  isAdmin,
  async (req, res, next) => {
    const { commentId } = req.params;

    try {
      await Comment.findByIdAndDelete(commentId);

      res.json("The comment has been deleted"); // Funciona
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
