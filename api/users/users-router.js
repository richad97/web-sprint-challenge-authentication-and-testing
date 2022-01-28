const router = require("express").Router();
const Users = require("./users-model");

router.get("/", async (req, res, next) => {
  const usersArr = await Users.getUsers();

  res.status(200).json(usersArr);
});

router.get("/:id", async (req, res, next) => {
  const foundByID = await Users.findByID(req.params.id);

  res.status(200).json(foundByID);
});

module.exports = router;
