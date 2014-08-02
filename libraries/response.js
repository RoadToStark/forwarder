/* TODO : Config for status code */

var Response = {

    /*
     * @param response -> Javascript object containing response
     * @param client -> Response object to reach the client
     * Send HTTP request response to client
     */

    send : function(response, client) {

        // Response
        if (!response.errors.length) {
            client.statusCode = 200;
        } else {
            if(response.errors[0].type == 'Bad request')
            {
                client.statusCode = 400;
            }
        }

        client.setHeader('Content-Type', 'application/json');
        client.send(response);
    }
};

module.exports = Response;