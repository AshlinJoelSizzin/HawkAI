import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "menu",
  password: "AshlinJoelSizzin",
  port: 5432,
});
db.connect();

const cartLengthResult = await db.query("SELECT COUNT(*) FROM placedorders");
const cart_length = cartLengthResult.rows[0].count;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/home", function (req, res) {
  res.redirect("/");
});

app.get("/about", function (req, res) {
  res.render("about.ejs");
});

app.get("/contact_us", function (req, res) {
  res.render("contact.ejs");
});

app.get("/veg/home", function (req, res) {
  res.redirect("/");
});

app.get("/starter/home", function (req, res) {
  res.redirect("/");
});

app.get("/maincourse/home", function (req, res) {
  res.redirect("/");
});

app.get("/nonveg/home", function (req, res) {
  res.redirect("/");
});

app.get("/add/home", function (req, res) {
  res.redirect("/");
});

app.get("/menu", function (req, res) {
  res.render("menu.ejs");
});

app.get("/veg/menu", function (req, res) {
  res.render("v_meal.ejs", { cart_length });
});

app.get("/nonveg/menu", function (req, res) {
  res.render("nv_meal.ejs", { cart_length });
});

app.get("/previous", function (req, res) {
  res.redirect("/menu");
});

app.get("/previous_veg", function (req, res) {
  res.redirect("/veg/menu");
});

app.get("/previous_nveg", function (req, res) {
  res.redirect("/nonveg/menu");
});

app.get("/desserts", function (req, res) {
  res.render("desserts.ejs");
});

app.get("/starter/veg", function (req, res) {
  res.render("veg_starters.ejs");
});

app.get("/maincourse/veg", function (req, res) {
  res.render("v_maincourse.ejs");
});

app.get("/starter/nv", function (req, res) {
  res.render("nonveg_starters.ejs");
});

app.get("/maincourse/nv", function (req, res) {
  res.render("nonveg_main.ejs");
});

app.get("/beverages", function (req, res) {
  res.render("beverages.ejs");
});

app.get("/feedback", function (req, res) {
  res.render("feedback.ejs");
});

app.get("/viewcart", function (req, res) {
  res.redirect("/placeorder");
});

app.get("/proceed", function (req, res) {
  res.render("allergies_main.ejs");
});

app.get("/allergylist", function (req, res) {
  res.render("allergies_list.ejs");
});

app.get("/ordersummary", async function (req, res) {
  const orderedItems = await db.query(" SELECT food_items FROM placedorders ");
  const price = await db.query("SELECT price FROM placedorders");
  const totalAmount = await db.query(
    "SELECT SUM(price) AS total FROM placedorders"
  );
  const total = totalAmount.rows[0].total;
  const allergies = await db.query("SELECT name FROM allergies");

  res.render("summary.ejs", { orderedItems, price, total, allergies });
});

app.get("/placeorder", async function (req, res) {
  const orderedItems = await db.query(" SELECT food_items FROM placedorders ");
  const price = await db.query("SELECT price FROM placedorders");
  const totalAmount = await db.query(
    "SELECT SUM(price) AS total FROM placedorders"
  );
  const total = totalAmount.rows[0].total;

  res.render("order.ejs", { orderedItems, price, total });
});

