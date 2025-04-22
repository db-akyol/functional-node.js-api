var express = require("express");
var router = express.Router();
const Users = require("../db/models/Users");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/add", async (req, res) => {
  let = body = req.body;

  let user = await Users.create({
    email: body.email,
  });
});

module.exports = router;
