const { executeHttpRequest  } = require("@sap-cloud-sdk/http-client");
const http = require("http");
const https = require("https");

const newHttpAgent = new http.Agent({keepAlive: false});
const newHttpsAgent = new https.Agent({keepAlive: false});

const callOnPremService = async (destinationName, resource, params, method) => {
 const data = await executeHttpRequest(
        { destinationName: destinationName }, 
        { method: method, params:params,  url: resource, httpAgent: newHttpAgent, httpsAgent: newHttpsAgent},
        
    
    );

    return data;

}

module.exports = {
    callOnPremService: callOnPremService,
   
}