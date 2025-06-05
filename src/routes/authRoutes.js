const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Routes d'authentification
router.get("/bnet", authController.startAuth);
router.get("/bnet/callback", authController.authCallback);
router.get("/status", authController.checkStatus);
router.get("/logout", authController.logout);

module.exports = router;