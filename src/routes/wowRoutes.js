const express = require("express");
const router = express.Router();
const wowItemsController = require("../controllers/wowItemsController");
const wowCreaturesController = require("../controllers/wowCreaturesController");

const { ensureAuthenticated } = require("../middlewares/authMiddleware");

// Routes API Blizzard
//
//
//
//
//  ITEMS
router.get("/item-class", ensureAuthenticated, wowItemsController.getItemClasses);
router.get("/item-class/:itemClassId", ensureAuthenticated, wowItemsController.getItemClassById);
router.get("/item-class/:itemClassId/item-subclass/:itemSubclassId", ensureAuthenticated, wowItemsController.getItemSubclass);
router.get("/item/:id", ensureAuthenticated, wowItemsController.getItemById);
router.get("/item-media/:id", ensureAuthenticated, wowItemsController.getItemMedia);
router.get("/search/item", ensureAuthenticated, wowItemsController.searchItems);
//
//
//
//
//  CREATURES
router.get('/creature-families-index', wowCreaturesController.getCreatureFamiliesIndex);
router.get('/creature-family/:creatureFamilyId', wowCreaturesController.getCreatureFamily);
router.get('/creature-types-index', wowCreaturesController.getCreatureTypesIndex);
router.get('/creature-type/:creatureTypeId', wowCreaturesController.getCreatureType);
router.get('/creature/:creatureId', wowCreaturesController.getCreatureById);
router.get('/search/creatures', wowCreaturesController.searchCreatures);
router.get('/creature-display-media/:creatureDisplayId', wowCreaturesController.getCreatureDisplayMedia);
router.get('/creature-family-media/:creatureFamilyId', wowCreaturesController.getCreatureFamilyMedia);

module.exports = router;