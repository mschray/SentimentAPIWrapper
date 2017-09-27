# SentimentAPIWrapper
Azure Function Wrapper for Azure Cognitive Services Sentiment Service meant to make using Cognitive Services completely turnkey.  See [the test client](https://github.com/mschray/Allie) for examples actually using the service.

You need to create (or have) a local.setting.json file in the root folder of the project with the following content.  Note you'll need to supply the values for 

- COG_SERVICE_KEY (this will come from your Azure Cognitive Services Account
- APPISNIGHTS_INSTRUCMENTATIONKEY (is you told Azure Functions you want one of these you get one,
- AzureWebJobsDashbard (e.g. your Azure Functions web site will provide this so copy paste
- WEBSITE_CONTENTAZUREFILECONNECTIONSTRING (again your Azure Functions site should already have this)
- WEBSITE_CONTENTSHARE (again your Azure Functions site should already have this)
- WEBSITE_SITE_NAME (again your Azure Functions site should already have this)
- AzureWebJobsStorage (again your Azure Functions site should already have this)


```
json
{
  "IsEncrypted": false,
  "Values": {
    "WEBSITE_SLOT_NAME": "Production",
    "COG_SERVICE_HOST": "westus.api.cognitive.microsoft.com",
    "ROUTING_EXTENSION_VERSION": "~0.2",
    "COG_KEYPHRASE_PATH": "/text/analytics/v2.0/keyphrases",
    "FUNCTIONS_EXTENSION_VERSION": "~1",
    "ScmType": "None",
    "COG_SERVICE_KEY": "",
    "WEBSITE_AUTH_ENABLED": "False",
    "REMOTEDEBUGGINGVERSION": "11.0.611103.400",
    "COG_SENTIMENT_PATH": "/text/analytics/v2.0/sentiment",
    "APPINSIGHTS_INSTRUMENTATIONKEY": "",
    "AzureWebJobsDashboard": "",
    "WEBSITE_NODE_DEFAULT_VERSION": "6.5.0",
    "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING": "",
    "WEBSITE_CONTENTSHARE": "",
    "WEBSITE_SITE_NAME": "",
    "AzureWebJobsStorage": ""
  }
}
```