import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all flights
router.get('/flights', (req, res) => {
    db.query('SELECT * FROM flight', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// GET a single flight by ID
router.get('/flights/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM flight WHERE flightID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results[0] || null);
    });
});

// POST a new flight
router.post('/flights', (req, res) => {
    const { flightID, routeID, support_airline, support_tail, progress, airplane_status, next_time, cost } = req.body;
    db.query('INSERT INTO flight (flightID, routeID, support_airline, support_tail, progress, airplane_status, next_time, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
             [flightID, routeID, support_airline, support_tail, progress, airplane_status, next_time, cost], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Flight created', flightID });
    });
});

// PUT to update a flight's details
router.put('/flights/:id', (req, res) => {
    const { id } = req.params;
    const { routeID, support_airline, support_tail, progress, airplane_status, next_time, cost } = req.body;
    db.query('UPDATE flight SET routeID = ?, support_airline = ?, support_tail = ?, progress = ?, airplane_status = ?, next_time = ?, cost = ? WHERE flightID = ?', 
             [routeID, support_airline, support_tail, progress, airplane_status, next_time, cost, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Flight updated', flightID: id });
    });
});

// DELETE a flight
router.delete('/flights/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM flight WHERE flightID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Flight deleted', flightID: id });
    });
});

export default router;
