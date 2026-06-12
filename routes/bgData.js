const express = require("express");
const router = express.Router();
const { callOnPremService } = require("../btp/onPremClient");



router.get("/", async (req, res) => {
    try {
        
        const result = await callOnPremService("A4HCLNT001", `${process.env.BASE_URL}/BgJobDetailsSet`, req.query, "GET");
        res.status(200).send(result.data);

    } catch (err) {
        console.error("ODATA Error:", err);
        res.status(500).send(err.message || "Error calling ODATA service");
    }
});

router.get("/get-summary", async (req, res) => {
    try {

        const result = await callOnPremService("A4HCLNT001",`${process.env.BASE_URL}/BgJobDetailsSummarySet`, req.query, "GET");
        res.status(200).send(result.data);

    } catch (err) {
        console.error("ODATA Error:", err);
        res.status(500).send(err.message || "Error calling ODATA service");
    }

});


router.get("/get-logs", async (req, res) => {
    try {
        const result = await callOnPremService("A4HCLNT001",`${process.env.BASE_URL}/BgJobLogDetailsSet`, req.query, "GET");
        res.status(200).send(result.data);

    } catch (err) {
        console.error("ODATA Error:", err);
        res.status(500).send(err.message || "Error calling ODATA service");
    }

});

module.exports = router;