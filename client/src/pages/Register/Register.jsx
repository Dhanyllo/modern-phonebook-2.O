import AuthSidePanel from "../../components/AuthSidePanel/AuthSidePanel";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import { useDarkMode } from "../../context/DarkModeContext";
import styles from "./Register.module.css";

// --- Action function for the form ---
export async function action({ request }) {
  const formData = await request.formData();

  // Grab fields by their "name" attribute
  const firstName = formData.get("firstName");
  const otherNames = formData.get("otherNames");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // Example basic validation
  if (!firstName || otherNames || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  // TODO: Replace with backend API call
  console.log("Form submitted:", { firstName, otherNames, email, password });

  // Redirect or return data
  return { success: true };
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
              <b class={styles.brandName}>
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
