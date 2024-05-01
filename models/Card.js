'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Card extends Model {}
  Card.init({
    clue: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A clue is required'
            },
            notEmpty: {
                msg: 'Please provide a clue'
            }
        }
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'An answer is required'
            },
            notEmpty: {
                msg: 'Please provide an answer'
            }
        }
    },
    hint: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A hint is required'
            },
            notEmpty: {
                msg: 'Please provide a hint'
            }
        }
    },
    definition: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A definition is required'
            },
            notEmpty: {
                msg: 'Please provide a definition'
            }
        }
    },
    category: {
        type: DataTypes.ENUM('kinky', 'party', 'popCulture', 'family', 'custom'),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A category is required'
            },
            notEmpty: {
                msg: 'Please provide a category'
            },
            isIn: {
                args: [['kinky', 'party', 'family', 'custom']],
                msg: 'Category must be either "kinky", "party", "family", or "custom"'
            }
        }
    },
  }, { 
    sequelize, 
    timestamps: true,
});

  return Card;
};