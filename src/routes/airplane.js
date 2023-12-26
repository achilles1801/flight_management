import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all airplanes
router.get('/airplanes', (req, res) => {
    db.query('SELECT * FROM airplane', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// GET a single airplane by ID (airlineID and tail_num)
router.get('/airplanes/:airlineID/:tail_num', (req, res) => {
    const { airlineID, tail_num } = req.params;
    db.query('SELECT * FROM airplane WHERE airlineID = ? AND tail_num = ?', [airlineID, tail_num], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results[0] || null);
    });
});

// POST a new airplane
router.post('/airplanes', (req, res) => {
    const { airlineID, tail_num, seat_capacity, speed, locationID, plane_type, skids, propellers, jet_engines } = req.body;
    db.query('INSERT INTO airplane (airlineID, tail_num, seat_capacity, speed, locationID, plane_type, skids, propellers, jet_engines) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
             [airlineID, tail_num, seat_capacity, speed, locationID, plane_type, skids, propellers, jet_engines], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Airplane created', airlineID, tail_num });
    });
});

// PUT to update an airplane's details
router.put('/airplanes/:airlineID/:tail_num', (req, res) => {
    const { airlineID, tail_num } = req.params;
    const { seat_capacity, speed, locationID, plane_type, skids, propellers, jet_engines } = req.body;
    db.query('UPDATE airplane SET seat_capacity = ?, speed = ?, locationID = ?, plane_type = ?, skids = ?, propellers = ?, jet_engines = ? WHERE airlineID = ? AND tail_num = ?',
             [seat_capacity, speed, locationID, plane_type, skids, propellers, jet_engines, airlineID, tail_num], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Airplane updated', airlineID, tail_num });
    });
});

// DELETE an airplane
router.delete('/airplanes/:airlineID/:tail_num', (req, res) => {
    const { airlineID, tail_num } = req.params;
    db.query('DELETE FROM airplane WHERE airlineID = ? AND tail_num = ?', [airlineID, tail_num], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Airplane deleted', airlineID, tail_num });
    });
});

export default router;
