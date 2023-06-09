const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;

// RUTAS AUTH

const authRouter = require("./auth.routes.js");
router.use("/auth", authRouter);

// RUTAS DE RECETAS

const recipesRouter = require("./recipes.routes.js");
router.use("/recipes", recipesRouter);

// RUTAS DE PERFIL

const profileRouter = require("./profile.routes.js");
router.use("/profile", profileRouter);

//UPLOAD

const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);


module.exports = router;