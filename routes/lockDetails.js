const express = require("express");
const router = express.Router();
const { initOdataClient, callODataService } = require("../odataClient/client");


router.get("/", async (req, res) => {
    try {

        const client = await initOdataClient();
        const result = await callODataService(`${process.env.BASE_URL}/lockDetailsSet`, req.query, client.destinationConfig, client.connectivityAccessToken);
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.status(200).send(result.data);

    } catch (err) {
        console.error("ODATA Error:", err);
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.status(500).send(err.message || "Error calling ODATA service");
    }
});


module.exports = router;