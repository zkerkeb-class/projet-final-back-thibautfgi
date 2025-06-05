const axios = require("axios");

const config = {
    region: "eu",
    namespace: "static-classic-eu",
    locale: "fr_FR",
};

const getItemClasses = async (req, res) => {
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
};

const getItemClassById = async (req, res) => {
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
};

const getItemSubclass = async (req, res) => {
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
};

const getItemById = async (req, res) => {
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
};

const getItemMedia = async (req, res) => {
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
};

const searchItems = async (req, res) => {
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
};

module.exports = {
    getItemClasses,
    getItemClassById,
    getItemSubclass,
    getItemById,
    getItemMedia,
    searchItems,
};