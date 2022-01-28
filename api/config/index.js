module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 8,
};
