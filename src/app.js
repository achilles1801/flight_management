import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema.js';
import pkg from 'express-openid-connect';
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
  secret: '2bedc5aea97d259add569ca27f66117183e8846742a53c24a763a231a204ce90',
  baseURL: 'http://localhost:3000',
  clientID: 'xVHyHjLXkehoNDEDJ9a8jiIezgRJU7cU',
  issuerBaseURL: 'https://dev-l38tsgz4skl46fcs.us.auth0.com'
};

  const { auth, requiresAuth } = pkg;
  app.use(bodyParser.json());
  app.use(auth(config));

  app.use((req, res, next) => {
    console.log(req.oidc.user)
    const roles = req.oidc.user ? req.oidc.user['https://my-app.example.com/roles'] : [];
    req.userRoles = roles;
    next();
  });

  app.get('/profile', requiresAuth(), (req, res) => {
    const { user, accessToken, idToken } = req.oidc;
    res.send({ user, accessToken, idToken });
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
