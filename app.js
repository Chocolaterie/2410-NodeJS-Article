// Importer le module express
const express = require('express');

// Instancier le serveur express
const app = express();

// Activer la permission d'envoyer des données dans le body des requêtes
// Débloque le payload
app.use(express.json());

//---------------------------------------------------------------------------
// * JWT CONFIG
//---------------------------------------------------------------------------
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = "Chocolatine";

// ----------------------------------------------------------
// * MongoDB
// ----------------------------------------------------------
const mongoose = require('mongoose');

// Si connexion reussie
mongoose.connection.once('open', () => {
    console.log(`Connecté(e) à la base de données`);
});

// Si erreur bdd
mongoose.connection.on('error', (err) => {
    console.log(`Erreur de la base données`);
});

// Enclencher à la connexion
mongoose.connect('mongodb://127.0.0.1:27017/db_article');

// ----------------------------------------------------------
// * Creer un model/entité
// ----------------------------------------------------------
// 1er param on peut ignorer
// Dernier param = nom de la table
const Article = mongoose.model('Article', { uuid: String, title : String, content : String, author : String }, 'articles');

const User = mongoose.model('User', { email: String, password : String}, 'users');

// --------------------------------------------------------------
// ROUTES
// --------------------------------------------------------------

// MIDDLEWARE
const authMiddleware = (request, response, next) => {
    // TESTER QU'ON EST CONNECTE
    const token = request.headers.authorization.replace('Bearer ', '');

    // verifier qu'il est valide
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        console.log(decoded);
    // Si erreur jwt (obligé de try catch jwt fait des throw)
    } catch (err){
        console.log(err);
        return response.json({code: "700", message : "Token invalide"});
    }
    // On passe le middleware (on passe le mur)
    next();
}

app.get('/articles', authMiddleware, async (request, response) => {
    // Récupérer les articles dans la base de données
    const articles = await Article.find();

    // On envoie les articles récupérés en BDD dans la réponsé JSON
    return response.json({ code: "200", message: `La liste des articles a été récupérés avec succès`, data: articles});
});

app.get('/article/:uuid', async (request, response) => {
    // Récupérer le parametre nommé uuid dans l'url
    const uuid = request.params.uuid;

    // Récupérer l'article dans la BDD
    const article = await Article.findOne({uuid : uuid});

    // CAS : Erreur on trouve pas d'article (si il est null)
    if (!article){
        return response.json({code: "702", message: `Impossible de récupérer un article avec l'UID ${uuid}`, data: null});
    }
  
    return response.json({code: "200", message: `Article récupéré avec succès`, data: article});
});

app.post('/save-article', async (request, response) => {
    // Récupérer l'article envoyé en JSON
    // Exemple : { id: 2, .....}
    const articleJSON = request.body;

    // Comment savoir si c'est un ajout ou un edition ?
    // Si on a un id dans l'article et que en plus l'article existe déjà dans le tableau 
    // ALORS EDITION
    // EN JS: Si uuid existe dans le JSON
    if (articleJSON.uuid) {
        // Forcer l'id entier
        const uuid = articleJSON.uuid

        // Si article existe dans le tableau
        // Imaginons JSON = { id: 2, .....}, on va voir si le tableau a un article avec le même uuid
        const article = await Article.findOne({uuid: uuid});
    
        // Si article trouvé avec le même id : MODIFICATION
        if (article){

            // Remplacer un element du tableau grace à un index
            article.content = articleJSON.content;
            article.title = articleJSON.title;
            article.author = articleJSON.author;

            // Sauvegarde en base de données
            await article.save();

            // Retrouver l'index du tableau liée à l'id
            return response.json({code: "200", message: 'Article modifié avec succès', data: article});
        }
    }

    // PAR DEFAUT => CREATION
    // Générer un uuid
    const { v4: uuidv4 } = require('uuid');

    // -- ecraser ou créer le champ uuid dans le json qu'on a récupéré avant de l'inserer en base
    articleJSON.uuid = uuidv4();

    // Sauvegarder en base l'article avec le JSON en question
    await Article.create(articleJSON);

    return response.json({code: '200', message: `Article ajouté avec succès`, data : articleJSON});
});

app.delete('/article/:uuid', async (request, response) => {
    // Si pas d'id envoyé
    if (!request.params.uuid) {
        return response.json({message: `L'uuid est obligatoire`});
    }

    // Récupérer le parametre nommé id dans l'url
    const uuid = request.params.uuid;

    // Pour supprimer on va supprimer grace à l'index
    // Donc trouver l'index avec un findIndex predicate id == id
    // Retrouver l'article qu'on veut supprimer en base
    const article = await Article.findOne({uuid : uuid});

    // CAS: Article pas trouvé
    if (!article){
        return response.json({code: '702', message: `Impossible de supprimer un article dont l'UID ${uuid} n'existe pas`, data: null});
    }
    
    // Supprimer un element de la bdd si nous l'avons déjà récupérer
    await Article.findOneAndDelete({ uuid: uuid});

    return response.json({code: '200', message: `Article supprimé avec succès : ${uuid}`, data: article});
});


app.post('/auth', async (request, response) => {
    // Tester le couple email / password
    const user = await User.findOne({ email : request.body.email, password: request.body.password});

    // Si pas ok pour couple
    if (!user){
        return response.json({code: '703', message: `Couple email/mot de passe incorrect`, data: null});
    }

    // Si couple => ok alors generer token
    const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY, {expiresIn : '10min' });

    return response.json({code: '203', message: `Authentifié(e) avec succès !`, data: token});
});

// Lancer le serveur
app.listen(3000);
