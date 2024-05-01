"use strict";

const express = require("express");
const router = express.Router();
const { Card } = require("../models");
const { authenticateUser } = require("../middleware/auth-user");
const { asyncHandler } = require("../middleware/async-handler");
const { sequelize } = require("sequelize");

// Returns a list of 50 random cards
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { categories } = req.query;
    const where = categories ? { category: categories.split(",") } : {};
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;

    const cards = await Card.findAll({
      order: sequelize.random(),
      where,
      limit,
    });

    res.json(cards);
  })
);

// Return a random card
router.get(
  "/random",
  authenticateUser,
  asyncHandler(async (req, res) => {
    if (!req.currentUser) {
      res.status(403).end();
    }

    const { gameId, categories } = req.query;
    const { usedCards } = await Game.findByPk(gameId);

    const where = {
      ...(usedCards ? { id: { [sequelize.Op.notIn]: usedCards } } : {}),
      ...(categories ? { category: { [Op.in]: categories.split(",") } } : {}),
    };

    const card = await Card.findOne({
      order: sequelize.random(),
      where,
    });

    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ message: "No cards found" });
    }
  })
);

// Creates a new card
router.post(
  "/",
  asyncHandler(async (req, res) => {
    // router.post('/', authenticateUser, asyncHandler(async (req, res) => {
    try {
      // const { currentUser } = req
      // if (!currentUser?.admin) {
      //   res.status(403).end()
      // }
      const card = await Card.create(req.body);
      res.status(201).location(`/api/cards/${card.id}`).end();
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

// Updates a card
router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const { currentUser } = req;
      if (!currentUser?.admin) {
        res.status(403).end();
      }
      const card = await Card.findByPk(req.params.id);
      if (card) {
        await card.update(req.body);
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Card not found" });
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

// Deletes a card
router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const { currentUser } = req;
    if (!currentUser?.admin) {
      res.status(403).end();
    }
    const card = await Card.findByPk(req.params.id);
    if (card) {
      await card.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Card not found" });
    }
  })
);

module.exports = router;
