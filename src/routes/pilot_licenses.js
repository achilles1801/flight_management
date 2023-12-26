import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET all pilot licenses
router.get('/pilot_licenses', (req, res) => {
    db.query('SELECT * FROM pilot_licenses', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// GET a single pilot's licenses by pilot ID
router.get('/pilot_licenses/:personID', (req, res) => {
    const { personID } = req.params;
    db.query('SELECT * FROM pilot_licenses WHERE personID = ?', [personID], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// POST a new pilot license
router.post('/pilot_licenses', (req, res) => {
    const { personID, license } = req.body;
    db.query('INSERT INTO pilot_licenses (personID, license) VALUES (?, ?)', [personID, license], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Pilot license added', personID, license });
    });
});

// DELETE a pilot license
router.delete('/pilot_licenses/:personID/:license', (req, res) => {
    const { personID, license } = req.params;
    db.query('DELETE FROM pilot_licenses WHERE personID = ? AND license = ?', [personID, license], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Pilot license deleted', personID, license });
    });
});

export default router;
