/*global exports, require*/
'use strict';
var dataAccess = require('../data_access');
var cloudHandler = require('../cloudHandler');
var e = require('../errors');

var logger = require('./../logger').logger;

// Logger
var log = logger.getLogger('RecordingsResource');

exports.getList = function (req, res, next) {
    log.debug('Representing recordings for room ', req.params.room, 'and service', req.authData.service._id);
    cloudHandler.getSubscriptionsInRoom (req.params.room, 'recording', function (recordings) {
        if (recordings === 'error') {
            return next(new e.CloudError('Operation failed'));
        }
        res.send(recordings);
    });
};

exports.add = function (req, res, next) {
    var sub_req = {
      type: 'recording',
      connection: {
        container: req.body.container
      },
      media: req.body.media
    };
    cloudHandler.addServerSideSubscription(req.params.room, sub_req, function (result, err) {
        if (result === 'error') {
            return next(err);
        }
        res.send(result);
        return;
    });
};

exports.patch = function (req, res, next) {
    var sub_id = req.params.id,
        cmds = req.body;
    cloudHandler.controlSubscription(req.params.room, sub_id, cmds, function (result) {
        if (result === 'error') {
            return next(new e.CloudError('Operation failed'));
        }
        res.send(result);
        return;
    });
};

exports.delete = function (req, res, next) {
    var sub_id = req.params.id;
    cloudHandler.deleteSubscription(req.params.room, sub_id, function (result) {
        log.debug('result', result);
        if (result === 'error') {
            next(new e.CloudError('Operation failed'));
        } else {
            res.send();
        }
    });
};
