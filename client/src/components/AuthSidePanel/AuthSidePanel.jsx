import { useEffect, useRef } from "react";
import styles from "./AuthSidePanel.module.css";

const testimonials = [
  {
    name: "Alice",
    role: "Volunteer",
    quote:
      "This app helped me connect with amazing people through food sharing!",
  },
  {
    name: "James",
    role: "Community Member",
    quote: "Reducing food waste has never been this easy.",
  },
  {
    name: "Sophia",
    role: "Donor",
    quote:
      "I love how simple it is to share extra meals with those who need them.",
  },
  {
    name: "Daniel",
    role: "Organizer",
    quote: "SnapDish brings people together for a great cause.",
  },
];

const AuthSidePanel = () => {
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current;
    // duplicate content for infinite scroll
    el.innerHTML += el.innerHTML;
  }, []);

  return (
    <div className={styles.panel}>
      <div className={styles.gradientBg} />
      <div className={styles.overlay} />

      <div className={`${styles.circle} ${styles.circlePrimary}`} />
      <div className={`${styles.circle} ${styles.circleSecondary}`} />
      <div className={`${styles.circle} ${styles.circleAccent}`} />

      {/* Logo */}
      <div className={styles.logoWrapper}>
        <div className={styles.logoBox}>
          <span className={styles.logoText}>S</span>
        </div>
        <span className={styles.logoTitle}>SnapDish</span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.intro}>
          <h3 className={styles.heading}>
            Share Food,
            <br />
            <span className={styles.highlight}>Share Hope</span>
          </h3>
          <p className={styles.description}>
            Join thousands of community members making a difference through food
            sharing. Together, we&apos;re reducing waste and helping those in
            need.
          </p>

          {/* Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>5,200+</div>
              <div className={styles.statLabel}>Meals Shared</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>480+</div>
              <div className={styles.statLabel}>Active Donors</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>120+</div>
              <div className={styles.statLabel}>Communities</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>300+</div>
              <div className={styles.statLabel}>Volunteers</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className={styles.testimonialsWrapper}>
          <div ref={listRef} className={styles.testimonialsList}>
            {testimonials.map((item) => (
              <div key={item.name} className={styles.testimonialCard}>
                <p className={styles.testimonialQuote}>
                  &quot;{item.quote}&quot;
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.avatar}>{item.name.charAt(0)}</div>
                  <div>
                    <p className={styles.authorName}>{item.name}</p>
                    <p className={styles.authorRole}>{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave SVG */}
      <div className={styles.wave}>
        <svg
          className={styles.waveSvg}
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
        >
          <path
            d="M0,10 Q25,0 50,10 T100,10 L100,20 L0,20 Z"
            fill="white"
            fillOpacity="0.1"
          />
        </svg>
      </div>
    </div>
  );
};

export default AuthSidePanel;
