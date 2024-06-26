"use strict";

const express = require("express");
const router = express.Router();
const { Game, Card } = require("../models");
const { authenticateUser } = require("../middleware/auth-user");
const { asyncHandler } = require("../middleware/async-handler");
const { Op, sequelize } = require("sequelize");

// Returns a list of games for the authenticated user
router.get(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const games = await Game.findAll({
      where: {
        userId: req.currentUser.id,
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(games);
  })
);

// Returns last played game for the authenticated user
router.get(
  "/last",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const game = await Game.findOne({
      where: {
        userId: req.currentUser.id,
      },
      order: [["createdAt", "DESC"]],
    });
    game ? res.json(game) : res.status(404).end();
  })
);

// Returns a game by ID for the authenticated user
router.get(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    console.log(authenticateUser);
    const game = await Game.findOne({
      where: {
        id: req.params.id,
        userId: req.currentUser.id,
      },
    });
    game ? res.json(game) : res.status(404).end();
  })
);

// Creates a new game
router.post(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const game = await Game.create(req.body);
      res
        .status(201)
        .location(`/api/games/${game.id}`)
        .json({ id: game.id })
        .end();
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        console.log(error);
        throw error;
      }
    }
  })
);

// Updates a game
router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const game = await Game.findByPk(req.params.id);
      const { currentUser } = req;
      console.log(req.body);

      if (game) {
        if (currentUser.id !== game.userId) {
          res.status(403).end();
        } else {
          if (req.body.usedCardId) {
            req.body.usedCards = [...game.usedCards, req.body.usedCardId];
            delete req.body.usedCardId;
          }
          await game.update(req.body);
          res.status(204).end();
        }
      } else {
        res.status(404).json({ message: "Game not found" });
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// Deletes a game
router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const game = await Game.findByPk(req.params.id);
    const { currentUser } = req;

    if (game) {
      if (currentUser.id !== game.userId) {
        res.status(403).end();
      } else {
        await game.destroy();
        res.status(204).end();
      }
    } else {
      res.status(404).json({ message: "Game not found" });
    }
  })
);

module.exports = router;
