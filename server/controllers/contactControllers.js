const DatabaseConnection = require("../config/config.js");
const processAndSaveImage = require("../utils/processImage.js");
const path = require("path");
const fs = require("fs");
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
      occupations,
      twitter,
      instagram,
      facebook,
      whatsapp,
      linkedin,
    } = req.body;

    const media_handles = { twitter, instagram, facebook, whatsapp, linkedin };
    const userId = req.user.id;

    let image_url = null;

    if (req.file) {
      image_url = await processAndSaveImage(req.file.buffer);
    }

    await connection.beginTransaction();

    // Insert Contact
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
        image_url, // already relative
        userId,
      ]
    );

    const contactId = contactResult.insertId;

    // Insert media handles
    await connection.query(
      `INSERT INTO media_handles (
        twitter, instagram, facebook, whatsapp, linkedin, contact_id, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        media_handles.twitter || null,
        media_handles.instagram || null,
        media_handles.facebook || null,
        media_handles.whatsapp || null,
        media_handles.linkedin || null,
        contactId,
        userId,
      ]
    );

    // Insert occupations
    if (occupations && occupations.length > 0) {
      for (const occupation of occupations) {
        await connection.query(
          `INSERT INTO occupations (occupation, contact_id, user_id) VALUES (?, ?, ?)`,
          [occupation, contactId, userId]
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
      twitter,
      instagram,
      facebook,
      whatsapp,
      linkedin,
      occupations,
    } = req.body;

    const userId = req.user.id;

    let newImageUrl = null;

    // If a new file was uploaded, process it
    if (req.file) {
      newImageUrl = await processAndSaveImage(req.file.buffer);
    }

    await connection.beginTransaction();

    // Check existing contact + image
    const [existing] = await connection.query(
      `SELECT image_url FROM contact_profiles WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (existing.length === 0) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this contact",
      });
    }

    const oldImageUrl = existing[0].image_url;

    // Determine final image
    const finalImageUrl = newImageUrl || oldImageUrl;

    // Update contact profile
    await connection.query(
      `UPDATE contact_profiles 
        SET first_name = ?, 
            other_names = ?, 
            phone_number = ?, 
            email = ?, 
            home_address = ?, 
            favourite_status = ?, 
            image_url = ?
        WHERE id = ? AND user_id = ?`,
      [
        first_name,
        other_names,
        phone_number,
        email,
        home_address,
        favourite_status,
        finalImageUrl,
        id,
        userId,
      ]
    );

    // Update media handles
    await connection.query(
      `UPDATE media_handles 
        SET twitter = ?, instagram = ?, facebook = ?, whatsapp = ?, linkedin = ?
        WHERE contact_id = ? AND user_id = ?`,
      [
        twitter || null,
        instagram || null,
        facebook || null,
        whatsapp || null,
        linkedin || null,
        id,
        userId,
      ]
    );

    // Refresh occupations
    await connection.query(
      `DELETE FROM occupations WHERE contact_id = ? AND user_id = ?`,
      [id, userId]
    );

    if (occupations && occupations.length > 0) {
      for (const occupation of occupations) {
        await connection.query(
          `INSERT INTO occupations (occupation, contact_id, user_id)
           VALUES (?, ?, ?)`,
          [occupation, id, userId]
        );
      }
    }

    await connection.commit();

    // -----------------------------------------
    //   DELETE OLD IMAGE (AFTER COMMIT)
    // -----------------------------------------
    if (newImageUrl && oldImageUrl) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        oldImageUrl.replace(/^\//, "")
      );

      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.warn("Could not delete old image:", err);
        }
      });
    }

    res.json({
      success: true,
      message: "Contact updated successfully",
    });
  } catch (err) {
    await connection.rollback();
    console.error("Update contact error:", err);

    res.status(500).json({
      success: false,
      message: "Server error during contact update",
    });
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

const getContactById = async (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    // ---------------------------------------
    // 1. FETCH CONTACT + MEDIA HANDLES
    // ---------------------------------------
    const [contactResults] = await db.query(
      `
      SELECT 
        contact_profiles.id,
        contact_profiles.first_name,
        contact_profiles.other_names,
        contact_profiles.phone_number,
        contact_profiles.email,
        contact_profiles.home_address,
        contact_profiles.image_url,
        contact_profiles.favourite_status,
        media_handles.twitter,
        media_handles.instagram,
        media_handles.facebook,
        media_handles.whatsapp,
        media_handles.linkedin
      FROM contact_profiles
      LEFT JOIN media_handles 
        ON contact_profiles.id = media_handles.contact_id
      WHERE contact_profiles.id = ?
      `,
      [parsedId]
    );

    if (!contactResults.length) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const contact = contactResults[0];

    // ---------------------------------------
    // 2. FETCH OCCUPATIONS (ARRAY OF ROWS)
    // ---------------------------------------
    const [occupationResults] = await db.query(
      `
      SELECT occupation
      FROM occupations
      WHERE contact_id = ?
      `,
      [parsedId]
    );

    const occupations = occupationResults.map((row) => row.occupation);

    // ---------------------------------------
    // 3. RETURN COMBINED OUTPUT
    // ---------------------------------------

    res.status(200).json({
      ...contact,
      occupations,
    });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  createContact,
  updateContact,
  deleteContact,
  getContactById,
};
