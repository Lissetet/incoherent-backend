"use strict";

const express = require("express");
const router = express.Router();
const { Message } = require("../models");
const { authenticateUser } = require("../middleware/auth-user");
const { asyncHandler } = require("../middleware/async-handler");
const { Op, sequelize } = require("sequelize");

// Returns all messages
router.get(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    if (!req.currentUser.admin) {
      res.status(403).end();
    }

    const { type } = req.query;
    const where = type ? { type } : {};
    const messages = await Message.findAll({
      order: [["createdAt", "DESC"]],
      where,
    });
    res.json(messages);
  })
);

// Returns a message by ID
router.get(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    if (!req.currentUser.admin) {
      res.status(403).end();
    }

    const message = await Message.findByPk(req.params.id);
    message ? res.json(message) : res.status(404).end();
  })
);

// Creates a new message
router.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const message = await message.create(req.body);
      res.status(201).location(`/api/messages/${message.id}`).end();
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

// Deletes a message
router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    if (!req.currentUser.admin) {
      res.status(403).end();
    }

    const message = await Message.findByPk(req.params.id);

    if (message) {
      await message.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: "message not found" });
    }
  })
);

module.exports = router;
