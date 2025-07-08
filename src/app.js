const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const configuration = require("./config/configuration");
require("dotenv").config();
const mongoose = require("mongoose");

// Importation des routes
const authRoutes = require("./routes/authRoutes");
const wowRoutes = require("./routes/wowRoutes");

// Configuration de Passport
require("./config/passport");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});

// Middleware pour autoriser les requêtes cross-origin
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour les sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, sameSite: "lax" },
    })
);

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour enregistrer ou mettre à jour l'utilisateur après authentification
app.use((req, res, next) => {
    if (req.user && req.session.accessToken) {
        const { User } = require('./controllers/wowItemsController'); // Importation dynamique
        User.findOne({ id_user: req.user.id })
            .then(existingUser => {
                if (!existingUser) {
                    const newUser = new User({
                        id_user: req.user.id,
                        blizzardAccountName: req.user.battletag,
                        isAdmin: false, // Par défaut
                        isBan: false   // Par défaut
                    });
                    return newUser.save()
                        .then(savedUser => {
                            console.log(`User ${req.user.id} saved`);
                            // Mettre à jour req.user avec les données complètes
                            req.user = { ...req.user, isAdmin: savedUser.isAdmin, isBan: savedUser.isBan };
                        })
                        .catch(err => console.error("Error saving user:", err));
                } else {
                    // Mettre à jour req.user avec les données actuelles de la base
                    req.user = { ...req.user, isAdmin: existingUser.isAdmin, isBan: existingUser.isBan };
                }
            })
            .catch(err => console.error("Error checking user:", err))
            .finally(() => next());
    } else {
        next();
    }
});

// Utilisation des routes
app.use("/auth", authRoutes);
app.use("/api/wow", wowRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});