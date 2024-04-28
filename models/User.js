'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required'
        },
        notEmpty: {
          msg: 'Please provide a first name'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required'
        },
        notEmpty: {
          msg: 'Please provide a last name'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The email you entered already exists',
      },
      validate: {
        notNull: {
          msg: 'An email is required',
        },
        isEmail: {
          msg: 'Please provide a valid email address',
        }
      }
    },
    password: {
      type: DataTypes.STRING,  
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        },
        is: {
          args: /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
          msg: 'Password must be at least 8 characters long and contain at least one number and one symbol'
        }
      },
      set(val) {
        const hashedPassword = val ? bcrypt.hashSync(val, 10) : "";
        this.setDataValue('password', hashedPassword);
      }
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        notNull: {
          msg: 'An admin value is required'
        },
        notEmpty: {
          msg: 'Please provide an admin value'
        },
        isBoolean(value) {
          if (typeof value !== 'boolean') {
            throw new Error('admin must be a boolean value');
          }
        }
      }
    },
    excludedCards: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('excludedCards must be an array');
          }
        }
      }
    },
    favoriteCards: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('favoriteCards must be an array');
          }
        }
      }
    },
  }, { 
    sequelize, 
    timestamps: true,
    hooks: {
      beforeCreate: (user) => {
        user.email = user.email.toLowerCase();
        if (user.admin) {
          throw new Error('Cannot set admin property during creation');
        }
      },
      beforeUpdate: (user) => {
        if (user.changed('email')) {
          user.email = user.email.toLowerCase();
        }
        if (user.changed('admin')) {
          throw new Error('Cannot update admin property');
        }
        if (user.changed('password')) {
          user.password = bcrypt.hashSync(user.password, 10);
        }
      }
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Game, {
      as: 'games',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
    User.hasMany(models.Message, {
      as: 'messages',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return User;
};