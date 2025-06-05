const passport = require("passport");
const BnetStrategy = require("passport-bnet").Strategy;
require("dotenv").config();

// Sérialisation et désérialisation de l'utilisateur
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Utilisation de la stratégie Bnet
passport.use(
    new BnetStrategy(
        {
            clientID: process.env.BNET_ID,
            clientSecret: process.env.BNET_SECRET,
            callbackURL: "http://localhost:3000/auth/bnet/callback",
            region: "eu",
        },
        function (accessToken, refreshToken, profile, done) {
            // Stocker le token d'accès dans la session
            profile.accessToken = accessToken;
            return done(null, profile);
        }
    )
);

module.exports = passport;