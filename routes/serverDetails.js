const express = require("express");
const router = express.Router();
const { callOnPremService } = require("../btp/onPremClient");




router.get("/", async (req, res) => {
    try {

        const result = await callOnPremService("A4HCLNT001",`${process.env.BASE_URL}/serverDetailsSet`, req.query, "GET");
        res.status(200).send(result.data);

    } catch (err) {
        console.error("ODATA Error:", err);s
        res.status(500).send(err.message || "Error calling ODATA service");
    }
});


router.get("/get-wp-details", async (req, res) => {
    try {
        const result = await callOnPremService("A4HCLNT001", `${process.env.BASE_URL}/workProcessDetailsSet`, req.query, "GET");
        res.status(200).send(result.data);

    } catch (err) {
        console.error("ODATA Error:", err);
        res.status(500).send(err.message || "Error calling ODATA service");
    }

});

module.exports = router;