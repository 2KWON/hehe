'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.index = index;
exports.create = create;
exports.show = show;
exports.destroy = destroy;
exports.changePassword = changePassword;
exports.me = me;
exports.authCallback = authCallback;

var _sqldb = require('../../sqldb');

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _configEnvironment = require('../../config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */

function index(req, res) {
  _sqldb.User.findAll({
    attributes: ['_id', 'name', 'email', 'role', 'provider']
  }).then(function (users) {
    res.status(200).json(users);
  })['catch'](handleError(res));
}

/**
 * Creates a new user
 */

function create(req, res, next) {
  var newUser = _sqldb.User.build(req.body);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('role', 'user');
  newUser.save().then(function (user) {
    var token = _jsonwebtoken2['default'].sign({ _id: user._id }, _configEnvironment2['default'].secrets.session, {
      expiresIn: 60 * 60 * 5
    });
    res.json({ token: token });
  })['catch'](validationError(res));
}

/**
 * Get a single user
 */

function show(req, res, next) {
  var userId = req.params.id;

  _sqldb.User.find({
    where: {
      _id: userId
    }
  }).then(function (user) {
    if (!user) {
      return res.status(404).end();
    }
    res.json(user.profile);
  })['catch'](function (err) {
    return next(err);
  });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */

function destroy(req, res) {
  _sqldb.User.destroy({ _id: req.params.id }).then(function () {
    res.status(204).end();
  })['catch'](handleError(res));
}

/**
 * Change a users password
 */

function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  _sqldb.User.find({
    where: {
      _id: userId
    }
  }).then(function (user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      return user.save().then(function () {
        res.status(204).end();
      })['catch'](validationError(res));
    } else {
      return res.status(403).end();
    }
  });
}

/**
 * Get my info
 */

function me(req, res, next) {
  var userId = req.user._id;

  _sqldb.User.find({
    where: {
      _id: userId
    },
    attributes: ['_id', 'name', 'email', 'role', 'provider']
  }).then(function (user) {
    // don't ever give out the password or salt
    if (!user) {
      return res.status(401).end();
    }
    res.json(user);
  })['catch'](function (err) {
    return next(err);
  });
}

/**
 * Authentication callback
 */

function authCallback(req, res, next) {
  res.redirect('/');
}
//# sourceMappingURL=user.controller.js.map
