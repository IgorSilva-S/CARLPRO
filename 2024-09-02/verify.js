const jwt = require("jsonwebtoken");

const SECRET_KEY = 'mysecretkey';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJ1c2VybmFtZSI6Imxyb2RyaWd1ZXMiLCJpYXQiOjE3MjUyNzg5NjIsImV4cCI6MTcyNTI3OTAyMn0.KkbsmnRAyi8IOxkhexcyf9NcMduZpKySIO3LeQR-Lfg';

try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded);
} catch (err) {
    console.log("Invalid token: ", err.message);
}