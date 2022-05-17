const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();

app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "kth-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
  })
);
const db = require("../app/models");
const { Router } = require("express");
const Role = db.role;
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to xss_bank application." });
});
// routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
authRoutes(app);
userRoutes(app);

//require("./app/routes/user.routes")(app);
//require("./app/routes/auth.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
