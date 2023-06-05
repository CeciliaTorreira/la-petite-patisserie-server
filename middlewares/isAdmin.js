function isAdmin(req, res, next) {
    if (req.payload.role === "admin") {
      next()
    } else {
      res.json("Not authorised")
    }
  }

  module.exports = isAdmin