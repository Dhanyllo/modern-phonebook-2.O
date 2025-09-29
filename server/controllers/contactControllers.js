const DatabaseConnection = require("../config/config.js");
const db = DatabaseConnection();

const createContact = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const {
      first_name,
      other_names,
      phone_number,
      email,
      home_address,
      favourite_status,
      image_url,
      media_handles,
      occupations,
    } = req.body;
    const userId = req.user.id; //comes from JWT middleware

    await connection.beginTransaction();

    // Insert into contact_profiles
    const [contactResult] = await connection.query(
      `INSERT INTO contact_profiles 
        (first_name, other_names, phone_number, email, home_address, favourite_status, image_url, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        other_names,
        phone_number,
        email,
        home_address,
        favourite_status,
        image_url,
        userId,
      ]
    );

    const contactId = contactResult.insertId;

    // Insert into media_handles (if provided)
    if (media_handles) {
      await connection.query(
        `INSERT INTO media_handles (twitter, instagram, facebook, whatsapp, linkedin, contact_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          media_handles.twitter || null,
          media_handles.instagram || null,
          media_handles.facebook || null,
          media_handles.whatsapp || null,
          media_handles.linkedin || null,
          contactId,
        ]
      );
    }

    // Insert into occupations (if provided)
    if (occupations && occupations.length > 0) {
      for (const occupation of occupations) {
        await connection.query(
          `INSERT INTO occupations (occupation, contact_id) VALUES (?, ?)`,
          [occupation, contactId]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      contactId,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Create contact error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during contact creation",
    });
  } finally {
    connection.release();
  }
};

// Update contact
const updateContact = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;
    const {
      first_name,
      other_names,
      phone_number,
      email,
      home_address,
      favourite_status,
      image_url,
      media_handles,
      occupations,
    } = req.body;
    const userId = req.user.id;

    await connection.beginTransaction();

    // Ensure the contact belongs to the logged-in user
    const [existing] = await connection.query(
      "SELECT id FROM contact_profiles WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    if (existing.length === 0) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this contact",
      });
    }

    // Update contact_profiles
    await connection.query(
      `UPDATE contact_profiles 
       SET first_name = ?, other_names = ?, phone_number = ?, email = ?, home_address = ?, favourite_status = ?, image_url = ? 
       WHERE id = ? AND user_id = ?`,
      [
        first_name,
        other_names,
        phone_number,
        email,
        home_address,
        favourite_status,
        image_url,
        id,
        userId,
      ]
    );

    // Update media_handles
    if (media_handles) {
      await connection.query(
        `UPDATE media_handles 
         SET twitter = ?, instagram = ?, facebook = ?, whatsapp = ?, linkedin = ? 
         WHERE contact_id = ?`,
        [
          media_handles.twitter || null,
          media_handles.instagram || null,
          media_handles.facebook || null,
          media_handles.whatsapp || null,
          media_handles.linkedin || null,
          id,
        ]
      );
    }

    // Refresh occupations (delete + re-insert)
    if (occupations) {
      await connection.query("DELETE FROM occupations WHERE contact_id = ?", [
        id,
      ]);
      for (const occupation of occupations) {
        await connection.query(
          `INSERT INTO occupations (occupation, contact_id) VALUES (?, ?)`,
          [occupation, id]
        );
      }
    }

    await connection.commit();

    res.json({ success: true, message: "Contact updated successfully" });
  } catch (err) {
    await connection.rollback();
    console.error("Update contact error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during contact update" });
  } finally {
    connection.release();
  }
};

const deleteContact = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;
    const userId = req.user.id; // comes from verifyJWT middleware

    await connection.beginTransaction();

    // Ensure contact belongs to the logged-in user
    const [existing] = await connection.query(
      "SELECT id FROM contact_profiles WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (existing.length === 0) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this contact",
      });
    }

    // Delete the contact (cascade will handle related tables)
    await connection.query(
      "DELETE FROM contact_profiles WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (err) {
    await connection.rollback();
    console.error("Delete contact error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during contact deletion",
    });
  } finally {
    connection.release();
  }
};

module.exports = { createContact, updateContact, deleteContact };
