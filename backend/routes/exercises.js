 const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to exercises.json
const exercisesPath = path.join(__dirname, '../data/exercises.json');

// Helper function to read exercises
const readExercises = () => {
  const data = fs.readFileSync(exercisesPath);
  return JSON.parse(data);
};

// Get all exercises
router.get('/', (req, res) => {
  try {
    const exercises = readExercises();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load exercises' });
  }
});

// Get single exercise
router.get('/:id', (req, res) => {
  try {
    const exercises = readExercises();
    const exercise = exercises.find(ex => ex.id === req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load exercise' });
  }
});

module.exports = router;