const express = require("express");
const router = express.Router();
const { callOnPremService } = require("../btp/onPremClient");


router.get("/", async (req, res) => {

    try {
        const userJWT = req.headers?.authorization?.split(' ')[1];

        const result = await callOnPremService("A4HTEST", `${process.env.BASE_URL}/DumpInfoSet`, req.query, "GET", userJWT);
        res.status(200).send(result.data);


    } catch (err) {
        console.error("ODATA Error:", err);
        res.status(500).send(err.message || "Error calling ODATA service");
    }


});

module.exports = router;