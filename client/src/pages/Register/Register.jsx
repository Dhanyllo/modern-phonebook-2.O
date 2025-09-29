import AuthSidePanel from "../../components/AuthSidePanel/AuthSidePanel";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import styles from "./Register.module.css";

// --- Action function for the form ---
export async function action({ request }) {
  const formData = await request.formData();

  // Grab fields by their "name" attribute
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // Example basic validation
  if (!fullName || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  // TODO: Replace with backend API call
  console.log("Form submitted:", { fullName, email, password });

  // Redirect or return data
  return { success: true };
}

// --- Page component ---
const Register = () => {
  return (
    <div className={styles.pageContainer}>
      {/* Left Side Panel */}
      <AuthSidePanel />

      {/* Right Section */}
      <div className={styles.rightSection}>
        {/* Background Circles */}
        <div className={`${styles.circle} ${styles.circlePrimary}`} />
        <div className={`${styles.circle} ${styles.circleSecondary}`} />
        <div className={`${styles.circle} ${styles.circleAccent}`} />

        {/* Form Wrapper */}
        <div className={styles.formWrapper}>
          <div className={styles.header}>
            <div className={styles.badge}>
              <span className={styles.badgeDot}></span>
              Join Our Community
            </div>

            <h2 className={styles.title}>
              <span className={styles.gradientText}>Create Account</span>
            </h2>
            <p className={styles.subtitle}>
              Join SnapDish and start making a difference in your community
              through food sharing
            </p>
          </div>

          {/* Registration Form */}
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
