import { useRef, useState } from "react";
import styles from "./OtpInput.module.css";

const OtpInput = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    onChange(newOtp.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length !== length) return;

    const newOtp = pasted.split("").slice(0, length);
    setOtp(newOtp);

    newOtp.forEach((digit, i) => {
      inputsRef.current[i].value = digit;
    });

    inputsRef.current[length - 1].focus();
    onChange(newOtp.join(""));
  };

  return (
    <div onPaste={handlePaste} className={styles.container}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength="1"
          ref={(el) => (inputsRef.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={styles.input}
        />
      ))}
    </div>
  );
};

export default OtpInput;
