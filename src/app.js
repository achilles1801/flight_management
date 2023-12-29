import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema.js';
import pkg from 'express-openid-connect';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


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


const app = express();
dotenv.config();
const PORT = 3000;
app.use(bodyParser.json());

const { auth, requiresAuth } = pkg; // imports the auth and requiresAuth functions from the express-openid-connect library
const config = { // defines a config object for the auth0 middleware
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: 'http://localhost:3000',
  clientID: process.env.clientID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL

};
app.use(auth(config));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


const __filename = fileURLToPath(import.meta.url); // import.meta.url gives the current file path (starts with file://), __filename is the same path without file://
const __dirname = dirname(__filename); // __dirname is a function from the built-in path module in node that gives the directory name of a file path
app.use(express.static(path.join(__dirname, 'public'))); // allows me to use the files in the public folder
 // when a user visits the site, auth(config) is invoked, and since in my config i have authRequired set to true, the user will be redirected to the auth0 login page

app.get('/', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html')); // Serve the dashboard page after login
});
app.use(express.static(path.join(__dirname, 'public'))); // allows me to use the files in the public folder

app.get('/endpoints', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'endpoints.html'));
});

app.get('/logout', (req, res) => {
  req.oidc.logout({
      returnTo: 'http://localhost:3000', // URL to redirect after logout
  });
});
 
  app.use((req, res, next) => {
    const roles = req.oidc.user ? req.oidc.user['https://my-app.example.com/roles'] : [];
    req.userRoles = roles;
    next();
  });

// Middleware to check if user is admin for certain requests
function checkAdminForREST(req, res, next) {
  const methods = ['POST', 'PUT', 'DELETE'];
  if (methods.includes(req.method)) {
    const roles = req.oidc.user ? req.oidc.user['https://my-app.example.com/roles'] : [];
    if (!roles.includes('Admin')) {
      res.status(403).json({ error: 'You are not authorized to do this action' });
      return;
    }
  }
  next();
}
app.use('/', checkAdminForREST);
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
  app.use('/graphql', requiresAuth(), graphqlHTTP((req, res, gql) => {
    // Role check for mutations can be done inside GraphQL resolvers
    return {
      schema: schema,
      graphiql: true, // Set to false in production
      context: { userRoles: req.userRoles }, // Pass user roles to GraphQL context
      customFormatErrorFn: (err) => ({ message: err.message }),
    };
  }));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
