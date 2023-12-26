import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all locations
router.get('/locations', (req, res) => {
    db.query('SELECT * FROM location', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// GET a single location by ID
router.get('/locations/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM location WHERE locationID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results[0] || null);
    });
});

// POST a new location
router.post('/locations', (req, res) => {
    const { locationID } = req.body;
    db.query('INSERT INTO location (locationID) VALUES (?)', [locationID], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Location created', locationID });
    });
});


// DELETE a location
router.delete('/locations/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM location WHERE locationID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Location deleted', locationID: id });
    });
});



export default router;