const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.session.accessToken) {
        next();
    } else {
        res.status(401).json({ error: "Non authentifié" });
    }
};

const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.session.accessToken && req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ error: "Accès admin requis" });
    }
};

module.exports = { ensureAuthenticated, ensureAdmin };