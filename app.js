// Importer le module express
const express = require('express');

// Instancier le serveur express
const app = express();

// Activer la permission d'envoyer des données dans le body des requêtes
// Débloque le payload
app.use(express.json());

app.get('/articles', (request, response) => {
    return response.json({message: 'Retournera la liste des articles'});
});

app.get('/article/:id', (request, response) => {
    // Récupérer le parametre nommé id dans l'url
    const id = request.params.id;

    return response.json({message: `Retournera l'article ayant l'id ${id}`});
});

app.post('/save-article', (request, response) => {
    return response.json({message: 'Va ajouter/modifier un article'});
});

app.delete('/article/:id', (request, response) => {
    // Récupérer le parametre nommé id dans l'url
    const id = request.params.id;

    return response.json({message: `Va supprimer l'article ayant l'id ${id}`});
});

// Lancer le serveur
app.listen(3000);
