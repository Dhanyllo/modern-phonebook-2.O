// import { Link } from "react-router-dom";
// import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
// import styles from "./SuccessMessage.module.css";

// const SuccessMessage = ({ title, description, buttonText, buttonLink }) => {
//   return (
//     <div className={styles.page}>
//       {/* Background circles */}
//       <div className={styles.background}>
//         <div className={`${styles.circle} ${styles.circle1}`} />
//         <div className={`${styles.circle} ${styles.circle2}`} />
//         <div className={`${styles.circle} ${styles.circle3}`} />
//         <div className={`${styles.circle} ${styles.circle4}`} />
//       </div>

//       <div className={styles.wrapper}>
//         <div className={styles.card}>
//           <div className={styles.cardOverlay} />

//           <div className={styles.cardContent}>
//             {/* Icon */}
//             <div className={styles.iconWrapper}>
//               <div className={styles.iconCircle}>
//                 <CheckCircle className={styles.icon} />
//               </div>
//               <Sparkles className={`${styles.sparkle} ${styles.sparkleTop}`} />
//               <Sparkles
//                 className={`${styles.sparkle} ${styles.sparkleBottom}`}
//               />
//             </div>

//             {/* Badge */}
//             <div className={styles.badge}>✨ Success!</div>

//             {/* Title */}
//             <h1 className={styles.title}>
//               <span className={styles.gradientText}>{title}</span>
//             </h1>

//             {/* Description */}
//             <p className={styles.description}>{description}</p>

//             {/* Button */}
//             <Link to={buttonLink} className={styles.button}>
//               <span>{buttonText}</span>
//               <ArrowRight className={styles.buttonIcon} />
//             </Link>

//             {/* Animated dots */}
//             <div className={styles.dots}>
//               <div className={styles.dot} />
//               <div className={`${styles.dot} ${styles.dotDelay1}`} />
//               <div className={`${styles.dot} ${styles.dotDelay2}`} />
//             </div>
//           </div>
//         </div>

//         <p className={styles.footer}>
//           You&apos;ll be redirected automatically, or click the button above to
//           continue.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SuccessMessage;

import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import styles from "./SuccessMessage.module.css";

const SuccessMessage = ({ title, description, buttonText, buttonLink }) => {
  // Hardcoded values (ignore props for now)
  title = "Account Created Successfully";
  description =
    "Your account has been created and you can now log in to access all features.";
  buttonText = "Go to Login";
  buttonLink = "/login";

  return (
    <div className={styles.page}>
      {/* Background circles */}
      <div className={styles.background}>
        <div className={`${styles.circle} ${styles.circle1}`} />
        <div className={`${styles.circle} ${styles.circle2}`} />
        <div className={`${styles.circle} ${styles.circle3}`} />
        <div className={`${styles.circle} ${styles.circle4}`} />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.cardOverlay} />

          <div className={styles.cardContent}>
            {/* Icon */}
            <div className={styles.iconWrapper}>
              <div className={styles.iconCircle}>
                <CheckCircle className={styles.icon} />
              </div>
              <Sparkles className={`${styles.sparkle} ${styles.sparkleTop}`} />
              <Sparkles
                className={`${styles.sparkle} ${styles.sparkleBottom}`}
              />
            </div>

            {/* Badge */}
            <div className={styles.badge}>✨ Success!</div>

            {/* Title */}
            <h1 className={styles.title}>
              <span className={styles.gradientText}>{title}</span>
            </h1>

            {/* Description */}
            <p className={styles.description}>{description}</p>

            {/* Button */}
            <Link to={buttonLink} className={styles.button}>
              <span>{buttonText}</span>
              <ArrowRight className={styles.buttonIcon} />
            </Link>

            {/* Animated dots */}
            <div className={styles.dots}>
              <div className={styles.dot} />
              <div className={`${styles.dot} ${styles.dotDelay1}`} />
              <div className={`${styles.dot} ${styles.dotDelay2}`} />
            </div>
          </div>
        </div>

        <p className={styles.footer}>
          You&apos;ll be redirected automatically, or click the button above to
          continue.
        </p>
      </div>
    </div>
  );
};

export default SuccessMessage;
