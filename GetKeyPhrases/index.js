// for Azure backend we need https
var https = require('https');
var RESTCallHelper = require('../Shared/RESTCallHelper.js')

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
  
    if ((req.query === undefined) || (req.body === undefined)) {
            context.log(`req.query: ${req.query} and req.body ${req.body}`);
            context.res = {
                status: 400,
                body: `Invalid input request.query or request.body are not defined`
            };
            context.log(`Status: ${context.res.status} and Status Message ${context.res.body}`);
            context.done();
            return;
    } 
 
    // grab either the query input or the body input and assign to input var
    var inputDoc = (req.query.document === undefined) ? req.body : req.query;

    // make sure the input argument is there is not error
    if (inputDoc) {

        try {
            var jsonData = RESTCallHelper.FormatMultipleInputs(inputDoc);
            
            context.log(jsonData);

            var result = RESTCallHelper.RESTJSONKeyPhraseCall(context,jsonData);

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

            context.log(`The error was ${err} and the stack was ${err.stack}`);

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
            body: "Please pass a name on the query string or in the request body"
        };
        context.done();
    }

};