'use strict';

const fileStorage = require("../services/fileStorage"),
              md5 = require("../utilities/md5")

module.exports = (sequelize, DataTypes) => {
  var script = sequelize.define('script', {
    projectId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    code: DataTypes.TEXT,
    md5: DataTypes.STRING
  }, {
    paranoid: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },

    hooks: {
      beforeSave: function(m, options){
        if (m.changed('code')){
          m.md5 = md5(m.code)
        }
      },

      afterDestroy: function(m, options){
        logger.info(`script afterDestroy`)

        return bluebird.resolve(m.getTasks({
          lock: options.transaction.LOCK.UPDATE,
          transaction: options.transaction
        })).map((n) => {
          return n.destroy({transaction: options.transaction})
        })
      }
    },
  });

  script.associate = function (models){
    script.belongsTo(models.project)

    script.hasMany(models.task)
    script.hasMany(models.stats)
  }

  script.prototype.createTask = async function (params, opt){
    return Task.create(_.merge({}, params || {}, {
      scriptId: this.id,
      projectId: this.projectId,
    }), opt)
  }

  script.prototype.createTasks = async function (items){
    const t = await sequelize.transaction()

    try{
      await bluebird.mapSeries(items, (n) => {
        return this.createTask(n, {transaction: t})
      })

      await t.commit()
    }catch(e){
      logger.error(e)

      await t.rollback()

      throw e
    }
  }

  script.prototype.saveResult = function (content, opt){
    return fileStorage.write({
      script: this,
      content: JSON.stringify(content)
    })
  }

  script.prototype.readResult = function (day, cb){
    return fileStorage.read({
      script: this,
      day,
      cb
    })
  }

  return script;
};