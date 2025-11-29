const DatabaseConnection = require("../config/config.js");

db = DatabaseConnection();

const getAllFavouriteContacts = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;

    // Fetch favourite contacts for the logged-in user
    const [results] = await db.query(
      `SELECT id, first_name, other_names, phone_number, image_url, favourite_status 
       FROM contact_profiles 
       WHERE user_id = ? 
         AND favourite_status = TRUE
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    // Count favourites for this user
    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total 
       FROM contact_profiles 
       WHERE user_id = ? 
         AND favourite_status = TRUE`,
      [userId]
    );

    const totalContacts = countResult[0].total;
    const totalPages = Math.ceil(totalContacts / limit);

    res.status(200).json({ data: results, totalPages });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchFavouriteContacts = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;

    const searchTerm = decodeURIComponent(
      req.query.searchParams ? req.query.searchParams.toLowerCase() : ""
    );

    const likeTerm = `%${searchTerm}%`;

    // Values for the main search query
    const values = [
      userId,
      likeTerm,
      likeTerm,
      searchTerm,
      searchTerm,
      likeTerm,
      searchTerm,
      limit,
      offset,
    ];

    // Values for the count query
    const values2 = [
      userId,
      likeTerm,
      likeTerm,
      searchTerm,
      searchTerm,
      likeTerm,
      searchTerm,
    ];

    const query = `
      SELECT *
      FROM contact_profiles
      WHERE user_id = ?
        AND favourite_status = TRUE
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

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM contact_profiles
      WHERE user_id = ?
        AND favourite_status = TRUE
        AND (
          LOWER(first_name) LIKE ?
          OR LOWER(other_names) LIKE ?
          OR SOUNDEX(LOWER(first_name)) = SOUNDEX(?)
          OR SOUNDEX(LOWER(other_names)) = SOUNDEX(?)
          OR LOWER(CONCAT(first_name, ' ', other_names)) LIKE ?
          OR SOUNDEX(LOWER(CONCAT(first_name, ' ', other_names))) = SOUNDEX(?)
        );
    `;

    const [countResult] = await db.query(countQuery, values2);

    const totalContacts = countResult?.[0]?.total || 0;
    const totalPages = Math.ceil(totalContacts / limit);

    res.status(200).json({ data: results, totalPages });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const favouriteExistStatus = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware

    const [results] = await db.query(
      `SELECT EXISTS (
          SELECT 1 
          FROM contact_profiles 
          WHERE user_id = ?
            AND favourite_status = TRUE
        ) AS exists_status`,
      [userId]
    );

    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const setFavourite = async (req, res) => {
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
};

module.exports = {
  getAllFavouriteContacts,
  searchFavouriteContacts,
  favouriteExistStatus,
  setFavourite,
};
