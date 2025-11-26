import styles from "./ResetPassword.module.css";
import { useDarkMode } from "../../hooks/useDarkmode";

const ResetPassword = () => {
  const { darkMode } = useDarkMode();

  return (
    <div data-darkmode={darkMode} className={styles.pageWrapper}>
      <div className={styles.changePasswordContainer}>
        <div className={styles.title}>Change your password</div>

        <form>
          <div className={styles.passwordInputNest}>
            <div className={styles.desc}>
              Enter your new password to change your password
            </div>

            <div className={styles.changePasswordInput1}>
              <label htmlFor="New">New Password</label>
              <input
                type="password"
                placeholder="New Password"
                name="NewPassword"
                id="New"
              />
            </div>

            <div className={styles.changePasswordInput2}>
              <label htmlFor="Confirm">Confirm new password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                name="ConfirmPassword"
                id="Confirm"
              />
            </div>

            <button type="submit">Change Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
