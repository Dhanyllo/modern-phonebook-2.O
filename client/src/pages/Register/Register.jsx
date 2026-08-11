import AuthSidePanel from "../../components/AuthSidePanel/AuthSidePanel";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import { useDarkMode } from "../../hooks/useDarkmode";
import { redirect } from "react-router-dom";
import { registerUser } from "../../api/registerUser";
import styles from "./Register.module.css";

export async function action({ request }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const formData = await request.formData();

  const firstName = formData.get("firstName");
  const otherNames = formData.get("otherNames");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // Frontend validation
  if (!firstName || !otherNames || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const result = await registerUser(apiUrl, {
      first_name: firstName,
      other_names: otherNames,
      email,
      password,
    });

    sessionStorage.setItem("otpSessionToken", result.otpSessionToken);

    // redirect (no back to register)
    return redirect("/verify-otp", { replace: true });
  } catch (error) {
    return { error: error.message };
  }
}

const Register = () => {
  const { darkMode } = useDarkMode();
  return (
    <div data-darkmode={darkMode} className={styles.pageContainer}>
      <AuthSidePanel />

      <div className={styles.rightSection}>
        <div className={`${styles.circle} ${styles.circlePrimary}`} />
        <div className={`${styles.circle} ${styles.circleAccent}`} />
        <div className={`${styles.circle} ${styles.circleSecondary}`} />

        <div className={styles.formWrapperMain}>
          <div className={styles.header}>
            <div className={styles.badge}>
              <span className={styles.badgeDot}></span>
              Join Our Community
            </div>

            <div className={styles.title}>
              <span className={styles.gradientText}>Create Account</span>
            </div>
            <div className={styles.subtitle}>
              Simplify how you manage and connect with your contacts — all in
              one place with{" "}
              <b className={styles.brandName}>
                Mphone&nbsp;<small>2</small>.O
              </b>
            </div>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
