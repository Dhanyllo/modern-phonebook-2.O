import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  return (
    <div className={styles.container}>
      {/* Left Side */}
      <div className={styles.leftSide}></div>

      {/* Right Side */}
      <div className={styles.rightSide}>
        <div className={styles.rightSideContent}>
          <div className={styles.forgotPasswordLayer1}>Forgot Password</div>

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
                  <img src="images/email-icon.png" alt="email" />
                </div>

                <button type="submit">Submit</button>
              </div>
            </form>

            <div className={styles.backToMenu}>
              <a className={styles.mainMenuLink} href="">
                <img src="/images/left-arrow.png" alt="left arrow" />
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
