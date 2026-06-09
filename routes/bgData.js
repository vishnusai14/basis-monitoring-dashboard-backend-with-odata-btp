const express = require("express");
const router = express.Router();
const { initOdataClient, callODataService } = require("../btp/odataClient");



router.get("/", async (req, res) => {
    try {
        const client = await initOdataClient();
        const result = await callODataService(`${process.env.BASE_URL}/BgJobDetailsSet`, req.query, client.destinationConfig, client.connectivityAccessToken);

        res.status(200).send(result.data);

    } catch (err) {
        console.error("ODATA Error:", err);
        res.status(500).send(err.message || "Error calling ODATA service");
    }
});

router.get("/get-summary", async (req, res) => {
    try {
        const client = await initOdataClient();
        const result = await callODataService(`${process.env.BASE_URL}/BgJobDetailsSummarySet`, req.query, client.destinationConfig, client.connectivityAccessToken);

        res.status(200).send(result.data);

    } catch (err) {
        console.error("ODATA Error:", err);
        res.status(500).send(err.message || "Error calling ODATA service");
    }

});


router.get("/get-logs", async (req, res) => {
    try {
        const client = await initOdataClient();
        const result = await callODataService(`${process.env.BASE_URL}/BgJobLogDetailsSet`, req.query, client.destinationConfig, client.connectivityAccessToken);

        res.status(200).send(result.data);

    } catch (err) {
        console.error("ODATA Error:", err);
        res.status(500).send(err.message || "Error calling ODATA service");
    }

});

module.exports = router;