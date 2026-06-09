const express = require("express");
const router = express.Router();
const { initOdataClient, callODataService } = require("../btp/odataClient");




router.get("/", async (req, res) => {
    try {

        const client = await initOdataClient();
        const result = await callODataService(`${process.env.BASE_URL}/serverDetailsSet`, req.query, client.destinationConfig, client.connectivityAccessToken);
        res.status(200).send(result.data);

    } catch (err) {
        console.error("ODATA Error:", err);s
        res.status(500).send(err.message || "Error calling ODATA service");
    }
});


router.get("/get-wp-details", async (req, res) => {
    try {
        const client = await initOdataClient();
        const result = await callODataService(`${process.env.BASE_URL}/workProcessDetailsSet`, req.query, client.destinationConfig, client.connectivityAccessToken);
        res.status(200).send(result.data);

    } catch (err) {
        console.error("ODATA Error:", err);
        res.status(500).send(err.message || "Error calling ODATA service");
    }

});

module.exports = router;