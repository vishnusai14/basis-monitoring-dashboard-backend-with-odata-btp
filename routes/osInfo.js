const express = require("express");
const router = express.Router();
const { createSoapClient, callSoapService } = require("../btp/soapClient");


let isProcessing = false;

router.get("/", async (req, res) => {

    if (isProcessing) {

        return res.status(429).json({
            message: "Request already in progress"
        });

    }

    try {

        isProcessing = true;

        const data = await callSoapService("GetComputerSystem");

        res.json(data);

    } catch(err) {

        res.status(500).json(err);

    } finally {

        isProcessing = false;

    }

});

module.exports = router;