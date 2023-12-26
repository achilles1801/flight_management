import express from 'express';
import pool from './database.js';


const app = express();
const PORT = 3000;


app.get('/test', (req, res) => {
    pool.query('SELECT 1 + 1 AS solution', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ solution: results[0].solution });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
