const passport = require("passport");
const { User } = require("../controllers/wowItemsController"); // Importation du modèle User

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
    (req, res, next) => {
        // Vérifier si l'utilisateur est banni
        User.findOne({ id_user: req.user.id })
            .then((user) => {
                if (user && user.isBan) {
                    req.logout((err) => {
                        if (err) console.error("Erreur lors de la déconnexion:", err);
                        return res.status(403).json({ error: "Compte banni" });
                    });
                } else {
                    req.session.accessToken = req.user.accessToken;
                    res.redirect("http://localhost:5173");
                }
            })
            .catch((err) => {
                console.error("Erreur lors de la vérification du ban:", err);
                res.status(500).json({ error: "Erreur serveur", message: err.message });
            });
    },
];

// Vérifier le statut
const checkStatus = (req, res) => {
    if (req.isAuthenticated()) {
        User.findOne({ id_user: req.user.id })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: "Utilisateur non trouvé" });
                }
                res.json({
                    message: "Connecté",
                    user: req.user.battletag,
                    accessToken: req.session.accessToken,
                    isAdmin: user.isAdmin || false,
                    isBan: user.isBan || false, // Ajout de isBan
                });
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération de l'utilisateur:", err);
                res.status(500).json({ message: "Erreur serveur", error: err.message });
            });
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