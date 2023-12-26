import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all pilots
router.get('/pilots', (req, res) => {
    db.query('SELECT * FROM pilot', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// GET a single pilot by ID
router.get('/pilots/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM pilot WHERE personID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results[0] || null);
    });
});

// POST a new pilot
router.post('/pilots', (req, res) => {
    const { personID, taxID, experience, commanding_flight } = req.body;
    db.query('INSERT INTO pilot (personID, taxID, experience, commanding_flight) VALUES (?, ?, ?, ?)', 
             [personID, taxID, experience, commanding_flight], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Pilot created', personID });
    });
});

// PUT to update a pilot's details
router.put('/pilots/:id', (req, res) => {
    const { id } = req.params;
    const { taxID, experience, commanding_flight } = req.body;
    db.query('UPDATE pilot SET taxID = ?, experience = ?, commanding_flight = ? WHERE personID = ?', 
             [taxID, experience, commanding_flight, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Pilot updated', personID: id });
    });
});

// DELETE a pilot
router.delete('/pilots/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM pilot WHERE personID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Pilot deleted', personID: id });
    });
});

export default router;
