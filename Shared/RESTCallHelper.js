// for Azure backend we need https
var https = require('https');
var events = require('events');

// Setup dotevn-safe with the environment variable values we want injected into the environment
 var dir = __dirname+"\\.env.example";  // set the path to the sample .env file
 
 // If any of the value in .env.example are no specified in .env file we'll get an exception
 // and override the default path with the one to this directory
 var dirstuff = {
     allowEmptyValues: false,
     sample: dir,
 };
 // load dotenv-safe using our custom settings
 var dotenv = require('dotenv-safe').load(dirstuff);

// Setup the host options used for the calls to Azure Cognitive services
function SetupOptions(host, path, key, length)
{
    var options = {
        hostname: host,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': key,
            'content-length': length
        }
    };   

    return options;
}

const FormatSingleInput = function FormatSingleInput(inputDoc) {
    // package the inbound input into the correct JSON format
    var inputLang = (inputDoc.language == undefined) ? "en" : inputDoc.language;
    var id = "1";
    var inputText = inputDoc.text;

    var inputDoc = `{"documents": [{"language": "${inputLang}","id": "${id}","text": "${inputText}"}]}`; 
    
    return JSON.parse(inputDoc);

}


const FormatMultipleInputs = function FormatMultipleInputs(inputDoc) {
   var input = inputDoc;
    var index = 0;
    var documentsArray = [];

    for (index; index<input.documents.length;index++)
        {
            var lang = (input.documents[index].lang == undefined) ? "en" : input.documents[index].lang;
            var seqNum = (input.id == undefined) ? `${index+1}` : input.id;
            var text = (input.documents[index].text == undefined) ? "" : input.documents[index].text;

            documentsArray.push(`{"language": "${lang}", "id": "${seqNum}", "text":"${text}"}`);

            //context.log(`Added to array ${documentsArray[index].toString()}`);
        }
 
    //return JSON.parse(JSON.stringify(`{"documents": [${documentsArray}]}`));
    return JSON.parse(`{"documents": [${documentsArray}]}`);
}

const RESTJSONKeyPhraseCall =function RESTJSONKeyPhraseCall(context,jsonData) {
    return RESTJSONServiceCall(context,process.env.COG_KEYPHRASE_PATH, jsonData);    
}

const RESTJSONSentimentCall =function RESTJSONSentimentCall(context,jsonData) {
    return RESTJSONServiceCall(context,process.env.COG_SENTIMENT_PATH, jsonData);
}

const RESTJSONServiceCall =function RESTJSONServiceCall(context,ServicePath, jsonData)
{
    var eventEmitter = new events.EventEmitter();

    var options = SetupOptions(process.env.COG_SERVICE_HOST,
        ServicePath, 
        process.env.COG_SERVICE_KEY,
        JSON.stringify(jsonData).length);

	context.log(options);

    try {

        var req1 = https.request(options, function(response){

            context.log(`StatusCode: ${response.statusCode} StatusMessage: ${response.statusMessage}`);

            response.on('data', function(d) {
                context.log('On data '+d);
                eventEmitter.emit('data', d.toString());

            });
        });
        
        req1.on('error',function(e){
            context.log(`Request error: ${e}`);
            eventEmitter.emit('error', e);
        });

        // write the request body
        context.log("write json status: "+req1.write(JSON.stringify(jsonData)));
        req1.end();
    }
    catch (err){
            context.log(`error ${err} - ${err.stack}`);
    }
    finally {
        return eventEmitter;
    }

}


module.exports.FormatSingleInput = FormatSingleInput;
module.exports.FormatMultipleInputs = FormatMultipleInputs;
module.exports.RESTJSONKeyPhraseCall = RESTJSONKeyPhraseCall;
module.exports.RESTJSONSentimentCall = RESTJSONSentimentCall;