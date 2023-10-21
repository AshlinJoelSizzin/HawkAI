import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/menu", function (req, res) {
  res.render("menu.ejs");
});

app.get("/veg", function (req, res) {
  res.render("meal.ejs");
});

app.get("/nonveg", function (req, res) {
  res.render("meal.ejs");
});

app.get("/previous", function (req, res) {
  res.redirect("/menu");
});

app.listen(3000, function () {
  console.log("Listening on port 3000");
});
