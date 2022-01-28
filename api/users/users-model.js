const db = require("../../data/dbConfig");

function getUsers() {
  return db("users");
}

function findBy(filter) {
  return db("users").where(filter);
}

function findByID(id) {
  return db("users").where({ id }).first();
}

async function insert(user) {
  const [id] = await db("users").insert(user);

  return findByID(id);
}

module.exports = { getUsers, findBy, findByID, insert };
