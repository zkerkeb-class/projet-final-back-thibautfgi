const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

const app = express();
dotenv.config();

const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur le serveur Express minimaliste !',
        timestamp: new Date().toISOString(),
        endpoints: [
            'GET / - Cette page',
            'GET /api/health - Vérification de l\'état du serveur',
            'GET /api/hello/:name - Salutation personnalisée',
            'GET /api/wow/item?search=nom&orderby=id&page=1 - Recherche d\'items WoW'
        ]
    });
});

app.get('/api/wow/item/:id', async (req, res) => {
    try{

        const {id} = req.params;
        const url=`https://eu.api.blizzard.com/data/wow/item/${id}?namespace=static-classic-eu&locale=fr_FR`
        let response;
        try{
            response = await axios({
                method: 'get',
                url: url,
                headers: {
                    'Authorization': `Bearer ${process.env.API_KEY}`
                }
            })
        } catch (error) {
            console.error('Erreur lors de l\'appel à l\'API Blizzard:', error);
            res.status(500).json({
                error: 'Erreur lors de la récupération des données',
                message: error.message
            });
        }

        res.json(response.data)

    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Blizzard:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des données',
            message: error.message
        });
    }
})



app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get('/api/hello/:name', (req, res) => {
    const { name } = req.params;
    res.json({
        message: `Bonjour ${name} !`,
        timestamp: new Date().toISOString()
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        path: req.path,
        method: req.method
    });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Erreur interne du serveur',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur s\'est produite'
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur Express démarré sur http://localhost:${PORT}`);
    console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Démarré à: ${new Date().toLocaleString('fr-FR')}`);
});

module.exports = app;