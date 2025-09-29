import { useState } from "react";
import { Form, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleButton } from "../../components/GoogleButton/GoogleButton";

import styles from "./RegisterForm.module.css";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  return (
    <div className={styles.formWrapper}>
      {/* 
        action="/register" → must match the route’s action in your router setup 
        method="post" → standard POST submit
      */}
      <Form
        method="post"
        action="/register"
        className={styles.form}
        onSubmit={() => setIsPending(true)}
      >
        {/* Full Name */}
        <label htmlFor="fullName" className={styles.label}>
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Alex Jordan"
          className={styles.inputField}
          required
        />

        {/* Email */}
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="alex.jordan@gmail.com"
          className={styles.inputField}
          required
        />

        {/* Password */}
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

        {/* Confirm Password */}
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

        {/* Divider */}
        <div className={styles.dividerWrapper}>
          <div className={styles.dividerLine}></div>
          <span className={styles.dividerText}>OR</span>
        </div>

        {/* Google Button */}
        <GoogleButton label="Continue with Google" />

        {/* Already have account */}
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
