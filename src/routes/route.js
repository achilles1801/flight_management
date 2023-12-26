import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all routes
router.get('/routes', (req, res) => {
    db.query('SELECT * FROM route', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// GET a single route by ID
router.get('/routes/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM route WHERE routeID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results[0] || null);
    });
});

// POST a new route
router.post('/routes', (req, res) => {
    const { routeID } = req.body;
    db.query('INSERT INTO route (routeID) VALUES (?)', [routeID], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Route created', routeID });
    });
});

// DELETE a route
router.delete('/routes/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM route WHERE routeID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Route deleted', routeID: id });
    });
});

export default router;
