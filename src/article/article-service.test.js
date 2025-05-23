
const articleService = require('./article-service.js');

test('Init', async() => {
    // MONGOOSE
    const mongooseConfig = require('../mongoose/mongoose-config.js');
    
    await mongooseConfig.initConnection();

});

test('Tester getArticles fonctionne', async() => {

    const responseService = await articleService.getArticles();

    expect(responseService.code).toBe("200");
});