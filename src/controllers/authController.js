const passport = require("passport");

// Démarrer l'authentification
const startAuth = (req, res, next) => {
    const state = Math.random().toString(36).substring(2);
    req.session.state = state;
    passport.authenticate("bnet", { state })(req, res, next);
};

// Callback après authentification
const authCallback = [
    (req, res, next) => {
        if (req.query.state !== req.session.state) {
            return res.status(400).send("Invalid state parameter");
        }
        next();
    },
    passport.authenticate("bnet", { failureRedirect: "/" }),
    (req, res) => {
        req.session.accessToken = req.user.accessToken;
        res.redirect("http://localhost:5173");
    },
];

// Vérifier le statut
const checkStatus = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ message: "Connecté", user: req.user.battletag });
    } else {
        res.json({ message: "Non connecté" });
    }
};

// Déconnexion
const logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).send("Erreur lors de la déconnexion");
        req.session.destroy((err) => {
            if (err) console.error("Erreur lors de la destruction de la session:", err);
            res.send("Déconnecté avec succès");
        });
    });
};

module.exports = { startAuth, authCallback, checkStatus, logout };