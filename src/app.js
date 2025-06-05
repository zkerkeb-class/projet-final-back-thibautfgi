const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();

// Importation des routes
const authRoutes = require("./routes/authRoutes");
const wowRoutes = require("./routes/wowRoutes");

// Configuration de Passport
require("./config/passport");

const app = express();

// Middleware pour autoriser les requêtes cross-origin
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour les sessions
app.use(
    session({
        secret: "votre_secret_session",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, sameSite: "lax" },
    })
);

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Utilisation des routes
app.use("/auth", authRoutes);
app.use("/api/wow", wowRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});