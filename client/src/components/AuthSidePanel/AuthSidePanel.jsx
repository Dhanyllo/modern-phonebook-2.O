import styles from "./AuthSidePanel.module.css";

const AuthSidePanel = () => {
  const testimonials = [
    {
      text: "This app completely transformed how I manage my contacts. Everything’s organized and accessible in seconds.",
      author: "— Alex Johnson, Sales Lead",
    },
    {
      text: "Clean, simple, and efficient. I’ve cut my client follow-up time in half.",
      author: "— Priya Desai, Consultant",
    },
    {
      text: "Exactly what I needed to keep personal and business contacts in one place. Highly recommend!",
      author: "— Michael Osei, Entrepreneur",
    },
    {
      text: "The smart tagging and search features make it effortless to find anyone I need instantly.",
      author: "— Sarah Mensah, Project Manager",
    },
    {
      text: "Syncs beautifully across all my devices. I never lose track of important client details anymore.",
      author: "— Daniel Kim, Marketing Specialist",
    },
    {
      text: "I used to juggle multiple spreadsheets. Now everything’s streamlined and visually clean.",
      author: "— Lucy Zhang, Operations Coordinator",
    },
    {
      text: "Love how intuitive it feels. The interface makes managing hundreds of contacts surprisingly fun.",
      author: "— Fatima Bello, Product Designer",
    },
    {
      text: "Security and privacy were my top concerns. This platform delivers both with confidence.",
      author: "— Anita Boateng, HR Consultant",
    },
    {
      text: "It’s simple enough for daily use but powerful enough to handle large professional networks.",
      author: "— Julia Carter, Business Analyst",
    },
    {
      text: "Sharing contacts securely between team members has made collaboration seamless.",
      author: "— Rebecca Yeboah, Team Lead",
    },
    {
      text: "From onboarding to everyday use, everything about this app feels thoughtfully designed.",
      author: "— Henry Park, Startup Founder",
    },
  ];

  return (
    <div className={styles.panel}>
      {/* Logo */}
      <div className={styles.logoWrapper}>
        <div className={styles.logoBox}>
          <span className={styles.logoText}>M</span>
        </div>
        <span className={styles.logoTitle}>Modern Phonebook</span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.intro}>
          <h3 className={styles.heading}>
            Store Contact ,
            <br />
            <span className={styles.highlight}>Access Globally🌍</span>
          </h3>
          <p className={styles.description}>
            Join others simplifying the way they connect and communicate. Keep
            your contacts organized, updated, and always accessible.
          </p>

          {/* Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>10k+</div>
              <div className={styles.statLabel}>Contacts Managed</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>1,200+</div>
              <div className={styles.statLabel}>Active Users</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>98%</div>
              <div className={styles.statLabel}>User Satisfaction</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>35+</div>
              <div className={styles.statLabel}>Countries Connected</div>
            </div>
          </div>

          <div className={styles.testimonialsSection}>
            <div className={styles.testimonialsGrid}>
              {testimonials.map((t, index) => (
                <div key={index} className={styles.testimonialCard}>
                  <p className={styles.testimonialText}>“{t.text}”</p>
                  <span className={styles.testimonialAuthor}>{t.author}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSidePanel;
