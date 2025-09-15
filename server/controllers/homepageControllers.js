const DatabaseConnection = require("../config/config.js");

db = DatabaseConnection();

const getAllContacts = async (req, res) => {
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
};

const searchContacts = async (req, res) => {
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
};

module.exports = { getAllContacts, searchContacts };
