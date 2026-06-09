const CONNECT_CLIENT_ID = process.env.CONNECT_CLIENT_ID;
const CONNECT_CLIENT_SECRET = process.env.CONNECT_CLIENT_SECRET;
const CONNECT_PROXY_HOST = process.env.CONNECT_PROXY_HOST;
const CONNECT_PROXY_PORT = process.env.CONNECT_PROXY_PORT;
const axios = require('axios');

const { getAccessToken, getDestinationConfiguration } = require("./util");

const destinationUrl = "/destination-configuration/v1/destinations/A4HCLNT001";


let connectivityAccessToken = null;
let destinationConfig = null;


const initOdataClient = async () => {

    if (connectivityAccessToken != null && destinationConfig != null) {
        return {
            connectivityAccessToken: connectivityAccessToken,
            destinationConfig: destinationConfig
        }
    } else {
        const destination = await getDestinationConfiguration(destinationUrl);
        destinationConfig = destination.data.destinationConfiguration;
        const connectivityConfig = await getAccessToken(CONNECT_CLIENT_ID, CONNECT_CLIENT_SECRET);
        connectivityAccessToken = await connectivityConfig.data.access_token;

        return {
            connectivityAccessToken: connectivityAccessToken,
            destinationConfig: destinationConfig
        }
    }

}


const callODataService = async (resource, params, destination, connectivityToken) => {

    //console.log("This is the Destination : ", destination);
    //console.log("This is the Connectivity Access Token : ", connectivityToken);
  
    const odataUrl = `${destination.URL}${resource}`;
    const proxy = {
        host: process.env.ENV == 'dev' ? '127.0.0.1' : CONNECT_PROXY_HOST, //CONNECT_PROXY_HOST, Need to change while deploying its
        port: parseInt(CONNECT_PROXY_PORT, 10)
    };


    const headers = {
        "Proxy-Authorization": `bearer ${connectivityToken}`,
        "Accept": "application/json"
    }

    const auth = {
        username: destination.User,
        password: destination.Password
    }

    const response = await axios.get(odataUrl, {
        params: params || {},
        headers: headers,
        proxy: proxy,
        auth: auth
    });

    return response;

}

module.exports = {
    callODataService: callODataService,
    initOdataClient: initOdataClient
}