import { useState, useEffect } from "react";
import { Form, useNavigate } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { useDarkMode } from "../../hooks/useDarkmode";

export const profileAction = async ({ request }) => {
  const formData = await request.formData();

  const firstName = formData.get("firstName");
  const otherNames = formData.get("otherNames");
  const email = formData.get("email");
  const picture = formData.get("picture");

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
  const [preview, setPreview] = useState("/images/profile.jpg");
  const [file, setFile] = useState(null);
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  const handlePictureChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemovePicture = () => {
    setFile(null);
    setPreview("/images/profile.jpg");
  };

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <div data-darkmode={darkMode} className={styles.page}>
      <div className={styles.card}>
        <button
          type="button"
          onClick={() => navigate("/")}
          className={styles.backButton}
        >
          <IoIosArrowBack />
          <div>Back</div>
        </button>

        <div className={styles.title}>Profile</div>

        <Form
          method="post"
          encType="multipart/form-data"
          className={styles.form}
        >
          <div className={styles.pictureWrapper}>
            <div className={styles.pictureContainer}>
              <img src={preview} alt="Profile" className={styles.picture} />
            </div>

            <div className={styles.pictureActions}>
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

              <button
                type="button"
                onClick={handleRemovePicture}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="firstName" className={styles.label}>
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              defaultValue="John"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="otherNames" className={styles.label}>
              Other Names
            </label>
            <input
              type="text"
              id="otherNames"
              name="otherNames"
              defaultValue="Doe"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue="john.doe@example.com"
              required
              className={styles.input}
            />
            <span className={styles.pendingNote}>
              Changing email will require verification
            </span>
          </div>

          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
