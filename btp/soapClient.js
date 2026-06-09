const CONNECT_CLIENT_ID = process.env.CONNECT_CLIENT_ID;
const CONNECT_CLIENT_SECRET = process.env.CONNECT_CLIENT_SECRET;
const CONNECT_PROXY_HOST = process.env.CONNECT_PROXY_HOST;
const wsdlPath = './staticFiles/vhcala4hci.xml'
const soap = require('soap');
const axios = require('axios');

const { getAccessToken, getDestinationConfiguration } = require("./util");

const destinationUrl = "/destination-configuration/v1/destinations/SAPHOSTCTRL";

let connectivityAccessToken = null;
let destinationConfig = null;



const initSoapClient = async () => {

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


const createSoapClient = async () => {

    const { connectivityAccessToken, destinationConfig } = await initSoapClient();


    const customHttpClient = {


        async request(url, data, callback, exheaders, exoptions) {
            try {
                const proxy = {
                    host: process.env.ENV == 'dev' ? '127.0.0.1' : CONNECT_PROXY_HOST,
                    port: parseInt(process.env.CONNECT_PROXY_PORT, 10),
                    protocol: "http"
                };

                const axiosConfig = {
                    url,
                    method: "POST",
                    data,
                    headers: {
                        ...exheaders,
                        "Proxy-Authorization": `bearer ${connectivityAccessToken}`,
                        "Accept": "application/xml"
                    },
                    proxy,
                    auth: {
                        username: destinationConfig.User,
                        password: destinationConfig.Password
                    }
                };

                const response = await axios(axiosConfig);
                callback(null, response, response.data);
            } catch (err) {
                callback(err);
            }
        }
    }

    soapClient = await soap.createClientAsync(wsdlPath, { httpClient: customHttpClient });
    return soapClient;

}


const callSoapService = async (service) => {

    try {

        const soapClient = await createSoapClient();

        const result = await new Promise((resolve, reject) => {

            soapClient[service]({}, (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            });

        });

        const finalResults = JSON.parse(JSON.stringify(result));

        const osProps =
            finalResults.result.mMembers.item[0].mProperties.item;

        const fsData = finalResults.result.mMembers.item.filter(
            x =>
                x.mProperties?.item?.some(
                    y => y.mValue === "ITSAMFileSystem"
                )
        );

        const formatted = fsData.map(fs => {

            const props = fs.mProperties.item;

            const mountPoint =
                props.find(x => x.mName === "Name")?.mValue;

            const total = Number(
                props.find(x => x.mName === "FileSystemSize")?.mValue
            );

            const available = Number(
                props.find(x => x.mName === "AvailableSpace")?.mValue
            );

            const used = total - available;

            return {
                mountPoint,
                total,
                available,
                used
            };

        });

        return {
            osprops: osProps,
            fsData: formatted
        };

    } catch (err) {

        console.error("SOAP ERROR:", err);

        throw err;
    }

};


module.exports = {
    createSoapClient: createSoapClient,
    callSoapService: callSoapService
}