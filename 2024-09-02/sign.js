const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysecretkey";

const payload = {
  id: 123,
  username: "lrodrigues",
};

const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "60s" });

console.log(token);