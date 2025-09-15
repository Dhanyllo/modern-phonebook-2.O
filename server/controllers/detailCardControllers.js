const DatabaseConnection = require("../config/config.js");

db = DatabaseConnection();

const getContactDetails = async (req, res) => {
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
};

const fetchOccupations = async (req, res) => {
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
};

module.exports = { getContactDetails, fetchOccupations };
