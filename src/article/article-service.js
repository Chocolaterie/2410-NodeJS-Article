
const Article = require('../mongoose/article-model.js');

module.exports = {

    /**
     * Récupérer tout les articles
     * @returns 
     */
    getArticles : async () => {
        // Récupérer les articles dans la base de données
        const articles = await Article.find();

        return { code: "200", message: `La liste des articles a été récupérés avec succès`, data: articles};
    }
}