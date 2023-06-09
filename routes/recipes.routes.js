const router = require("express").Router();

//* Modelos importados
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

//* Middlewares
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");

// GET "/api/recipes" => Envían al front end todas las recetas, mostrando nombre (añadiré más según como se vean en el FE)

router.get("/", async (req, res, next) => {
  try {
    const allRecipes = await Recipe.find().select({
      name: 1,
      picture: 1,
      category: 1,
    });

    res.json(allRecipes);
  } catch (error) {
    next(error);
  }
});

// POST "/api/recipes/create" =>  Recibe del front end los detalles de una receta y es creada en la base de datos

router.post("/create", isAuthenticated, async (req, res, next) => {
  const { name, ingredients, category, instructions, servings, picture } =
    req.body;

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
      creator: req.payload._id,
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
    const oneRecipe = await Recipe.findById(recipeId);
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
    res.json("Recipe has been updated!");
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
      await Recipe.findByIdAndDelete(recipeId);
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
    const user = await User.findOne({
      _id: req.payload._id,
      favouriteRecipes: { $in: [recipeId] },
    });

    if (user) {
      res.status(400).json({
        errorMessage:
          "You have already added this recipe to your favourite list.",
      });
      return;
    }
    const addToFavourites = await User.findByIdAndUpdate(
      req.payload._id,
      { $push: { favouriteRecipes: recipeId } }, //! NO método de push, etc normal de JS
      { new: true }
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
      await User.findByIdAndUpdate(
        req.payload._id,
        { $pull: { favouriteRecipes: recipeId } },
        { new: true }
      );
      res.json("Recipe has been removed from your favourite list"); // Funciona
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
    const recipeComments = await Comment.find({ recipe: recipeId }).populate(
      "creator"
    );

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
      creator: req.payload._id,
      recipe: recipeId,
    });
    res.json("Comment posted");
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/recipes/:recipeId/comments/:commentId" => Elimina un comentario por su ID

router.delete(
  "/:recipeId/comments/:commentId",
  isAuthenticated,
  isAdmin,
  async (req, res, next) => {
    const { commentId } = req.params;

    try {
      await Comment.findByIdAndDelete(commentId);

      res.json("The comment has been deleted");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
