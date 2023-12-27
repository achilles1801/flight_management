import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema.js';
import pkg from 'express-openid-connect';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


import airline from './routes/airline.js';
import location from './routes/location.js';
import airplane from './routes/airplane.js';
import airport from './routes/airport.js';
import person from './routes/person.js';
import passenger from './routes/passenger.js';
import passenger_vacation from './routes/passenger_vacation.js';
import leg from './routes/leg.js';
import route from './routes/route.js';
import route_path from './routes/route_path.js';
import flight from './routes/flight.js';
import pilot from  './routes/pilot.js';
import pilot_licenses from './routes/pilot_licenses.js';



dotenv.config();

const app = express();
const PORT = 3000;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: 'http://localhost:3000',
  clientID: 'xVHyHjLXkehoNDEDJ9a8jiIezgRJU7cU',
  issuerBaseURL: 'https://dev-l38tsgz4skl46fcs.us.auth0.com'
};

const { auth, requiresAuth } = pkg;
app.use(bodyParser.json());
app.use(auth(config));

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Middleware to validate JWT for GraphQL mutations
const validateJwtForMutations = (req, res, next) => {
  if (req.body && req.body.query && req.body.query.includes('mutation')) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send('Access Denied: No Token Provided!');
    }
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
    } catch (error) {
      return res.status(400).send('Invalid Token');
    }
  }
  next();
};



app.use('/',
  airline,
  location,
  airplane, 
  airport,
  person,passenger,
  passenger_vacation,
  leg,
  route,
  route_path,
  flight,
  pilot,
  pilot_licenses
  );
// Set up GraphQL endpoint with JWT validation for mutations
app.use('/graphql', validateJwtForMutations, graphqlHTTP((req) => ({
  schema: schema,
  graphiql: true, // Set to false in production
  context: { user: req.user } // Pass user info to GraphQL context
})));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
