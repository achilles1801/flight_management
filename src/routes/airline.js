import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all airlines
router.get('/airlines', (req, res) => {
    db.query('SELECT * FROM airline', (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.json(results);
      });
    });

    // GET a single airline by ID
router.get('/airlines/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM airline WHERE airlineID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results[0] || null);
    });
});

// POST a new airline
router.post('/airlines', (req, res) => {
    const { airlineID, revenue } = req.body;
    db.query('INSERT INTO airline (airlineID, revenue) VALUES (?, ?)', [airlineID, revenue], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Airline created', airlineID });
    });
});

// PUT to update an airline's details
router.put('/airlines/:id', (req, res) => {
    const { id } = req.params;
    const { revenue } = req.body;
    db.query('UPDATE airline SET revenue = ? WHERE airlineID = ?', [revenue, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Airline updated', airlineID: id });
    });
});

// DELETE an airline
router.delete('/airlines/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM airline WHERE airlineID = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Airline deleted', airlineID: id });
    });
});

export default router;