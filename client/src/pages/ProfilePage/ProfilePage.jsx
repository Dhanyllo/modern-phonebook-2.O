import { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import styles from "./ProfilePage.module.css";

export const profileAction = async ({ request }) => {
  const formData = await request.formData();

  const firstName = formData.get("firstName");
  const otherNames = formData.get("otherNames");
  const email = formData.get("email");
  const picture = formData.get("picture"); // file input

  console.log("Updated Profile:", {
    firstName,
    otherNames,
    email,
    picture,
  });

  if (email !== "john.doe@example.com") {
    console.log("Email update pending verification:", email);
  }

  return null;
};

const ProfilePage = () => {
  const [preview, setPreview] = useState("https://via.placeholder.com/120");
  const [file, setFile] = useState(null);

  const handlePictureChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // 👇 Generate and clean up the object URL
  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl); // cleanup
    };
  }, [file]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Profile</h2>

        <Form
          method="post"
          encType="multipart/form-data"
          className={styles.form}
        >
          {/* Profile Picture */}
          <div className={styles.pictureWrapper}>
            <img src={preview} alt="Profile" className={styles.picture} />
            <label className={styles.pictureLabel}>
              Change Picture
              <input
                type="file"
                name="picture"
                accept="image/*"
                onChange={handlePictureChange}
                className={styles.fileInput}
              />
            </label>
          </div>

          {/* First Name */}
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              defaultValue="John"
              required
            />
          </div>

          {/* Other Names */}
          <div className={styles.formGroup}>
            <label htmlFor="otherNames">Other Names</label>
            <input
              type="text"
              id="otherNames"
              name="otherNames"
              defaultValue="Doe"
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue="john.doe@example.com"
              required
            />
            <span className={styles.pendingNote}>
              Changing email will require verification
            </span>
          </div>

          {/* Save Button */}
          <button type="submit" className={styles.button}>
            Save Changes
          </button>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
