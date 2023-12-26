import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all passenger vacations
router.get('/passenger_vacations', (req, res) => {
    db.query('SELECT * FROM passenger_vacations', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// GET passenger vacations by personID
router.get('/passenger_vacations/:personID', (req, res) => {
    const { personID } = req.params;
    db.query('SELECT * FROM passenger_vacations WHERE personID = ?', [personID], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// POST a new passenger vacation
router.post('/passenger_vacations', (req, res) => {
    const { personID, airportID, sequence } = req.body;
    db.query('INSERT INTO passenger_vacations (personID, airportID, sequence) VALUES (?, ?, ?)', 
             [personID, airportID, sequence], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Passenger vacation created', personID, sequence });
    });
});

// PUT to update a passenger vacation
router.put('/passenger_vacations/:personID/:sequence', (req, res) => {
    const { personID, sequence } = req.params;
    const { airportID } = req.body;
    db.query('UPDATE passenger_vacations SET airportID = ? WHERE personID = ? AND sequence = ?', 
             [airportID, personID, sequence], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Passenger vacation updated', personID, sequence });
    });
});

// DELETE a passenger vacation
router.delete('/passenger_vacations/:personID/:sequence', (req, res) => {
    const { personID, sequence } = req.params;
    db.query('DELETE FROM passenger_vacations WHERE personID = ? AND sequence = ?', [personID, sequence], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Passenger vacation deleted', personID, sequence });
    });
});

export default router;
