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
    /*
    let newArray = swimlanes.filter((swimlane) => {
        if (swimlane.isDeleted == false) {
            return true;
        } else {
            return false;
        }
    });

    res.send(newArray);
    */
    
    models.Swimlane.findAll({
        attributes: ['id', 'title', 'isDeleted'],
        where: { isDeleted: false }
    })
    .then( swimlanes => {
      	// NOTE: What to do with the results of the SELECT
        res.send(swimlanes);
    } )
  
	.catch( error => {
        console.log( "Error in /api/swimlanes: ", error );
  } );

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
        where: { isDeleted: false, id: req.params.id }
    })
    .then( swimlanes => {
      	// NOTE: What to do with the results of the SELECT
        res.send(swimlanes);
    } )
  	.catch( error => {
      	console.log( "Error in /api/swimlanes: ", error );
    } );
});




//get cards
app.get("/api/cards", (req, res) => {
    // TODO: Send EVERY swimlane's cards
    let allCards = [];
    for (let i = 0; i < swimlanes.length; i++) {
        allCards.push(swimlanes[i].cards);
    }
    res.send(allCards);
})


app.get("/api/cards/:id", (req, res) => {
    // TODO: Send the card whose id is req.params.id
    let card;

    // FOR EACH SWIM LANE...
    for (let s = 0; s < swimlanes.length; s++) {
        // FOR EACH CARD...
        for (let c = 0; c < swimlanes[s].cards.length; c++) {
            if (swimlanes[s].cards[c].id == req.params.id) {
                card = swimlanes[s].cards[c];
            }
        }
    }

    res.send(card)
})


app.post('/api/swimlanes', (req, res) => {
    //let data = req.body;

    swimlaneCounter++;

    swimlanes.push({
        id: swimlaneCounter,
        cards: [],
        title: "",
        isDeleted: false
    });


    res.send(swimlaneCounter  + "")
})

app.post('/api/swimlanes/:id/cards', (req, res) => {
    cardCounter++;
    let swimlane;

    for (let i = 0; i < swimlanes.length; i++) {
        if (swimlanes[i].id == req.params.id) {
            swimlane = swimlanes[i];
        }
    }

    swimlane.cards.push({
        id: cardCounter,
        title: "",
        description: ""
    });


    res.send(200)

})


app.delete("/api/swimlanes/:id", (req, res) => {

    for (let i = 0; i < swimlanes.length; i++) {
        if (swimlanes[i].id == req.params.id) {
            // 2. Delete the swimlane at i
            swimlanes.splice(i, 1);
        }
    }

    res.send(200)

})


app.delete('/api/cards/:id', (req, res) => {

    let card;
    // FOR EACH SWIM LANE...
    for (let s = 0; s < swimlanes.length; s++) {
        // FOR EACH CARD...
        for (let c = 0; c < swimlanes[s].cards.length; c++) {
            if (swimlanes[s].cards[c].id == req.params.id) {
                card = swimlanes[s].cards[c];
                swimlanes[s].cards.splice(c, 1)
            }
        }
    }

    res.send(card);
})

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

    for (let i = 0; i < swimlanes.length; i++) {
        if (swimlanes[i].id == req.params.id) {
            swimlanes[i].title = req.body.title;
        }
    }
    res.send(200);

})

app.put('/api/cards/:id', (req, res) => {
    for (let s = 0; s < swimlanes.length; s++) {
        for (let c = 0; c < swimlanes[s].cards.length; c++) {
            if (swimlanes[s].cards[c].id == req.params.id) {
                swimlanes[s].cards[c].title = req.body.title;
                swimlanes[s].cards[c].description = req.body.title.description;
            }
        }
    }
    res.send(200);
})




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








