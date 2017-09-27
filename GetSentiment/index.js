// for Azure backend we need https
var https = require('https');
var RESTCallHelper = require('../Shared/RESTCallHelper.js')

module.exports = function (context, req) {
    context.log('-------------------JavaScript HTTP trigger function processed a request.');

    // // make sure the input is defined
    if ((req.query === undefined) || (req.body === undefined)) {
            context.res = {
                status: 400,
                body: `Invalid input request.query or request.body are not defined`
            };
            context.done();
            return;
    }  
   
    // grab either the query input or the body input and assign to input var
    context.log(`req.query is ${JSON.stringify(req.query)}`);
    var inputDoc = (req.query.text === undefined) ? req.body : req.query;

    //context.log(`inputDoc ${req.body.toString()}`);

    // make sure the input argument is there is not error
    if (inputDoc) {


        try {
            var jsonData = RESTCallHelper.FormatSingleInput(inputDoc);
            
            var result = RESTCallHelper.RESTJSONSentimentCall(context,jsonData);

            result.on('data',function(data){
                context.log("Result data: "+data);
                
                context.res = {
                        status: 200,
                        body: data
                };

                context.done();

            });

            result.on('error',function(error){
                context.log("Error: "+error);
                
                context.res = {
                        status: 400,
                        body: error
                };

                context.done();

            });

        }
        catch (err){

            context.log(`The error was ${err}`);

            context.res = {
                status: 400,
                body: `An exception occured ${err}`
            };

        }
        finally {
            context.log(`Finally executed`);
        

        }

    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a documents array in on the query string or in the request body"
        };
        context.done();
    }

};