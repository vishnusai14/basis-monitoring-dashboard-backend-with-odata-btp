const express = require("express");

const router = express.Router();

const { initOsClient, callOsService } = require("../btp/osClient");

router.get("/", async (req, res) => {

   try {
        const client = await initOsClient();
        const result = await callOsService(`/get-info`, req.query, client.destinationConfig, client.connectivityAccessToken);

        res.status(200).send(result.data);

    } catch (err) {
        console.error("OS Error:", err);
        res.status(500).send(err.message || "Error calling Os service");
    }

});


module.exports = router;