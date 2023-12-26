import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all passengers
router.get('/passengers', (req, res) => {
    db.query('SELECT * FROM passenger', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// GET a single passenger by ID
router.get('/passengers/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM passenger WHERE personID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results[0] || null);
    });
});

// POST a new passenger
router.post('/passengers', (req, res) => {
    const { personID, miles, funds } = req.body;
    db.query('INSERT INTO passenger (personID, miles, funds) VALUES (?, ?, ?)', 
             [personID, miles, funds], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Passenger created', personID });
    });
});

// PUT to update a passenger's details
router.put('/passengers/:id', (req, res) => {
    const { id } = req.params;
    const { miles, funds } = req.body;
    db.query('UPDATE passenger SET miles = ?, funds = ? WHERE personID = ?', 
             [miles, funds, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Passenger updated', personID: id });
    });
});

// DELETE a passenger
router.delete('/passengers/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM passenger WHERE personID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Passenger deleted', personID: id });
    });
});

export default router;
