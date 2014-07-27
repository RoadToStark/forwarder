var express = require('express');
var parser = require('./libraries/routes-parser');
var forwarder = require('./libraries/forwarder');

var app = express();

app.all('*', function forward(req, res) {

    parser.getRoute(req, function (route, err) {
        if (err) {
            var response = {
                error: err
            };

            res.send(JSON.stringify(response));
            return;
        }

        forwarder.forward(req, route, function(data, err) {
            if (err) {
                var response = {
                    error: err
                };

                res.send(JSON.stringify(response));
                return;
            }

            res.send(data);

            // Save request metrics

        });
    });
});

module.exports = app;
