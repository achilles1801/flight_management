import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all route paths
router.get('/route_paths', (req, res) => {
    db.query('SELECT * FROM route_path', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// GET a single route path by routeID and sequence
router.get('/route_paths/:routeID/:sequence', (req, res) => {
    const { routeID, sequence } = req.params;
    db.query('SELECT * FROM route_path WHERE routeID = ? AND sequence = ?', 
             [routeID, sequence], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results[0] || null);
    });
});

// POST a new route path
router.post('/route_paths', (req, res) => {
    const { routeID, legID, sequence } = req.body;
    db.query('INSERT INTO route_path (routeID, legID, sequence) VALUES (?, ?, ?)', 
             [routeID, legID, sequence], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Route path created', routeID, sequence });
    });
});

// PUT to update a route path
router.put('/route_paths/:routeID/:sequence', (req, res) => {
    const { routeID, sequence } = req.params;
    const { legID } = req.body;
    db.query('UPDATE route_path SET legID = ? WHERE routeID = ? AND sequence = ?', 
             [legID, routeID, sequence], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Route path updated', routeID, sequence });
    });
});

// DELETE a route path
router.delete('/route_paths/:routeID/:sequence', (req, res) => {
    const { routeID, sequence } = req.params;
    db.query('DELETE FROM route_path WHERE routeID = ? AND sequence = ?', 
             [routeID, sequence], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Route path deleted', routeID, sequence });
    });
});

export default router;
