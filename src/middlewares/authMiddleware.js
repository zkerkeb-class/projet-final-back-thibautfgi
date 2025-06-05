const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.session.accessToken) {
        next();
    } else {
        res.status(401).json({ error: "Non authentifié" });
    }
};

module.exports = { ensureAuthenticated };