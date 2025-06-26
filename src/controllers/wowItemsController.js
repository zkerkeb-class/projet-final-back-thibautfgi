const axios = require("axios");
const configuration = require("../config/configuration");
const mongoose = require("mongoose"); // Add Mongoose

// Define the Item schema
const itemSchema = new mongoose.Schema({
    itemId: { type: Number, required: true, unique: true }, // Store the item ID
    createdAt: { type: Date, default: Date.now }, // Optional: Track when saved
});

const Item = mongoose.model("Item", itemSchema); // Create the model

const getItemClasses = async (req, res) => {
    try {
        const url = `https://${configuration.region}.${configuration.baseUrl}/item-class/index?namespace=${configuration.namespace}&locale=${configuration.locale}`;
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
};

const getItemClassById = async (req, res) => {
    try {
        const { itemClassId } = req.params;
        const url = `https://${configuration.region}.${configuration.baseUrl}/item-class/${itemClassId}?namespace=${configuration.namespace}&locale=${configuration.locale}`;
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
};

const getItemSubclassById = async (req, res) => {
    try {
        const { itemClassId, itemSubclassId } = req.params;
        const url = `https://${configuration.region}.${configuration.baseUrl}/item-class/${itemClassId}/item-subclass/${itemSubclassId}?namespace=${configuration.namespace}&locale=${configuration.locale}`;
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
};

const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const url = `https://${configuration.region}.${configuration.baseUrl}/item/${id}?namespace=${configuration.namespace}&locale=${configuration.locale}`;
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
};

const getItemMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const url = `https://${configuration.region}.${configuration.baseUrl}/media/item/${id}?namespace=${configuration.namespace}&locale=${configuration.locale}`;
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
};

const searchItems = async (req, res) => {
    try {
        const { name, orderby, _page, _pageSize, itemClass } = req.query;

        console.log('Paramètres reçus:', { name, orderby, _page, _pageSize, itemClass });

        let url = `https://${configuration.region}.${configuration.baseUrl}/search/item?namespace=${configuration.namespace}&locale=${configuration.locale}`;

        if (name) {
            const rawName = name.includes(' ') ? `"${name}"` : name;
            url += `&name.fr_FR=${encodeURIComponent(rawName)}`;
            console.log('Nom encodé pour l\'API:', encodeURIComponent(rawName));
        }
        if (orderby) url += `&orderby=${encodeURIComponent(orderby)}`;
        if (_page) url += `&_page=${encodeURIComponent(_page)}`;
        if (_pageSize) url += `&_pageSize=${encodeURIComponent(_pageSize)}`;

        if (itemClass) {
            url += `&filters=item_class.id:${encodeURIComponent(itemClass)}`;
        }

        console.log('URL de recherche construite:', url);

        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });

        console.log('Réponse de l\'API Blizzard:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Item Search):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
};

// New endpoint to save item ID to MongoDB
const postItem = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }

        const existingItem = await Item.findOne({ itemId: id });
        if (existingItem) {
            return res.status(409).json({ error: "Item already exists" });
        }

        const newItem = new Item({ itemId: id });
        await newItem.save();
        res.status(201).json({ message: "Item saved successfully", id });
    } catch (error) {
        console.error("Error saving item to MongoDB:", error);
        res.status(500).json({
            error: "Error saving item",
            message: error.message,
        });
    }
};

const getInventory = async (req, res) => {
    try {
        const items = await Item.find({}, 'itemId'); // Fetch only itemId field
        res.json(items.map(item => item.itemId));
    } catch (error) {
        console.error("Error fetching inventory from MongoDB:", error);
        res.status(500).json({ error: "Error fetching inventory", message: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Item.deleteOne({ itemId: parseInt(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json({ message: "Item deleted successfully", id });
    } catch (error) {
        console.error("Error deleting item from MongoDB:", error);
        res.status(500).json({ error: "Error deleting item", message: error.message });
    }
};

module.exports = {
    getItemClasses,
    getItemClassById,
    getItemSubclassById,
    getItemById,
    getItemMedia,
    searchItems,
    postItem,
    getInventory,
    deleteItem
};