import styles from "./ForgotPassword.module.css";
import { useDarkMode } from "../../hooks/useDarkmode";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";

const ForgotPassword = () => {
  const { darkMode } = useDarkMode();
  return (
    <div data-darkmode={darkMode} className={styles.container}>
      {/* Left Side */}
      <div className={styles.leftSide}></div>

      {/* Right Side */}
      <div className={styles.rightSide}>
        <div className={styles.rightSideContent}>
          <div className={styles.forgotPasswordLayer1}>Reset your password</div>

          <div className={styles.forgotPasswordLayer2}>
            <form>
              <div className={styles.passwordFormWrap}>
                <label htmlFor="passwordChange">
                  Enter your email and we will send you an email to reset
                  Password
                </label>

                <div className={styles.passwordInputWrap}>
                  <input
                    type="text"
                    placeholder="danielotchere@gmail.com"
                    name="changePassword"
                    id="passwordChange"
                  />
                  <AiOutlineMail className={styles.emailIcon} />
                </div>

                <button type="submit">Send password reset email</button>
              </div>
            </form>

            <div className={styles.backToMenu}>
              <a className={styles.mainMenuLink} href="">
                <MdOutlineKeyboardArrowLeft className={styles.leftArrow} />
                Back to login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
