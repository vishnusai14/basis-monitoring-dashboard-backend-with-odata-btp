const express = require("express");
const router = express.Router();
const soap = require('soap');
const wsdlPath = './staticFiles/vhcala4hci.xml'
const { getAccessToken } = require("../odataClient/client");
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



router.get("/", async (req, res) => {

    const destinationUrl = "/destination-configuration/v1/destinations/SAPHOSTCTRL";


    const destConfigUrl = DEST_CONFIG_URL + destinationUrl;

    const accessTokenConfig = await getAccessToken(DEST_CLIENT_ID, DEST_CLIENT_SECRET);
    const accessToken = await accessTokenConfig.data.access_token;

    const destConfig = await axios.get(destConfigUrl, {
        headers: {
            "Authorization": "bearer " + accessToken
        }
    });

    const destUrl = await destConfig.data.destinationConfiguration.URL;
    const destUser = await destConfig.data.destinationConfiguration.User;
    const destPassword = await destConfig.data.destinationConfiguration.Password;


    const connectTokenConfig = await getAccessToken(CONNECT_CLIENT_ID, CONNECT_CLIENT_SECRET);
    const connectToken = await connectTokenConfig.data.access_token;



    const customHttpClient = {


        async request(url, data, callback, exheaders, exoptions) {
            try {
                const proxy = {
                    host: process.env.CONNECT_PROXY_HOST,
                    port: parseInt(process.env.CONNECT_PROXY_PORT, 10),
                    protocol: "http"
                };

                const axiosConfig = {
                    url,
                    method: "POST",
                    data,
                    headers: {
                        ...exheaders,
                        "Proxy-Authorization": `bearer ${connectToken}`,
                        "Accept": "application/xml"
                    },
                    proxy,
                    auth: {
                        username: destUser,
                        password: destPassword
                    }
                };

                const response = await axios(axiosConfig);
                callback(null, response, response.data);
            } catch (err) {
                callback(err);
            }
        }
    }




    soap.createClient(wsdlPath, { httpClient: customHttpClient }, (err, client) => {

        if (err) {
            console.log(err);
            res.status(500).send({ err });
        };

        // Example: call GetComputerSystem
        client.GetComputerSystem(
            { aArguments: { item: { mKey: "FileSystem", mValue: "*" } } },
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.setHeader("Access-Control-Allow-Origin", "*")
                    res.status(500).send({ err });

                } else {
                    res.setHeader("Access-Control-Allow-Origin", "*")
                    res.status(200).send(JSON.stringify(result, null, 2))
                    console.log(JSON.stringify(result, null, 2));
                }
            }
        );
    });



});


module.exports = router;