import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all airports
router.get('/airports', (req, res) => {
    db.query('SELECT * FROM airport', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// GET a single airport by ID
router.get('/airports/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM airport WHERE airportID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results[0] || null);
    });
});

// POST a new airport
router.post('/airports', (req, res) => {
    const { airportID, airport_name, city, state, country, locationID } = req.body;
    db.query('INSERT INTO airport (airportID, airport_name, city, state, country, locationID) VALUES (?, ?, ?, ?, ?, ?)', 
             [airportID, airport_name, city, state, country, locationID], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Airport created', airportID });
    });
});

// PUT to update an airport's details
router.put('/airports/:id', (req, res) => {
    const { id } = req.params;
    const { airport_name, city, state, country, locationID } = req.body;
    db.query('UPDATE airport SET airport_name = ?, city = ?, state = ?, country = ?, locationID = ? WHERE airportID = ?', 
             [airport_name, city, state, country, locationID, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Airport updated', airportID: id });
    });
});

// DELETE an airport
router.delete('/airports/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM airport WHERE airportID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Airport deleted', airportID: id });
    });
});

export default router;
