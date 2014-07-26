var express = require('express');
var parser = require('./libraries/routes-parser');
var forwarder = require('./libraries/forwarder');

var app = express();

app.all('*', function forward(req, res) {

    parser.getRoute(req, function (route, error) {
        if (error) {
            res.send(error);
        }

        forwarder.forward(req, route, function(data, error) {
            if (error) {
                res.send(error);
            }
            res.send(data);
        });
    });
});

module.exports = app;
