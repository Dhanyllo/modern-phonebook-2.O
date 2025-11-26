import { useState } from "react";
import { Form, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleButton } from "../../components/GoogleButton/GoogleButton";
import { useDarkMode } from "../../hooks/useDarkmode";
import styles from "./RegisterForm.module.css";

const RegisterForm = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { darkMode } = useDarkMode();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}/google`;
  };

  return (
    <div data-darkmode={darkMode} className={styles.formWrapper}>
      <Form
        method="post"
        action="/register"
        className={styles.form}
        onSubmit={() => setIsPending(true)}
      >
        <div className={styles.inputWrapper}>
          <label htmlFor="firstName" className={styles.label}>
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Daniel"
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="otherNames" className={styles.label}>
            Other Names
          </label>
          <input
            id="OtherNames"
            name="OtherNames"
            type="text"
            placeholder="Asante Otchere"
            className={styles.inputField}
            required
          />
        </div>

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

        <div className={styles.inputWrapper}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={styles.inputField}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className={styles.passwordToggle}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
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
              Create Account
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

        <div className={styles.orDivider} aria-hidden="false" role="separator">
          <span className={styles.orDividerText}>OR</span>
        </div>

        <GoogleButton
          label="Continue with Google"
          onClick={handleGoogleLogin}
        />

        <div className={styles.signInText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.signInLink}>
            Sign In
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
