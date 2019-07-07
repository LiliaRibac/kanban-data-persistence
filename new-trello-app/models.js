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




//define the user model
// NOTES:
// SQL:
// Constraint: a restriction on the data in a column
// Primary Key: a constraint that makes the column UNIQUELY identify an object/row
// Normalization: a set of rules to follow for designing a database
// NOTE: Whenever you need a relationship between two tables,
// 		 you must have a column that points to the other table

// NOTE: A model is like a "template" for an object
exports.Swimlane = sql.define('swimlane', {
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


exports.Card = sql.define('card', {
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



// Swimlane:
// id		title			wasDeleted		
// 1		First Swimlane	false			
// ...

// Card:
// id		title			description		swimlaneId
// 1		First Card		todo			1
// 2		Second Card		todo 2			1
// 3		Third Card		todo 3			1
// 4		Fourth Card		todo 4			1
// 5		Fifth Card		todo 5			1
// ...