app.post("/add/vstarter", async function (req, res) {
  const item = req.body.foodItem;
  const priceResult = await db.query(
    "SELECT price from MENU where food_item = ($1)",
    [item]
  );
  const price = priceResult.rows[0].price;
  try {
    await db.query("INSERT INTO placedorders (food_items) VALUES ($1)", [item]);
    await db.query(
      "UPDATE placedorders SET price = ($1) WHERE food_items = ($2)",
      [price, item]
    );

    const cartLengthResult = await db.query(
      "SELECT COUNT(*) FROM placedorders"
    );
    const cart_length = cartLengthResult.rows[0].count;

    res.render("veg_starters.ejs", { clicked: true, item, cart_length });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add/vmain", async function (req, res) {
  const item = req.body.foodItem;
  const priceResult = await db.query(
    "SELECT price from MENU where food_item = ($1)",
    [item]
  );
  const price = priceResult.rows[0].price;
  try {
    await db.query("INSERT INTO placedorders (food_items) VALUES ($1)", [item]);
    await db.query(
      "UPDATE placedorders SET price = ($1) WHERE food_items = ($2)",
      [price, item]
    );

    const cartLengthResult = await db.query(
      "SELECT COUNT(*) FROM placedorders"
    );
    const cart_length = cartLengthResult.rows[0].count;

    res.render("v_maincourse.ejs", { clicked: true, item, cart_length });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add/nvmain", async function (req, res) {
  const item = req.body.foodItem;
  const priceResult = await db.query(
    "SELECT price from MENU where food_item = ($1)",
    [item]
  );
  const price = priceResult.rows[0].price;
  try {
    await db.query("INSERT INTO placedorders (food_items) VALUES ($1)", [item]);
    await db.query(
      "UPDATE placedorders SET price = ($1) WHERE food_items = ($2)",
      [price, item]
    );

    const cartLengthResult = await db.query(
      "SELECT COUNT(*) FROM placedorders"
    );
    const cart_length = cartLengthResult.rows[0].count;

    res.render("nonveg_main.ejs", { clicked: true, item, cart_length });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add/nvstarter", async function (req, res) {
  const item = req.body.foodItem;
  const priceResult = await db.query(
    "SELECT price from MENU where food_item = ($1)",
    [item]
  );
  const price = priceResult.rows[0].price;
  try {
    await db.query("INSERT INTO placedorders (food_items) VALUES ($1)", [item]);
    await db.query(
      "UPDATE placedorders SET price = ($1) WHERE food_items = ($2)",
      [price, item]
    );

    const cartLengthResult = await db.query(
      "SELECT COUNT(*) FROM placedorders"
    );
    const cart_length = cartLengthResult.rows[0].count;

    res.render("nonveg_starters.ejs", { clicked: true, item, cart_length });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add/dessert", async function (req, res) {
  const item = req.body.foodItem;
  const priceResult = await db.query(
    "SELECT price from MENU where food_item = ($1)",
    [item]
  );
  const price = priceResult.rows[0].price;

  try {
    await db.query("INSERT INTO placedorders (food_items) VALUES ($1)", [item]);
    await db.query(
      "UPDATE placedorders SET price = ($1) WHERE food_items = ($2)",
      [price, item]
    );

    const cartLengthResult = await db.query(
      "SELECT COUNT(*) FROM placedorders"
    );
    const cart_length = cartLengthResult.rows[0].count;

    res.render("desserts.ejs", { clicked: true, item, cart_length });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add/beverage", async function (req, res) {
  const item = req.body.foodItem;
  const priceResult = await db.query(
    "SELECT price from MENU where food_item = ($1)",
    [item]
  );
  const price = priceResult.rows[0].price;
  try {
    await db.query("INSERT INTO placedorders (food_items) VALUES ($1)", [item]);
    await db.query(
      "UPDATE placedorders SET price = ($1) WHERE food_items = ($2)",
      [price, item]
    );

    const cartLengthResult = await db.query(
      "SELECT COUNT(*) FROM placedorders"
    );
    const cart_length = cartLengthResult.rows[0].count;

    res.render("beverages.ejs", { clicked: true, item, cart_length });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/delete_item", async function (req, res) {
  const item = req.body.foodItem;
  try {
    await db.query("DELETE FROM placedorders WHERE food_items=($1)", [item]);
    res.redirect("/placeorder");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add/allergy", async function (req, res) {
  const allergy = req.body.allergyItem;

  try {
    await db.query("INSERT INTO allergies (name) VALUES ($1)", [allergy]);

    res.render("allergies_list.ejs", { clicked: true, allergy });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/end", async function (req, res) {
  try {
    await db.query("DELETE FROM allergies");
    await db.query("DELETE FROM placedorders");

    res.render("conclusion.ejs");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, function () {
  console.log("Listening on port 3000");
});
