require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

const config = {
    clientId: process.env.BNET_ID,
    clientSecret: process.env.BNET_SECRET,
    redirectUri: "http://localhost:3000/auth/bnet/callback",
    region: "eu",
    namespaces: ["profile-eu", "profile-classic-eu"],
    locale: "fr_FR",
    authUrl: "https://oauth.battle.net/authorize",
    tokenUrl: "https://oauth.battle.net/token",
    apiBaseUrl: "https://eu.api.blizzard.com",
    realmSlug: "shineshatter",
    characterName: "justachips".toLowerCase(),
    fallbackRealmSlug: "auberdine",
    fallbackCharacterName: "justachips".toLowerCase(),
};

let authorizationCode = null;
let expectedState = null;
let currentAccessToken = null;

const getAuthorizationUrl = () => {
    expectedState = Math.random().toString(36).substring(2);
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        scope: "wow.profile openid",
        state: expectedState,
    }).toString();

    return `${config.authUrl}?${params}`;
};

const getAccessToken = async (code, receivedState) => {
    if (receivedState !== expectedState) {
        throw new Error("State mismatch detected. Possible CSRF attack or invalid session.");
    }

    try {
        const tokenResponse = await axios.post(
            config.tokenUrl,
            new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: config.redirectUri,
            }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        console.log("Token Response:", tokenResponse.data);
        currentAccessToken = tokenResponse.data.access_token;
        return currentAccessToken;
    } catch (error) {
        console.error("Error getting access token:", {
            error: error.response?.data?.error,
            error_description: error.response?.data?.error_description,
            status: error.response?.status,
            message: error.message,
        });
        throw error;
    }
};

const getRealmIndex = async (accessToken, namespace) => {
    const url = `${config.apiBaseUrl}/data/wow/realm/index?namespace=${namespace}&locale=${config.locale}&region=${config.region}`;
    console.log(`Fetching realm index for ${namespace}:`, url);

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Battlenet-Namespace": namespace,
            },
        });
        console.log(`Realm Index (${namespace}):`, response.data.realms.map(r => ({ id: r.id, slug: r.slug })));
        return response.data.realms;
    } catch (error) {
        console.error(`Error fetching realm index for ${namespace}:`, {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        return [];
    }
};

const getAccountProfileSummary = async (accessToken) => {
    let accountData = null;

    for (const namespace of config.namespaces) {
        const url = `${config.apiBaseUrl}/profile/user/wow?namespace=${namespace}&locale=${config.locale}&region=${config.region}`;
        console.log(`Calling API for namespace ${namespace}:`, url);

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Battlenet-Namespace": namespace,
                },
            });
            console.log(`Account Profile Summary (${namespace}):`, response.data);
            accountData = response.data;
            break;
        } catch (error) {
            console.error(`Error for namespace ${namespace}:`, {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        }
    }

    return accountData;
};

const getCharacterProfileSummary = async (accessToken, namespace, realmSlug, characterName) => {
    const url = `${config.apiBaseUrl}/profile/wow/character/${realmSlug}/${characterName}?namespace=${namespace}&locale=${config.locale}&region=${config.region}`;
    console.log(`Calling Character API for namespace ${namespace}:`, url);

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Battlenet-Namespace": namespace,
            },
        });
        console.log(`Character Profile Summary (${namespace}):`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching character profile for namespace ${namespace}:`, {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        return null;
    }
};

const getProtectedCharacterProfile = async (accessToken, namespace, realmId, characterId) => {
    const url = `${config.apiBaseUrl}/profile/user/wow/protected-character/${realmId}-${characterId}?namespace=${namespace}&locale=${config.locale}&region=${config.region}`;
    console.log(`Calling Protected Character API for namespace ${namespace}:`, url);

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Battlenet-Namespace": namespace,
            },
        });
        console.log(`Protected Character Profile (${namespace}):`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching protected character profile for namespace ${namespace}:`, {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        return null;
    }
};

// 🔁 Route API pour accéder au profil de compte WoW
app.get("/api/wow/account-profile", async (req, res) => {
    if (!currentAccessToken) {
        return res.status(401).json({ error: "No access token. Please authenticate first." });
    }

    try {
        const profile = await getAccountProfileSummary(currentAccessToken);
        if (!profile) {
            return res.status(404).json({ error: "Account profile not found." });
        }
        res.json(profile);
    } catch (err) {
        console.error("Failed to get account profile:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 🔁 Callback d'authentification
app.get("/auth/bnet/callback", async (req, res) => {
    const { code, state } = req.query;
    console.log("Callback received - Code:", code, "State:", state);

    if (!code) {
        return res.status(400).send("No authorization code provided");
    }
    if (!state || state !== expectedState) {
        return res.status(400).send("Invalid state parameter");
    }

    try {
        await getAccessToken(code, state);

        // Automatically call the profile API
        const profile = await getAccountProfileSummary(currentAccessToken);
        if (!profile) {
            return res.status(404).send("Failed to fetch account profile.");
        }

        res.json(profile); // send the profile directly to the browser
    } catch (error) {
        console.error("Failed during callback process:", error.message);
        res.status(500).send("An error occurred while processing your request.");
    }
});


// 🔁 Lancer le serveur et afficher l'URL d'autorisation
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    const authUrl = getAuthorizationUrl();
    console.log("Please visit the following URL to authorize the application:");
    console.log(authUrl);
});
