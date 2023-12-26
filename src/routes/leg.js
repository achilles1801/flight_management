import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all legs
router.get('/legs', (req, res) => {
    db.query('SELECT * FROM leg', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// GET a single leg by ID
router.get('/legs/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM leg WHERE legID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results[0] || null);
    });
});

// POST a new leg
router.post('/legs', (req, res) => {
    const { legID, distance, departure, arrival } = req.body;
    db.query('INSERT INTO leg (legID, distance, departure, arrival) VALUES (?, ?, ?, ?)', 
             [legID, distance, departure, arrival], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Leg created', legID });
    });
});

// PUT to update a leg's details
router.put('/legs/:id', (req, res) => {
    const { id } = req.params;
    const { distance, departure, arrival } = req.body;
    db.query('UPDATE leg SET distance = ?, departure = ?, arrival = ? WHERE legID = ?', 
             [distance, departure, arrival, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Leg updated', legID: id });
    });
});

// DELETE a leg
router.delete('/legs/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM leg WHERE legID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Leg deleted', legID: id });
    });
});

export default router;
