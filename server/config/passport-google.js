const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase() || null;
        const googleId = profile.id;
        const firstName = profile.name?.givenName || null;
        const otherNames = profile.name?.familyName || null;

        if (!email) {
          return done(new Error("Google account has no email"), null);
        }

        // 1. Look up user by provider_id or email
        const [rows] = await db.query(
          "SELECT * FROM users WHERE provider_id = ? AND provider = 'google' OR email = ?",
          [googleId, email]
        );

        let user;
        if (rows.length > 0) {
          // Found existing user
          user = rows[0];
        } else {
          // 2. Insert new user
          const [result] = await db.query(
            `INSERT INTO users (email, first_name, other_names, provider, provider_id, is_verified) 
             VALUES (?, ?, ?, 'google', ?, true)`,
            [email, firstName, otherNames, googleId]
          );

          user = {
            id: result.insertId,
            email,
            first_name: firstName,
            other_names: otherNames,
            provider: "google",
            is_verified: true,
          };
        }

        // 3. Return user
        return done(null, user);
      } catch (err) {
        console.error("GoogleStrategy error:", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
