var express = require('express');
var parser = require('./libraries/routes-parser');
var forwarder = require('./libraries/forwarder');
var response = require('./libraries/response');

var app = express();

app.all('*', function forward(req, res) {

    // Set response object
    var request_result = {
        errors: []
    };

    // Get corresponding route in config file
    parser.getRoute(req, function (route, err) {
        if (err) {
            request_result.errors[request_result.errors.length] = err;
            response.send(request_result, res);
        }  else {
            forwarder.forward(req, route, function(data, err) {
                if (err) {
                    request_result.errors[request_result.errors.length] = err;
                } else {
                    request_result = data;
                }

                response.send(request_result, res);
            });
        }
    });
});

module.exports = app;
