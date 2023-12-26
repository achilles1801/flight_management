import express from 'express';
import bodyParser from 'body-parser';

import airline from './routes/airline.js';


const app = express();
const PORT = 3000;

app.use(bodyParser.json());


app.use('/', airline);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
