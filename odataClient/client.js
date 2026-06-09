require('dotenv').config();
const axios = require('axios');
const DEST_CLIENT_ID = process.env.DEST_CLIENT_ID;
const DEST_CLIENT_SECRET = process.env.DEST_CLIENT_SECRET;
const DEST_CONFIG_URL = process.env.DEST_CONFIG_URL;
const CONNECT_CLIENT_ID = process.env.CONNECT_CLIENT_ID;
const CONNECT_CLIENT_SECRET = process.env.CONNECT_CLIENT_SECRET;
const CONNECT_CONFIG_URL = process.env.CONNECT_CONFIG_URL;
const CONNECT_PROXY_HOST = process.env.CONNECT_PROXY_HOST;
const CONNECT_PROXY_PORT = process.env.CONNECT_PROXY_PORT;
const XUSSA_AUTH_URL = process.env.XUSSA_AUTH_URL;


const oauthUrl = "/oauth/token?grant_type=client_credentials";
const destinationUrl = "/destination-configuration/v1/destinations/A4HCLNT001";

let connectivityAccessToken = null;
let destinationConfig = null;

const getAccessToken = async (clientId, clientSecret) => {

    const tokenUrl = XUSSA_AUTH_URL + oauthUrl;

    const authString = clientId + ":" + clientSecret;

    const base64String = Buffer.from(authString).toString("base64");

    console.log(base64String);

    const config = await axios.post(tokenUrl, {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + base64String,
            "client_id": clientId
        }
    });

    return config;

}


const getDestinationConfiguration = async () => {

    const destUrl = DEST_CONFIG_URL + destinationUrl;

    const accessTokenConfig = await getAccessToken(DEST_CLIENT_ID, DEST_CLIENT_SECRET);
    console.log(accessTokenConfig.data);
    const accessToken = await accessTokenConfig.data.access_token;

    const destConfig = await axios.get(destUrl, {
        headers: {
            "Authorization": "bearer " + accessToken
        }
    });

    return destConfig;


}


const initOdataClient = async () => {

    if (connectivityAccessToken != null && destinationConfig != null) {
        return {
            connectivityAccessToken: connectivityAccessToken,
            destinationConfig: destinationConfig
        }
    } else {
        const destination = await getDestinationConfiguration();
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

    console.log("This is the Destination : ", destination);
    console.log("This is the Connectivity Access Token : ", connectivityToken);
  
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
    getAccessToken: getAccessToken,
    getDestinationConfiguration: getDestinationConfiguration,
    callODataService: callODataService,
    initOdataClient: initOdataClient
}