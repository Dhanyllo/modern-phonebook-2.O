import { Form } from "react-router-dom";
import styles from "./ChangePassword.module.css";
import { useDarkMode } from "../../hooks/useDarkmode";

export const changePasswordAction = async ({ request }) => {
  const formData = await request.formData();

  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  console.log("Password change request:", {
    currentPassword,
    newPassword,
  });

  // Example: send to backend
  // const res = await fetch("/api/change-password", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ currentPassword, newPassword }),
  // });

  return null; // redirect("/dashboard") on success if needed
};

const ChangePassword = () => {
  const { darkMode } = useDarkMode();

  return (
    <div data-darkmode={darkMode} className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Change Password</h2>

        <Form method="post" className={styles.form}>
          {/* Current Password */}
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              required
            />
          </div>

          {/* New Password */}
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              required
              minLength={6}
            />
          </div>

          {/* Confirm New Password */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className={styles.button}>
            Update Password
          </button>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
