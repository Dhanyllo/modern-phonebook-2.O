import AuthSidePanel from "../../components/AuthSidePanel/AuthSidePanel";
import styles from "./Login.module.css";
import { useState } from "react";
import { Form, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleButton } from "../../components/GoogleButton/GoogleButton";

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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/google";
  };

  return (
    <div className={styles.pageContainer}>
      <AuthSidePanel />

      <div className={styles.rightSection}>
        <div className={`${styles.circle} ${styles.circlePrimary}`} />
        <div className={`${styles.circle} ${styles.circleAccent}`} />
        <div className={`${styles.circle} ${styles.circleSecondary}`} />

        <div className={styles.formWrapperMain}>
          <div className={styles.header}>
            <div className={styles.badge}>
              <span className={styles.badgeDot}></span>
              Welcome Back 👋
            </div>

            <div className={styles.title}>
              <span className={styles.gradientText}>Sign In</span>
            </div>
            <div className={styles.subtitle}>
              Enter your credentials to access your Modern Phonebook Account
            </div>
          </div>

          <div className={styles.formWrapper}>
            <Form
              method="post"
              action="/register"
              className={styles.form}
              onSubmit={() => setIsPending(true)}
            >
              <div className={styles.inputWrapper}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="damien.james@gmail.com"
                  className={styles.inputField}
                  required
                />
              </div>

              <div className={styles.inputWrapper}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={styles.inputField}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={styles.passwordToggle}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className={styles.passwordIcon} />
                    ) : (
                      <Eye className={styles.passwordIcon} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isPending}
              >
                {isPending ? (
                  <div className={styles.loadingWrapper}>
                    <Loader2 className={styles.loadingIcon} />
                    Creating Account...
                  </div>
                ) : (
                  <div className={styles.buttonContent}>
                    Sign In
                    <svg
                      className={styles.arrowIcon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                )}
              </button>

              <div
                className={styles.orDivider}
                aria-hidden="false"
                role="separator"
              >
                <span className={styles.orDividerText}>OR</span>
              </div>

              <GoogleButton
                label="Continue with Google"
                onClick={handleGoogleLogin}
              />

              <div className={styles.signInText}>
                Don't have an account?{" "}
                <Link to="/login" className={styles.signInLink}>
                  Create Account
                </Link>
              </div>

              <div className={styles.signInText}>
                <Link to="/login" className={styles.signInLink}>
                  Forgot your password?
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
