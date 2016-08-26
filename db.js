var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env == 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-gemcamp.sqlite'
    });
}

var db = {};

db.wblist = sequelize.import(__dirname + '/models/wblist.js');
db.likes = sequelize.import(__dirname + '/models/likes.js');
db.sequelize = sequelize;

module.exports = db;