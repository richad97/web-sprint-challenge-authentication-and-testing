const router = require("express").Router();
const Users = require("../users/users-model");
const bcrypt = require("bcrypt");
const tokenBuilder = require("./auth-token-builder");
const { BCRYPT_ROUNDS } = require("../config");

router.post("/register", async (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json("username and password required");
  } else {
    const hashedPassword = bcrypt.hashSync(password, BCRYPT_ROUNDS);
    const updatedObj = { username, password: hashedPassword };

    Users.insert(updatedObj)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json("username taken");
      });
  }
});

router.post("/login", async (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json("username and password required");
  } else {
    const [user] = await Users.findBy({ username });

    if (user && bcrypt.compareSync(password, user["password"])) {
      const token = tokenBuilder(user);
      res.status(200).json({
        message: `welcome, ${user["username"]}`,
        token: token,
      });
    } else {
      res.json("invalid credentials");
    }
  }
});

module.exports = router;
