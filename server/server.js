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

// Handle preflight
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db = DatabaseConnection();

app.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const offset = (page - 1) * limit;

  db.query(
    "SELECT id,first_name,other_names,phone_number,image_url,favourite_status FROM contact_profiles LIMIT ? OFFSET ?",
    [limit, offset],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      db.query(
        `SELECT COUNT(*) AS total FROM contact_profiles`,
        (err, countResult) => {
          if (err) {
            console.error("Error getting total count:", err);
            return res.status(500).json({ message: "Internal Server Error" });
          }

          const totalContacts = countResult[0].total;
          const totalPages = Math.ceil(totalContacts / limit);

          res.status(200).json({
            data: results,
            totalPages: totalPages,
          });
        }
      );
    }
  );
});

app.get("/favourites", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const offset = (page - 1) * limit;

  db.query(
    "SELECT id,first_name,other_names,phone_number,image_url,favourite_status FROM contact_profiles WHERE favourite_status = True LIMIT ? OFFSET ?",
    [limit, offset],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      db.query(
        `SELECT COUNT(*) AS total FROM contact_profiles WHERE favourite_status = True`,
        (err, countResult) => {
          if (err) {
            console.error("Error getting total count:", err);
            return res.status(500).json({ message: "Internal Server Error" });
          }

          const totalContacts = countResult[0].total;
          const totalPages = Math.ceil(totalContacts / limit);

          res.status(200).json({
            data: results,
            totalPages: totalPages,
          });
        }
      );
    }
  );
});

app.get("/favstatus", (req, res) => {
  db.query(
    "SELECT EXISTS (SELECT 1 FROM contact_profiles WHERE favourite_status = TRUE) AS exists_status",
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(200).json(results[0]);
    }
  );
});

app.get("/detail/:id", (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  db.query(
    "SELECT * FROM contact_profiles LEFT JOIN media_handles ON contact_profiles.id = media_handles.contact_id WHERE contact_profiles.id  = ?",
    parsedId,
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(200).json(results[0]);
    }
  );
});

app.get("/detail/occupations/:id", (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  db.query(
    "SELECT contact_profiles.id AS contactID, occupations.id AS occupationID,occupation FROM contact_profiles LEFT JOIN occupations ON contact_profiles.id = occupations.contact_id WHERE contact_profiles.id  = ?",
    parsedId,
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(200).json(results);
    }
  );
});

app.get("/search/home", (req, res) => {
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

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    db.query(
      `SELECT COUNT(*) AS total FROM contact_profiles 
    WHERE 
      LOWER(first_name) LIKE ? 
      OR LOWER(other_names) LIKE ? 
      OR SOUNDEX(LOWER(first_name)) = SOUNDEX(?) 
      OR SOUNDEX(LOWER(other_names)) = SOUNDEX(?) 
      OR LOWER(CONCAT(first_name, ' ', other_names)) LIKE ? 
      OR SOUNDEX(LOWER(CONCAT(first_name, ' ', other_names))) = SOUNDEX(?);
  `,
      values2,
      (err, countResult) => {
        if (err) {
          console.error("Error getting total count:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        const totalContacts = countResult?.[0]?.total || 0;
        const totalPages = Math.ceil(totalContacts / limit);

        res.status(200).json({
          data: results,
          totalPages: totalPages,
        });
      }
    );
  });
});

app.get("/search/favourites", (req, res) => {
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

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    db.query(
      `SELECT COUNT(*) AS total FROM contact_profiles 
        WHERE favourite_status = True 
        AND (
          LOWER(first_name) LIKE ? 
          OR LOWER(other_names) LIKE ? 
          OR SOUNDEX(LOWER(first_name)) = SOUNDEX(?) 
          OR SOUNDEX(LOWER(other_names)) = SOUNDEX(?) 
          OR LOWER(CONCAT(first_name, ' ', other_names)) LIKE ? 
          OR SOUNDEX(LOWER(CONCAT(first_name, ' ', other_names))) = SOUNDEX(?)
        );
`,
      values2,
      (err, countResult) => {
        if (err) {
          console.error("Error getting total count:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        const totalContacts = countResult?.[0]?.total || 0;
        const totalPages = Math.ceil(totalContacts / limit);

        res.status(200).json({
          data: results,
          totalPages: totalPages,
        });
      }
    );
  });
});

app.patch("/update/:id", (req, res) => {
  const { id } = req.params;
  const { favourite_status } = req.body;

  db.query(
    "UPDATE contact_profiles SET favourite_status = ? WHERE id = ?",
    [favourite_status, id],
    (err, result) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ message: "Database update failed" });
      }
      res.json({ message: "Updated successful" });
    }
  );
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
