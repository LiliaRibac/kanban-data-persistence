const express = require('express');
const app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

var path = require("path")
var public = path.join(__dirname, 'public');

let models = require("./models")
models.Swimlane = models.Swimlane( );
models.Card = models.Card( );
console.log(models)

let swimlaneCounter = 2;
let cardCounter = 3;
const swimlanes = [{
        id: 1,
        title: "first swimlane",
        isDeleted: false,

        cards: [{
                id: 1,
                title: 'first card',
                description: "first description"
                // other data below

            },
            {
                id: 2,
                title: 'second card',
                description: "second description"
                // other data below

            }
        ]
    },
    {
        id: 2,
        title: "second swimlane",
        isDeleted: false,

        cards: [{
            id: 3,
            title: 'first card',
            description: "first description"
            // other data below
        }]
    }
]

// TODO: create id gen

app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendFile(path.join(public, 'index.html'));
});



app.get("/api/swimlanes", (req, res) => {
    // TODO: Only show the swimlanes with isDeleted equal to false
    models.Swimlane.findAll({
            attributes: ['id', 'title', 'isDeleted'],
      		include: [{
              model: models.Card
            }],
            where: {
                isDeleted: false
            }
        })
        .then(swimlanes => {
      		console.log( "swimlanes: ", swimlanes );
            // NOTE: What to do with the results of the SELECT
            res.send(swimlanes);
        })

        .catch(error => {
            console.log("Error in /api/swimlanes: ", error);
        });

})



// NOTE: The curly brackets create a "variable" whose value comes from the URL
// 		 The variable can be accessed as a member of req.params using the same name
app.get("/api/swimlanes/:id", (req, res) => {

    // let swimlane;

    // for (let i = 0; i < swimlanes.length; i++) {
    //     if (swimlanes[i].id == req.params.id) {
    //         swimlane = swimlanes[i];
    //     }
    // }

    //res.send(swimlane)
    models.Swimlane.findOne({
            attributes: ['id', 'title', 'isDeleted'],
            where: {
                isDeleted: false,
                id: req.params.id
            }
        })
        .then(swimlanes => {
            // NOTE: What to do with the results of the SELECT
            res.send(swimlanes);
        })
        .catch(error => {
            console.log("Error in /api/swimlanes: ", error);
        });
});




//get cards
app.get("/api/cards", (req, res) => {
    // TODO: Send EVERY swimlane's cards

    models.Card.findAll({
            attributes: ['id', 'title', 'description', 'swimlaneId'],
            where: {
                isDeleted: false,
                // id: req.params.id
            }

        })
        .then(cards => {
            // NOTE: What to do with the results of the SELECT
            res.send(cards);
        })

        .catch(error => {
            console.log("Error in /api/cards: ", error);
        })
})

app.get("/api/cards/:id", (req, res) => {
    // TODO: Send the card whose id is req.params.id
    models.Card.findOne({
            attributes: ['id', 'title', 'description', 'isDeleted'],
            where: {
                isDeleted: false,
                id: req.params.id
            }
        })
        .then(cards => {
            // NOTE: What to do with the results of the SELECT
            res.send(cards);
        })
        .catch(error => {
            console.log("Error in /api/cards: ", error);
        });

})


app.post('/api/swimlanes', (req, res) => {
    //let data = req.body;

    let swimlane = models.Swimlane.build({
        title: "",
        isDeleted: false
    });
    swimlane.save().then((swimlane) => {
        // When the saving is done...
        res.send(swimlane.id + "");
    });

})


app.post('/api/swimlanes/:id/cards', (req, res) => {

    let card = models.Card.build({
        title: "",
        description: "",
        swimlaneId: req.params.id,
        isDeleted: false
    });

    card.save().then((card) => {
        // When the saving is done...
        res.send(card.id + "");
    });

})



app.delete("/api/swimlanes/:id", (req, res) => {
    models.Swimlane.findOne({
        where: {
            id: req.params.id
        }
    }).then((swimlane) => {
        swimlane.destroy().then(() => {
            res.send(req.params.id + "");
        });
    });
})


app.delete('/api/cards/:id', (req, res) => {

    models.Card.findOne( { where: { id: req.params.id } } ).then( ( card ) => {
        // If a card was found
        if( card != null ){
          card.destroy( ).then( ( ) => {
              
            res.send( req.params.id + "" );
          } ).catch( ( error ) => {
            console.log( error );
            res.send( 500 );
          } );
        }
      } );
    });


// --------------------------------------------------------------
// TODO: Update (put) route for updating/changing a swimlane
// 1. Find the swimlane
// 2. Set its properties equal to the properties of req.body
// Example:
// req.body.title should be a property. It depends on the "name" attributes
// of the input elements in the HTML form.

// TODO: Update (put) route for updating/changing a card

// --------------------------------------------------------------


app.put('/api/swimlanes/:id', (req, res) => {

    models.Swimlane.findOne({where: { id: req.params.id } } ).then( ( swimlane ) => {
    
        if( swimlane != null ){
            swimlane.title = req.body.title;
            swimlane.save( ).then( ( ) => {
                
              res.send( req.params.id + "" );
            } ).catch( ( error ) => {
              console.log( error );
              res.send( 500 );
            } );
          }else{
            res.send( "Error: Swimlane not found" );  
          }
        } );
      
      

})

app.put('/api/cards/:id', (req, res) => {
    models.Card.findOne({where: { id: req.params.id } } ).then( ( card ) => {
    
        if( card != null ){
            card.title = req.body.title;
            card.description = req.body.description;
            card.save( ).then( ( ) => {
                
              res.send( req.params.id + "" );
            } ).catch( ( error ) => {
              console.log( error );
              res.send( 500 );
            } );
        } else {
          res.send( "Error: Card not found" );
        }
     } );
});



app.listen(3000, () => console.log('Listening on port 3000...'))


/*


// -------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------




//get all users route
server.get('/api/swimlanes/', (req, res, next) => {
  
    models.Swimlane.findAll({
        attributes: ['id', 'title', 'wasDeleted']
    })
    .then( swimlanes => {
      	// NOTE: What to do with the results of the SELECT
        res.send(swimlanes);
    } );
  
});

//get one user by id
server.get('/users/:id', (req, res, next) => {
    let userid = req.params.id;
    User.findAll({
        attributes: ['userid', 'username', 'firstname', 'lastname'],
        where: {
            userId: userid
    }})
    .then(users => {
        res.send(users);
    });
});

//create a new user
server.post('/users/', (req, res, next) => {
    //create an instance of a user object
    let userid = req.body.userid;
    let username = req.body.username;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;

    var user = User.build({userid: userid, username: username, firstname: firstname, lastname: lastname});

    //save this user to the database
    user.save().then(() => {
        res.end();
    });
});

//delete a user by id
server.del('/users/:id', (req, res, next) => {
    let userid = req.params.id;
    User.findOne({where: {userid: userid}}).then(usr => {
        usr.destroy().then(usr => {
            res.end();
        });
    });
});

//start the restify server
server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});


*/