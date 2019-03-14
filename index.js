
const express = require('express'); //project uses the express server
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const graphql = require('graphql')

const {send} = require ('micro');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('now-env');


const app = express();



/*app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'localhost:3000');
    res.setHeader('Access-Control-Allow_Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control_Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})*/
app.use(cors({credentials: true, origin: true, allowedHeaders: ['Content-Type', 'Authorization']}));
app.options('*', cors());
app.use(helmet());
app.use(bodyParser.json());


/*app.use(session({
    key: 'userSid',
    secret: 'thetopsecretbaseofthealiensthatcametonigeria',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if(req.coookies.userSid && !req.seession.user) {
        res.clearCookie('userSid');
    }
    next();
});*/

	   

 app.use('/', graphqlHTTP({
    schema: schema,
	graphiql: true
})
);


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@gothere-kluc7.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
 { useNewUrlParser: true })
    .then( () => { 
		app.listen(4000);
		console.log('Ready');
		})
    .catch(err => {console.log(err);
       });
    
