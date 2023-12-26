import express from 'express';
import bodyParser from 'body-parser';

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
const PORT = 3000;

app.use(bodyParser.json());


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


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
