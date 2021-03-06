'use strict';

var fs        = require('fs')
var path      = require('path')
var Sequelize = require('sequelize')
var basename  = path.basename(__filename)
var env       = process.env.NODE_ENV || 'development'
var config    = require(process.env['DB_CONFIG'] || `${__dirname}/../../../config/database.json`)[env]
var db        = {}

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

function getModelName(name){
  return name.split("_").map((n) => {
    return n.replace(/^\S/,function(s){return s.toUpperCase();})
  }).join("")
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;

    global[getModelName(model.name)] = model      //load for global use
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

global.initialized = true
global.sequelize = sequelize

module.exports = db;
