'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Message extends Model {}
  Message.init({
    subject: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A message is required'
            },
            notEmpty: {
                msg: 'Please provide a message'
            }
        }
    },
    type : {
        type: DataTypes.ENUM('help', 'bug', 'suggestion', 'feedback', 'other'),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A type is required'
            },
            notEmpty: {
                msg: 'Please provide a type'
            },
            isIn: {
                args: [['help', 'bug', 'suggestion', 'feedback', 'other']],
                msg: 'Type must be one of: help, bug, suggestion, feedback, other'
            }
        }
    },
    rating : {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: {
                msg: 'Rating must be an integer'
            },
            min: {
                args: [1],
                msg: 'Rating must be at least 1'
            },
            max: {
                args: [5],
                msg: 'Rating must be at most 5'
            }
        }
    },
    
  }, { 
    sequelize,
    timestamps: true,
 });


  Message.associate = (models) => {
    Message.belongsTo(models.User, {
        as: 'user',
        foreignKey: {
            fieldName: 'userId',
            allowNull: true,
        },
    });
  }

  return Message;
};