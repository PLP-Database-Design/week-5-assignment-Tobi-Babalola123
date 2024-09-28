const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");

app.use(express.json());
app.use(cors());
dotenv.config();

// connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "MERviccity2022@@",
  database: process.env.DB_NAME || "hospital",
});

// Check if there is a connection
db.connect((err) => {
  // If no connection
  if (err) return console.log("Error connecting to MYSQL");

  //If connect works successfully
  console.log("Connected to MYSQL as id: ", db.threadId);
});

// < YOUR code goes down here

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Handle GET requests to the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Hospital API!"); // You can customize this response
});

// Data is a file found in the Views folder

app.get("/data", (req, res) => {
  // Retrieve data from database
  db.query("SELECT * FROM patients", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error Retrieving data");
    } else {
      //Display the records to the browser
      res.render("data", { results: results });
    }
  });
});

app.get("/providers", (req, res) => {
  // Retrieve data from database
  db.query("SELECT * FROM providers", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error Retrieving providers");
    } else {
      //Display the records to the browser
      res.render("providers", { results: results });
    }
  });
});

app.get("/patients", (req, res) => {
  const firstName = req.query.first_name; // Get the first name from query parameters

  // SQL query to filter patients by first name
  const sql = "SELECT * FROM patients WHERE first_name = ?";

  db.query(sql, [firstName], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error Retrieving data");
    }

    if (results.length === 0) {
      return res.status(404).send("No patients found with that first name");
    }

    // Display the records to the browser
    res.render("data", { results: results });
  });
});

app.get("/providers-by-specialty", (req, res) => {
  const specialty = req.query.specialty; // Extract the specialty from the query parameters

  if (!specialty) {
    return res.status(400).send("Specialty is required to filter providers.");
  }

  const sql = "SELECT * FROM providers WHERE provider_specialty = ?";

  db.query(sql, [specialty], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error retrieving providers by specialty");
    }

    // Check if any providers were found
    if (results.length === 0) {
      return res
        .status(404)
        .send("No providers found with the specified specialty");
    }

    // Send the filtered providers as the response
    res.json(results);
  });
});

// Question 4 goes here

// listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`);
});
