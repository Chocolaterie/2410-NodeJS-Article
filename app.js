// Importer le module express
const express = require('express');

// Instancier le serveur express
const app = express();

// Activer la permission d'envoyer des données dans le body des requêtes
// Débloque le payload
app.use(express.json());

// --------------------------------------------------------------
// DATA
// --------------------------------------------------------------
// Simulation de données en mémoire
let articles = [
    { id: 1, title: 'Premier article', content: 'Contenu du premier article', author: 'Isaac' },
    { id: 2, title: 'Deuxième article', content: 'Contenu du deuxième article', author: 'Sanchez' },
    { id: 3, title: 'Troisième article', content: 'Contenu du troisième article', author: 'Toto' }
];

// --------------------------------------------------------------
// ROUTES
// --------------------------------------------------------------

app.get('/articles', (request, response) => {
    // Un JSON ENTIER Dans un String : Pour l'avoir en JSON pure/objet il faut parse
    const articlesJSON = JSON.parse(`{ "pseudo" : "Isaac" }`);
    console.log(`articleJSON : ${articlesJSON}`);

    // Un OBJET JS : Pour l'avoir en JSON pure/objet il faut le stringify
    const articlesJSONString = JSON.stringify(articles);
    console.log(`articleJSONString : ${articlesJSONString}`);

    // A FAIRE: On envoie des objets JS (pas du json déjà transformé: ex JSON.stringify)
    return response.json(articles);
});

app.get('/article/:id', (request, response) => {
    // Récupérer le parametre nommé id dans l'url
    // PS: Ne pas oublier de le convertir en entier
    const id = parseInt(request.params.id);

    // A FAIRE : PREDICATE (en java on appel les stream)
    const article = articles.find(articleIteration => articleIteration.id == id);

    // CAS : Erreur on trouve pas d'article (si il est null)
    if (!article){
        return response.json({message: `Aucun article article trouvé avcec l'id : ${id}`});
    }
  
    return response.json(article);
});

app.post('/save-article', (request, response) => {
    // Récupérer l'article envoyé en JSON
    // Exemple : { id: 2, .....}
    const articleJSON = request.body;

    // Comment savoir si c'est un ajout ou un edition ?
    // Si on a un id dans l'article et que en plus l'article existe déjà dans le tableau 
    // ALORS EDITION
    // EN JS: Si ID existe dans le JSON
    if (articleJSON.id) {
        // Forcer l'id entier
        const id = parseInt(articleJSON.id)

        // Si article existe dans le tableau
        // Imaginons JSON = { id: 2, .....}, on va voir si le tableau a un article avec le même id
        const article = articles.find(articleIteration => articleIteration.id == id);
    
        // Si article trouvé avec le même id : MODIFICATION
        if (article){
            // Retrouver l'index tableau
            const articleIndexToEdit = articles.findIndex(articleIteration => articleIteration.id == id);
            
            // Remplacer un element du tableau grace à un index
            articles[articleIndexToEdit] = articleJSON;

            // Retrouver l'index du tableau liée à l'id
            return response.json({message: 'Article modifié avec succès'});
        }
    }

    // PAR DEFAUT => CREATION
    articles.push(articleJSON);
    return response.json({message: `Article ajouté avec succès`});
});

app.delete('/article/:id', (request, response) => {
    // Si pas d'id envoyé
    if (!request.params.id) {
        return response.json({message: `L'id est obligatoire`});
    }

    // Récupérer le parametre nommé id dans l'url
    const id = parseInt(request.params.id);

    // Pour supprimer on va supprimer grace à l'index
    // Donc trouver l'index avec un findIndex predicate id == id
    // Retrouver l'index tableau
    const articleIndexToDelete = articles.findIndex(articleIteration => articleIteration.id == id);

    // CAS: Article pas trouvé
    if (articleIndexToDelete == -1){
        return response.json({message: `Impossible de supprimer un article inexistant : ${id}`});
    }
    
    // Supprimer un element du tableau à partir Index, Nombre element à supprimer
    articles.splice(articleIndexToDelete, 1)

    return response.json({message: `Article supprimé avec succès : ${id}`});
});

// Lancer le serveur
app.listen(3000);
