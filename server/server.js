const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const DatabaseConnection = require("./config.js");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = DatabaseConnection();

app.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;

    const [results] = await db.query(
      "SELECT id,first_name,other_names,phone_number,image_url,favourite_status FROM contact_profiles LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total FROM contact_profiles`
    );

    const totalContacts = countResult[0].total;
    const totalPages = Math.ceil(totalContacts / limit);

    res.status(200).json({ data: results, totalPages });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/favourites", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;

    const [results] = await db.query(
      "SELECT id,first_name,other_names,phone_number,image_url,favourite_status FROM contact_profiles WHERE favourite_status = True LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total FROM contact_profiles WHERE favourite_status = True`
    );

    const totalContacts = countResult[0].total;
    const totalPages = Math.ceil(totalContacts / limit);

    res.status(200).json({ data: results, totalPages });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/favstatus", async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT EXISTS (SELECT 1 FROM contact_profiles WHERE favourite_status = TRUE) AS exists_status"
    );
    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/detail/:id", async (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid ID" });

  try {
    const [results] = await db.query(
      "SELECT * FROM contact_profiles LEFT JOIN media_handles ON contact_profiles.id = media_handles.contact_id WHERE contact_profiles.id  = ?",
      [parsedId]
    );
    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/detail/occupations/:id", async (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid ID" });

  try {
    const [results] = await db.query(
      "SELECT contact_profiles.id AS contactID, occupations.id AS occupationID,occupation FROM contact_profiles INNER JOIN occupations ON contact_profiles.id = occupations.contact_id WHERE contact_profiles.id  = ?",
      [parsedId]
    );
    res.status(200).json(results);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/search/home", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;
    const searchTerm = decodeURIComponent(
      req.query.searchParams ? req.query.searchParams.toLowerCase() : ""
    );

    const values = [
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      searchTerm,
      searchTerm,
      `%${searchTerm}%`,
      searchTerm,
      limit,
      offset,
    ];

    const values2 = [
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      searchTerm,
      searchTerm,
      `%${searchTerm}%`,
      searchTerm,
    ];

    const query = `
      SELECT * FROM contact_profiles 
      WHERE 
        LOWER(first_name) LIKE ? 
        OR LOWER(other_names) LIKE ? 
        OR SOUNDEX(LOWER(first_name)) = SOUNDEX(?) 
        OR SOUNDEX(LOWER(other_names)) = SOUNDEX(?) 
        OR LOWER(CONCAT(first_name, ' ', other_names)) LIKE ? 
        OR SOUNDEX(LOWER(CONCAT(first_name, ' ', other_names))) = SOUNDEX(?)
      LIMIT ? OFFSET ?;
    `;

    const [results] = await db.query(query, values);

    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total FROM contact_profiles 
      WHERE 
        LOWER(first_name) LIKE ? 
        OR LOWER(other_names) LIKE ? 
        OR SOUNDEX(LOWER(first_name)) = SOUNDEX(?) 
        OR SOUNDEX(LOWER(other_names)) = SOUNDEX(?) 
        OR LOWER(CONCAT(first_name, ' ', other_names)) LIKE ? 
        OR SOUNDEX(LOWER(CONCAT(first_name, ' ', other_names))) = SOUNDEX(?);`,
      values2
    );

    const totalContacts = countResult?.[0]?.total || 0;
    const totalPages = Math.ceil(totalContacts / limit);

    res.status(200).json({ data: results, totalPages });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/search/favourites", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;
    const searchTerm = decodeURIComponent(
      req.query.searchParams ? req.query.searchParams.toLowerCase() : ""
    );

    const values = [
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      searchTerm,
      searchTerm,
      `%${searchTerm}%`,
      searchTerm,
      limit,
      offset,
    ];

    const values2 = [
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      searchTerm,
      searchTerm,
      `%${searchTerm}%`,
      searchTerm,
    ];

    const query = `
      SELECT * FROM contact_profiles 
      WHERE favourite_status = True 
      AND (
        LOWER(first_name) LIKE ? 
        OR LOWER(other_names) LIKE ? 
        OR SOUNDEX(LOWER(first_name)) = SOUNDEX(?) 
        OR SOUNDEX(LOWER(other_names)) = SOUNDEX(?) 
        OR LOWER(CONCAT(first_name, ' ', other_names)) LIKE ? 
        OR SOUNDEX(LOWER(CONCAT(first_name, ' ', other_names))) = SOUNDEX(?)
      ) 
      LIMIT ? OFFSET ?;
    `;

    const [results] = await db.query(query, values);

    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total FROM contact_profiles 
        WHERE favourite_status = True 
        AND (
          LOWER(first_name) LIKE ? 
          OR LOWER(other_names) LIKE ? 
          OR SOUNDEX(LOWER(first_name)) = SOUNDEX(?) 
          OR SOUNDEX(LOWER(other_names)) = SOUNDEX(?) 
          OR LOWER(CONCAT(first_name, ' ', other_names)) LIKE ? 
          OR SOUNDEX(LOWER(CONCAT(first_name, ' ', other_names))) = SOUNDEX(?)
        );`,
      values2
    );

    const totalContacts = countResult?.[0]?.total || 0;
    const totalPages = Math.ceil(totalContacts / limit);

    res.status(200).json({ data: results, totalPages });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { favourite_status } = req.body;

    await db.query(
      "UPDATE contact_profiles SET favourite_status = ? WHERE id = ?",
      [favourite_status, id]
    );

    res.json({ message: "Updated successful" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Database update failed" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
