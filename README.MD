## Armory Adventure - Backend

Bienvenue sur la partie BACK de Armory Adventure, crée par Thibaut Figueira dans l'univers de World of Warcraft.

github: https://github.com/thibautfgi

Pour lancer le projet :

```bash
nodemon srv/app.js 
```

#### Informations

###### Nom Prénom:

- Figueira Thibaut

###### Liste des fonctionnalités:

*Frontend : *

- avoir un routeur (react-router-dom)
- avoir un système d'authentification (+ Route protégés)
- utiliser CSS Classique (BOOTSTRAP, TAILWIND ET TOUTES AUTRES LIBRAIRIE SONT INTERDITES)
- être codé proprement (avoir une structure propre de code et bien découper ses composants)
- avoir les normes récentes de code (ES6+)
- avoir un système de retour utilisateur, notifier les succes/erreurs, faire un affichage en cas de non reponse de l’api, faire un loader durant les call API etc.
- utilisez context (avoir un systeme de state global)
- utilisez des hook perso
- un système de thème global (pas de couleurs qui se baladent dans le style)

*Backend : *

- Avoir une ou des route CRUD
- Utilisez la structure de code vu en cours (Controllers, Model, Middleware)
- Avoir un systeme d’authentification (JWT)
- Avoir des routes protégés (JWT,  faire un Middleware)
- Avoir une base de donnée mongoDB (utilisez mongoose pour interagir avec)
- Avoir des verifications ( champs obligatoire, le champs doit etre en string, ou number, etc)
- Renvoyez les codes status adéquat (200, 401, 403 etc.)

###### Liste des bonus:

- Belle organisation des fichiers de code
- utilisation d'une api complexe (ex: API de wow)
- limitation des calls API
- more