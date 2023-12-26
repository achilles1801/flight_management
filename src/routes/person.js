import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all persons
router.get('/persons', (req, res) => {
    db.query('SELECT * FROM person', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// GET a single person by ID
router.get('/persons/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM person WHERE personID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results[0] || null);
    });
});

// POST a new person
router.post('/persons', (req, res) => {
    const { personID, first_name, last_name, locationID } = req.body;
    db.query('INSERT INTO person (personID, first_name, last_name, locationID) VALUES (?, ?, ?, ?)', 
             [personID, first_name, last_name, locationID], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Person created', personID });
    });
});

// PUT to update a person's details
router.put('/persons/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, locationID } = req.body;
    db.query('UPDATE person SET first_name = ?, last_name = ?, locationID = ? WHERE personID = ?', 
             [first_name, last_name, locationID, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Person updated', personID: id });
    });
});

// DELETE a person
router.delete('/persons/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM person WHERE personID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Person deleted', personID: id });
    });
});

export default router;
