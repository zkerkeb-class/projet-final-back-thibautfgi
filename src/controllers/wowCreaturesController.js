const axios = require("axios");
const configuration = require("../config/configuration");

const getCreatureFamiliesIndex = async (req, res) => {
    try {
        const url = `https://${configuration.region}.${configuration.baseUrl}/creature-family/index?namespace=${configuration.namespace}&locale=${configuration.locale}`;
        console.log("URL called:", url);
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Creature Families Index):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
};

const getCreatureFamily = async (req, res) => {
    try {
        const { creatureFamilyId } = req.params;
        const url = `https://${configuration.region}.${configuration.baseUrl}/creature-family/${creatureFamilyId}?namespace=${configuration.namespace}&locale=${configuration.locale}`;
        console.log("URL called:", url);
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Creature Family):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
};

const getCreatureTypesIndex = async (req, res) => {
    try {
        const url = `https://${configuration.region}.${configuration.baseUrl}/creature-type/index?namespace=${configuration.namespace}&locale=${configuration.locale}`;
        console.log("URL called:", url);
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Creature Types Index):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
};

const getCreatureType = async (req, res) => {
    try {
        const { creatureTypeId } = req.params;
        const url = `https://${configuration.region}.${configuration.baseUrl}/creature-type/${creatureTypeId}?namespace=${configuration.namespace}&locale=${configuration.locale}`;
        console.log("URL called:", url);
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Creature Type):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
};

const getCreatureById = async (req, res) => {
    try {
        const { creatureId } = req.params;
        const url = `https://${configuration.region}.${configuration.baseUrl}/creature/${creatureId}?namespace=${configuration.namespace}&locale=${configuration.locale}`;
        console.log("URL called:", url);
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Creature):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
};

const searchCreatures = async (req, res) => {
    try {
        const { name, orderby, _page } = req.query;
        let url = `https://${configuration.region}.${configuration.baseUrl}/search/creature?namespace=${configuration.namespace}&locale=${configuration.locale}`;
        if (name) {
            // Dynamically set the name parameter based on locale (e.g., name.en_US or name.fr_FR)
            const localeParts = configuration.locale.split('_');
            url += `&name.${localeParts[0].toLowerCase()}_${localeParts[1]}=${encodeURIComponent(name)}`;
        }
        if (orderby) url += `&orderby=${encodeURIComponent(orderby)}`;
        if (_page) url += `&_page=${encodeURIComponent(_page)}`;

        console.log("URL called:", url);
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Creature Search):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
};

const getCreatureDisplayMedia = async (req, res) => {
    try {
        const { creatureDisplayId } = req.params;
        const url = `https://${configuration.region}.${configuration.baseUrl}/media/creature-display/${creatureDisplayId}?namespace=${configuration.namespace}&locale=${configuration.locale}`;
        console.log("URL called:", url);
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Creature Display Media):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
};

const getCreatureFamilyMedia = async (req, res) => {
    try {
        const { creatureFamilyId } = req.params;
        const url = `https://${configuration.region}.${configuration.baseUrl}/media/creature-family/${creatureFamilyId}?namespace=${configuration.namespace}&locale=${configuration.locale}`;
        console.log("URL called:", url);
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Blizzard (Creature Family Media):", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des données",
            message: error.message,
        });
    }
};

module.exports = {
    getCreatureFamiliesIndex,
    getCreatureFamily,
    getCreatureTypesIndex,
    getCreatureType,
    getCreatureById,
    searchCreatures,
    getCreatureDisplayMedia,
    getCreatureFamilyMedia,
};