const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;

// RUTAS AUTH

const authRouter = require("./auth.routes.js")
router.use("/auth", authRouter);
