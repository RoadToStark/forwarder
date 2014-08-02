var fs = require('fs');

var RouteParser = {

    /*
     * @param request -> HTTP request from client
     * @param callback with data or error
     */

    getRoute : function(request, callback) {

        var callback_error;
        var callback_data;

        fs.readFile('routes/routes.json', 'utf-8', function parse(error, data) {

            var routes = JSON.parse(data).routes;
            var routes_length = routes.length;

            for (var i = 0 ; i < routes_length ; i++) {

                var is_current_route = routes[i].income.localeCompare(request.path) == 0
                                        && request.method.localeCompare(routes[i].verb) == 0;

                if (is_current_route) {
                    callback_data = routes[i];
                }
            }

            if (!callback_data) {
                var error = {
                    type: 'Bad request',
                    message: 'Impossible to find route : ' + request.path
                };

                callback(null, error);
                return;
            }

            callback(callback_data, null);
        });
    }
};

module.exports = RouteParser;