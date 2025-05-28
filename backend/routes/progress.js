 const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserProgress = require('../models/UserProgress');

// Get all progress for user
router.get('/', auth, async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.userId });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load progress' });
  }
});

// Get progress for specific exercise
router.get('/:exerciseId', auth, async (req, res) => {
  try {
    let progress = await UserProgress.findOne({
      userId: req.userId,
      exerciseId: req.params.exerciseId
    });

    if (!progress) {
      progress = new UserProgress({
        userId: req.userId,
        exerciseId: req.params.exerciseId,
        status: 'not_started'
      });
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load progress' });
  }
});

// Update progress for exercise
router.post('/:exerciseId', auth, async (req, res) => {
  try {
    const { status, code } = req.body;

    let progress = await UserProgress.findOne({
      userId: req.userId,
      exerciseId: req.params.exerciseId
    });

    if (!progress) {
      progress = new UserProgress({
        userId: req.userId,
        exerciseId: req.params.exerciseId
      });
    }

    progress.status = status || progress.status;
    progress.code = code || progress.code;

    if (status === 'completed') {
      progress.completedAt = new Date();
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

module.exports = router;