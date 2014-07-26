var http = require('http');
var querystring = require('querystring');

var forwarder = {

    /*
     * @param request -> client request
     * @param route   -> route to forward object
     */

    forward: function(request, route, callback) {

        var self = this;

        this.checkParams(request, route.params, function send(forwarded_params, error) {
            if (error) {
                callback(null, error);
            }

            self.request(route, forwarded_params, function success(data) {
                callback(data, null);
            });
        });
    },

    /*
     * @param request -> client request
     * @param params  -> params object extracted from route object
     * @return object containing params;
     */

    checkParams : function(request, params, callback) {

        var mandatory_length = params.mandatory.length;
        var optional_length = params.optional.length;
        var forwarded_params = {};


        if (mandatory_length) {
            for (var i = 0 ; i < mandatory_length ; i++) {
                var mandatory_param_name = params.mandatory[i];
                var mandatory_param = request.param(mandatory_param_name);
                if (!mandatory_param) {
                    callback(null, 'Missing parameter');
                    return false;
                } else {
                    forwarded_params[mandatory_param_name] = mandatory_param;
                }
            }
        }

        if (optional_length) {
            for (var j = 0 ; j < optional_length ; j++) {
                var optional_param_name = params.optional[j];
                var optional_param = request.param(optional_param_name);

                if(optional_param) {
                    forwarded_params[optional_param_name] = optional_param;
                }
            }
        }

        callback(forwarded_params);
    },

    /*
     * @param route -> Route object
     * @param data  -> request parameters object
     * @return callback on success;
     */

    request: function(route, data, success) {

        var data_string = JSON.stringify(data);
        var endpoint = route.endpoint;
        var headers = {};

        if (route.verb == 'GET') {
            endpoint += '?' + querystring.stringify(data);
        } else {
            headers = {
                'Content-Type': 'application/json',
                'Content-Length': 'data_string.length'
            };
        }

        var request_options = {
            host: route.host,
            endpoint: endpoint,
            method: route.verb,
            headers: headers
        };

        var req = http.request(request_options, function(res) {
            res.setEncoding('utf-8');

            var response_string = '';

            res.on('data', function(data) {
                response_string += data;
            });

            res.on('end', function() {
                response_object = JSON.parse(response_string);
                success(response_object);
            });
        });

        req.write(data_string);
        req.end();
    }
};

module.exports = forwarder;