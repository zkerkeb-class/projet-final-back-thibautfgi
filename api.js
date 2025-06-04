const express = require("express");
const passport = require("passport");
const session = require("express-session");
const BnetStrategy = require("passport-bnet").Strategy;
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

const config = {
    region: "eu",
    namespace: "static-classic-eu",
    locale: "fr_FR",
};

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

// Route pour démarrer l'authentification
app.get("/auth/bnet", (req, res, next) => {
    const state = Math.random().toString(36).substring(2);
    req.session.state = state;
    passport.authenticate("bnet", { state })(req, res, next);
});

// Route de callback après authentification
app.get(
    "/auth/bnet/callback",
    (req, res, next) => {
        if (req.query.state !== req.session.state) {
            return res.status(400).send("Invalid state parameter");
        }
        next();
    },
    passport.authenticate("bnet", { failureRedirect: "/" }),
    (req, res) => {
        // Stocker le token dans la session
        req.session.accessToken = req.user.accessToken;
        res.redirect("http://localhost:5173");
    }
);

// Vérifier le statut d'authentification (sans renvoyer le token)
app.get("/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ message: "Connecté", user: req.user.battletag });
    } else {
        res.json({ message: "Non connecté" });
    }
});

// Route de déconnexion
app.get("/auth/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).send("Erreur lors de la déconnexion");
        req.session.destroy((err) => {
            if (err) console.error("Erreur lors de la destruction de la session:", err);
            res.send("Déconnecté avec succès");
        });
    });
});

// Middleware pour vérifier l'authentification avant les routes API
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.session.accessToken) {
        next();
    } else {
        res.status(401).json({ error: "Non authentifié" });
    }
};

// Routes API utilisant le token de la session
app.get("/api/wow/item-class", ensureAuthenticated, async (req, res) => {
    try {
        const url = `https://${config.region}.api.blizzard.com/data/wow/item-class/index?namespace=${config.namespace}&locale=${config.locale}`;
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Item Classes Index):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
});

app.get("/api/wow/item-class/:itemClassId", ensureAuthenticated, async (req, res) => {
    try {
        const { itemClassId } = req.params;
        const url = `https://${config.region}.api.blizzard.com/data/wow/item-class/${itemClassId}?namespace=${config.namespace}&locale=${config.locale}`;
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Item Class):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
});

app.get("/api/wow/item-class/:itemClassId/item-subclass/:itemSubclassId", ensureAuthenticated, async (req, res) => {
    try {
        const { itemClassId, itemSubclassId } = req.params;
        const url = `https://${config.region}.api.blizzard.com/data/wow/item-class/${itemClassId}/item-subclass/${itemSubclassId}?namespace=${config.namespace}&locale=${config.locale}`;
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Item Subclass):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
});

app.get("/api/wow/item/:id", ensureAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const url = `https://${config.region}.api.blizzard.com/data/wow/item/${id}?namespace=${config.namespace}&locale=${config.locale}`;
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Item):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
});

app.get("/api/wow/item-media/:id", ensureAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const url = `https://${config.region}.api.blizzard.com/data/wow/media/item/${id}?namespace=${config.namespace}&locale=${config.locale}`;
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Item Media):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
});

app.get("/api/wow/search/item", ensureAuthenticated, async (req, res) => {
    try {
        const { name, orderby, _page } = req.query;
        let url = `https://${config.region}.api.blizzard.com/data/wow/search/item?namespace=${config.namespace}&locale=${config.locale}`;
        if (name) url += `&name.fr_FR=${encodeURIComponent(name)}`;
        if (orderby) url += `&orderby=${encodeURIComponent(orderby)}`;
        if (_page) url += `&_page=${encodeURIComponent(_page)}`;

        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Item Search):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});