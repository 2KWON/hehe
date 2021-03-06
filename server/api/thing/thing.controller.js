/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  update
 * DELETE  /api/things/:id          ->  destroy
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sqldb = require('../../sqldb');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    return entity.updateAttributes(updates).then(function (updated) {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.destroy().then(function () {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Things

function index(req, res) {
  _sqldb.Thing.findAll().then(respondWithResult(res))['catch'](handleError(res));
}

// Gets a single Thing from the DB

function show(req, res) {
  _sqldb.Thing.find({
    where: {
      _id: req.params.id
    }
  }).then(handleEntityNotFound(res)).then(respondWithResult(res))['catch'](handleError(res));
}

// Creates a new Thing in the DB

function create(req, res) {
  _sqldb.Thing.create(req.body).then(respondWithResult(res, 201))['catch'](handleError(res));
}

// Updates an existing Thing in the DB

function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  _sqldb.Thing.find({
    where: {
      _id: req.params.id
    }
  }).then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(respondWithResult(res))['catch'](handleError(res));
}

// Deletes a Thing from the DB

function destroy(req, res) {
  _sqldb.Thing.find({
    where: {
      _id: req.params.id
    }
  }).then(handleEntityNotFound(res)).then(removeEntity(res))['catch'](handleError(res));
}
//# sourceMappingURL=thing.controller.js.map
