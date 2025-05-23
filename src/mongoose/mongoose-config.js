
// ----------------------------------------------------------
// * MongoDB
// ----------------------------------------------------------
const mongoose = require('mongoose');

module.exports = {

    initConnection : () =>  {
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
    }
};
