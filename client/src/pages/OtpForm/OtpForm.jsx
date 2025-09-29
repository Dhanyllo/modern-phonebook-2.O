import { useState } from "react";
import { Form } from "react-router-dom";
import OtpInput from "../../components/OtpInput/OtpInput";
import styles from "./OtpForm.module.css";

export const otpAction = async ({ request }) => {
  const formData = await request.formData();
  const otp = formData.get("otp");
  console.log("Submit OTP:", otp);

  // Example: send to backend
  // await fetch('/api/verify-otp', { method: 'POST', body: JSON.stringify({ otp }) });

  return null; // could also return redirect("/success")
};

const OtpForm = () => {
  const [otpValue, setOtpValue] = useState("");

  const handleOtpChange = (value) => {
    setOtpValue(value);
  };

  return (
    <div className={styles.page}>
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
      </div>
    </div>
  );
};

export default OtpForm;
