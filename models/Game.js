'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Game extends Model {}
  Game.init({
    status: {
        type: DataTypes.ENUM('playing', 'completed'),
        allowNull: false,
        defaultValue: 'playing',
        validate: {
            notNull: {
                msg: 'A status is required'
            },
            notEmpty: {
                msg: 'Please provide a status'
            },
            isIn: {
                args: [['playing', 'completed']],
                msg: 'Status must be either "playing" or "completed"'
            }
        }
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
            isInt: {
                msg: 'Score must be an integer'
            }
        }
    },
    keepScore: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notNull: {
                msg: 'A keepScore value is required'
            },
            notEmpty: {
                msg: 'Please provide a keepScore value'
            },
            isBoolean(value) {
                if (typeof value !== 'boolean') {
                    throw new Error('keepScore must be a boolean value');
                }
            }
        }
    },
    usedCards: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: [],
        validate: {
            isArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error('usedCards must be an array of integers');
                }
            }, 
        }
    },
  }, { 
    sequelize,
    timestamps: true,
 });


  Game.associate = (models) => {
    Game.belongsTo(models.User, {
        as: 'user',
        foreignKey: {
            fieldName: 'userId',
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A userId is required'
                },
                notEmpty: {
                    msg: 'Please provide a userId'
                }
            }
        },
        onDelete: 'CASCADE',
    });
  }

  return Game;
};