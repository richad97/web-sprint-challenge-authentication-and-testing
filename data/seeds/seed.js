exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 1,
          username: "ricardo",
          password:
            "$2b$08$5wGNmkEV9an.R/ZJlXHYyeTYkMM7eXFlccZMK60ieyi.IA3jadGw2",
        },
      ]);
    });
};
