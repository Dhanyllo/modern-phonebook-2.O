import { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import OtpInput from "../../components/OtpInput/OtpInput";
import styles from "./OtpForm.module.css";
import { useDarkMode } from "../../context/DarkModeContext";

export const otpAction = async ({ request }) => {
  const formData = await request.formData();
  const otp = formData.get("otp");
  console.log("Submit OTP:", otp);

  // Example: send to backend
  // await fetch('/api/verify-otp', { method: 'POST', body: JSON.stringify({ otp }) });

  return null; // could also return redirect("/success")
};

const RESEND_DELAY = 60;

const OtpForm = () => {
  const [otpValue, setOtpValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const { darkMode } = useDarkMode();

  const handleOtpChange = (value) => {
    setOtpValue(value);
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleResend = async () => {
    // await fetch('/api/resend-otp', { method: 'POST' });

    console.log("OTP resent!");
    setTimeLeft(RESEND_DELAY);
  };

  console.log(darkMode);

  return (
    <div data-darkmode={darkMode} className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Verify OTP</h2>
        <p className={styles.subtitle}>
          Enter the 6-digit code we sent to your email
        </p>

        <Form method="post" id="otp-form" className={styles.form}>
          <input type="hidden" name="otp" value={otpValue} />

          <OtpInput length={6} onChange={handleOtpChange} />

          <button type="submit" className={styles.button}>
            Verify
          </button>
        </Form>

        <p className={styles.resendText}>
          Didn’t receive the code?{" "}
          {timeLeft > 0 ? (
            <span className={styles.timer}>Resend in {timeLeft}s</span>
          ) : (
            <button
              type="button"
              className={styles.resendBtn}
              onClick={handleResend}
            >
              Resend OTP
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default OtpForm;
