require('dotenv').config();
const axios = require('axios');
const DEST_CLIENT_ID = process.env.DEST_CLIENT_ID;
const DEST_CLIENT_SECRET = process.env.DEST_CLIENT_SECRET;
const DEST_CONFIG_URL = process.env.DEST_CONFIG_URL;
const XUSSA_AUTH_URL = process.env.XUSSA_AUTH_URL;



const oauthUrl = "/oauth/token?grant_type=client_credentials";

const getAccessToken = async (clientId, clientSecret) => {

    const tokenUrl = XUSSA_AUTH_URL + oauthUrl;

    const authString = clientId + ":" + clientSecret;

    const base64String = Buffer.from(authString).toString("base64");

    //console.log(base64String);

    const config = await axios.post(tokenUrl, {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + base64String,
            "client_id": clientId
        }
    });

    return config;

}


const getDestinationConfiguration = async (destinationUrl) => {

    const destUrl = DEST_CONFIG_URL + destinationUrl;

    const accessTokenConfig = await getAccessToken(DEST_CLIENT_ID, DEST_CLIENT_SECRET);
    //console.log(accessTokenConfig.data);
    const accessToken = await accessTokenConfig.data.access_token;

    const destConfig = await axios.get(destUrl, {
        headers: {
            "Authorization": "bearer " + accessToken
        }
    });

    return destConfig;


}

module.exports = {
    getAccessToken: getAccessToken,
    getDestinationConfiguration: getDestinationConfiguration
}