'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;


                    let action = requestBody.result.action;
                    if (action == "input.welcome") {
                        speech = '<speak><audio src="https://s3-eu-west-1.amazonaws.com/irfs-gojetters-prototype/gojetters_IntroAndTheme_1.mp3">Welcome</audio></speak>';
                    }
                    if (action == "input.unknown") {
                        speech = '<speak><audio src="https://s3-eu-west-1.amazonaws.com/irfs-gojetters-prototype/gojetters_UbercornDidntHear_11.mp3">Error</audio></speak>';
                    }
                }
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample',
            data: { 'google': {'is_ssml': true } }
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
