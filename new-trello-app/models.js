const Sequelize = require("sequelize");
const Op = Sequelize.Op;

//create sql connection data
const sql = new Sequelize('kanban-data-persistence', 'admin', 'admin', {
    host: 'Lily-Lenovo',
    port: 3306,
    dialect: 'mysql',
    // operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acuire: 30000,
        idle: 10000
    }
});

//authenticate our database connection
sql
    .authenticate()
    .then(() => {
        console.log("The connection was successful!");
    })
    .catch(err => {
        console.log("There was an error when connecting!");
        console.log(err);
    });


exports.Swimlane = function( sequelize, DataTypes ){
  let Swimlane = sql.define('swimlane', {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      title: {
          type: Sequelize.STRING
      },
      isDeleted: {
          type: Sequelize.BOOLEAN
      }
  }, {
      timestamps: false
  });
  
  Swimlane.associate = function( models ){
 
    Swimlane.hasMany( models.Card );
  }
  
  return Swimlane;
};

exports.Card = function( sequelize, DataTypes ){
  
  let Card = sql.define('card', {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      title: {
          type: Sequelize.STRING
      },
      description: {
          type: Sequelize.STRING
      },
      swimlaneId: {
       type: Sequelize.INTEGER
      },
      isDeleted: {
          type: Sequelize.BOOLEAN
      }
  }, {
      timestamps: false
  });
 
  Card.associate = function( models ){
    
    Card.belongsTo( models.Swimlane );
  }
  
  return Card;
};

