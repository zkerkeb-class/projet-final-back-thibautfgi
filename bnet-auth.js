const express = require("express");
const passport = require("passport");
const session = require("express-session");
const BnetStrategy = require("passport-bnet").Strategy;
require("dotenv").config();



const app = express();

const BNET_ID = process.env.BNET_ID;
const BNET_SECRET = process.env.BNET_SECRET;

console.log("BNET_ID:", BNET_ID); // Log pour vérifier les identifiants
console.log("BNET_SECRET:", BNET_SECRET); // Log pour vérifier les identifiants


const cors = require("cors");
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true, // Autoriser les cookies
    })
);


// Middleware pour les sessions
app.use(
    session({
        secret: "votre_secret_session",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, sameSite: "lax" }, // Ajout de sameSite pour mieux gérer les cookies
    })
);

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Sérialisation et désérialisation de l'utilisateur
passport.serializeUser((user, done) => {
    console.log("Serializing user:", user); // Log pour débogage
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    console.log("Deserializing user:", obj); // Log pour débogage
    done(null, obj);
});

// Utilisation de la stratégie Bnet
passport.use(
    new BnetStrategy(
        {
            clientID: BNET_ID,
            clientSecret: BNET_SECRET,
            callbackURL: "http://localhost:3000/auth/bnet/callback",
            region: "eu",
        },
        function (accessToken, refreshToken, profile, done) {
            console.log("Profile reçu:", profile); // Log pour débogage
            profile.accessToken = accessToken;
            return done(null, profile);
        }
    )
);

// Route pour démarrer l'authentification
app.get("/auth/bnet", (req, res, next) => {
    const state = Math.random().toString(36).substring(2);
    req.session.state = state;
    console.log("Génération state:", state); // Log pour débogage
    passport.authenticate("bnet", { state })(req, res, next);
});

// Route de callback après authentification
app.get(
    "/auth/bnet/callback",
    (req, res, next) => {
        console.log("Callback reçue, state session:", req.session.state); // Log pour débogage
        console.log("Callback reçue, state query:", req.query.state); // Log pour débogage
        if (req.query.state !== req.session.state) {
            console.error("Invalid state parameter detected"); // Log d'erreur
            return res.status(400).send("Invalid state parameter");
        }
        next();
    },
    passport.authenticate("bnet", { failureRedirect: "/" }),
    (req, res) => {
        console.log("Authentification réussie, utilisateur:", req.user.displayName); // Log pour débogage
        res.redirect("http://localhost:5173");
    }
);

app.get("/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ message: "Connecté", user: req.user.battletag});
    } else {
        res.json({ message: "Non connecté" });
    }
});

// Route de déconnexion
app.get("/auth/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Erreur lors de la déconnexion:", err);
            return res.status(500).send("Erreur lors de la déconnexion");
        }
        res.send("Déconnecté avec succès");
    });
});

// Démarrage du serveur
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});