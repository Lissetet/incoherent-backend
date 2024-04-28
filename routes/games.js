'use strict';

const express = require('express');
const router = express.Router();
const { Game, Card } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');
const { Op, sequelize } = require('sequelize');

// Returns a list of games for the authenticated user
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
  const games = await Game.findAll({
    where: {
      userId: req.currentUser.id,
    },
    order: [['createdAt', 'DESC']],
  });
  res.json(games);
}));

// Returns a game by ID for the authenticated user
router.get('/:id', authenticateUser, asyncHandler(async (req, res) => {
  const Game = await Game.findOne({
    where: {
      id: req.params.id,
      userId: req.currentUser.id,
    },
  });
  Game ? res.json(Game) : res.status(404).end();
}));

// Creates a new game
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const Game = await Game.create(req.body);
    res.status(201).location(`/api/games/${Game.id}`).json(Game).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// Updates a game
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const Game = await Game.findByPk(req.params.id);
    const { currentUser } = req

    if (Game) {
      if (currentUser.id !== Game.userId ) {
        res.status(403).end()
      } else {
        await Game.update(req.body);
        res.status(204).end();
      }
    } else {
      res.status(404).json({ message: "Game not found" });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// Adds a card to a game's usedCards array and returns new card
router.put('/:id/addPlay', authenticateUser, asyncHandler(async (req, res) => {
  const game = await Game.findByPk(req.params.id);
  const { currentUser } = req
  if (!game) {
    res.status(404).json({ message: "Game not found" });
  }
  if (currentUser.id !== game.userId) {
    res.status(403).end()
  }

  const { category } = game
  const where = category ? { category } : {}
  const { lastCardId, scoreUpdate } = req.body;

  game.usedCards.push(lastCardId);
  if (game.keepScore) {
    game.score += scoreUpdate;
  }
  const card = await Card.findOne({
    where: {
      id: {
        [Op.notIn]: game.usedCards,
      },
      ...where,
    },
    order: [
      sequelize.random(),
    ],
  });

  if (!card) {
    game.status = 'completed';
  }
  await game.save();

  if (card) {
    res.json(card);
  } else {
    res.status(204).json({ message: "No more cards" });
  }
}));

// Deletes a game
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
  const Game = await Game.findByPk(req.params.id);
  const { currentUser } = req

  if (Game) {
    if (currentUser.id !== Game.userId) {
      res.status(403).end()
    } else {
      await Game.destroy();
      res.status(204).end();
    }
  } else {
    res.status(404).json({ message: "Game not found" });
  }
}));

module.exports = router;