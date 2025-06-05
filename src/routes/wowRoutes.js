const express = require("express");
const router = express.Router();
const wowController = require("../controllers/wowItemController");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

// Routes API Blizzard
//
//
//
//
//  ITEMS
router.get("/item-class", ensureAuthenticated, wowController.getItemClasses);
router.get("/item-class/:itemClassId", ensureAuthenticated, wowController.getItemClassById);
router.get("/item-class/:itemClassId/item-subclass/:itemSubclassId", ensureAuthenticated, wowController.getItemSubclass);
router.get("/item/:id", ensureAuthenticated, wowController.getItemById);
router.get("/item-media/:id", ensureAuthenticated, wowController.getItemMedia);
router.get("/search/item", ensureAuthenticated, wowController.searchItems);
//

module.exports = router;