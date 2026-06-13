const express = require("express");
const router = express.Router();
const { callOnPremService } = require("../btp/onPremClient");


router.get("/", async (req, res) => {

    try {
        const result = await callOnPremService("A4HCLNT001", `${process.env.BASE_URL}/DumpInfoSet`, req.query, "GET");
        res.status(200).send(result.data);


    } catch (err) {
        console.error("ODATA Error:", err);
        res.status(500).send(err.message || "Error calling ODATA service");
    }


});

module.exports = router;