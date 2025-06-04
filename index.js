const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Ajout du package CORS
const app = express();

const config = {
    region: 'eu',
    namespace: 'static-classic-eu',
    locale: 'fr_FR'
};

require('dotenv').config();

// Middleware pour autoriser les requêtes cross-origin
app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Route 1 : Item Classes Index
app.get('/api/wow/item-class', async (req, res) => {
    try {
        const url = `https://${config.region}.api.blizzard.com/data/wow/item-class/index?namespace=${config.namespace}&locale=${config.locale}`;
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Blizzard (Item Classes Index):', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des données',
            message: error.message
        });
    }
});

// Route 2 : Item Class by ID
app.get('/api/wow/item-class/:itemClassId', async (req, res) => {
    try {
        const { itemClassId } = req.params;
        const url = `https://${config.region}.api.blizzard.com/data/wow/item-class/${itemClassId}?namespace=${config.namespace}&locale=${config.locale}`;
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Blizzard (Item Class):', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des données',
            message: error.message
        });
    }
});

// Route 3 : Item Subclass by ID
app.get('/api/wow/item-class/:itemClassId/item-subclass/:itemSubclassId', async (req, res) => {
    try {
        const { itemClassId, itemSubclassId } = req.params;
        const url = `https://${config.region}.api.blizzard.com/data/wow/item-class/${itemClassId}/item-subclass/${itemSubclassId}?namespace=${config.namespace}&locale=${config.locale}`;
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Blizzard (Item Subclass):', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des données',
            message: error.message
        });
    }
});

// Route 4 : Item by ID
app.get('/api/wow/item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const url = `https://${config.region}.api.blizzard.com/data/wow/item/${id}?namespace=${config.namespace}&locale=${config.locale}`;
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Blizzard (Item):', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des données',
            message: error.message
        });
    }
});

// Route 5 : Item Media by ID
app.get('/api/wow/item-media/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const url = `https://${config.region}.api.blizzard.com/data/wow/media/item/${id}?namespace=${config.namespace}&locale=${config.locale}`;
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Blizzard (Item Media):', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des données',
            message: error.message
        });
    }
});

// Route 6 : Item Search
app.get('/api/wow/search/item', async (req, res) => {
    try {
        // Récupérer les paramètres de requête (query params)
        const { name, orderby, _page } = req.query;

        // Construire l'URL avec les paramètres
        let url = `https://${config.region}.api.blizzard.com/data/wow/search/item?namespace=${config.namespace}&locale=${config.locale}`;
        if (name) url += `&name.fr_FR=${encodeURIComponent(name)}`; // Recherche par nom
        if (orderby) url += `&orderby=${encodeURIComponent(orderby)}`; // Tri
        if (_page) url += `&_page=${encodeURIComponent(_page)}`; // Pagination

        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Blizzard (Item Search):', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des données',
            message: error.message
        });
    }
});

// Démarrer le serveur (exemple de port)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});