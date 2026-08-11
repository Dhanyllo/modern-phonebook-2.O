import { useState, useEffect } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import OtpInput from "../../components/OtpInput/OtpInput";
import styles from "./OtpForm.module.css";
import { useDarkMode } from "../../hooks/useDarkmode";
import { redirect } from "react-router-dom";
import { verifyOtp } from "../../api/verifyOtp";
import { resendOtp } from "../../api/resendOtp";

export const action = async ({ request }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const otpSessionToken = sessionStorage.getItem("otpSessionToken");
  const formData = await request.formData();
  const otp = formData.get("otp");
  console.log(otp);

  if (!otpSessionToken) {
    return {
      error: "Your verification session has expired. Please register again.",
    };
  }

  if (!otp || otp.length !== 6) {
    return {
      error: "Please enter a valid 6-digit OTP.",
    };
  }

  const payload = {
    otp,
    otpSessionToken,
  };

  try {
    await verifyOtp(apiUrl, payload);

    sessionStorage.removeItem("otpSessionToken");

    return redirect("/", { replace: true });
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

const RESEND_DELAY = 60;

const OtpForm = () => {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isPending = navigation.state === "submitting";
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
    try {
      console.log("working");
      await resendOtp();
      setTimeLeft(RESEND_DELAY);
    } catch (error) {
      console.log("not working");
      console.error(error.message);
    }
  };

  return (
    <div data-darkmode={darkMode} className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Verify OTP</h2>
        <p className={styles.subtitle}>
          Enter the 6-digit code we sent to your email
        </p>

        {actionData?.error && (
          <div className={styles.errorMessage}>{actionData.error}</div>
        )}

        <Form method="post" id="otp-form" className={styles.form}>
          <input type="hidden" name="otp" value={otpValue} />

          <OtpInput length={6} onChange={handleOtpChange} />

          <button
            type="submit"
            className={styles.verifyButton}
            disabled={isPending || otpValue.length !== 6}
          >
            {isPending ? "Verifying..." : "Verify"}
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
