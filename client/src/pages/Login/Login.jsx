import styles from "./Login.module.css";

const Login = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSide}>
        <div className={styles.leftSideCentered}>
          <div className={styles.imgIcon}>
            <img
              className={styles.companyLogo}
              src="/images/logo.png"
              alt="company Logo"
            />
          </div>
          {/* <div className={styles.PageTitle}>MPhone 2.O</div> */}
          <div className={styles.title}>Sign in to your account</div>
          <br />

          <form action="display-surveys.html" method="get">
            <div className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <label htmlFor="Email">Email Address:</label>
                <input
                  className={styles.input1}
                  type="text"
                  name="Email"
                  id="Email"
                />
              </div>

              <div className={styles.inputWrapper}>
                <label htmlFor="Password">Password:</label>
                <input
                  className={styles.input2}
                  type="password"
                  name="Password"
                  id="Password"
                />
              </div>

              <div className={styles.inputWrapperCheckbox}>
                <div className={styles.forgotPasswordField}>
                  <div className={styles.checkboxAlign}>
                    <input
                      className={styles.input3}
                      type="checkbox"
                      name="Remember-me"
                      id="remember"
                      value="Yes"
                    />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <a href="/">Forgot password?</a>
                </div>
              </div>

              <button type="submit">Sign In</button>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.rightSide}>
        <img src="/images/IMG1.webp" alt="wallpaper" />
      </div>
    </div>
  );
};

export default Login;
