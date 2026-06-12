const express = require("express");

const router = express.Router();

const { callOnPremService } = require("../btp/onPremClient");


router.get("/", async (req, res) => {


       try {
        const result = await callOnPremService("OSA4H", "/", req.query, "GET");
        res.status(200).send(result.data);

    } catch (err) {
        console.error("OS Error:", err);
        res.status(500).send(err.message || "Error calling Os service");
    }

})

router.get("/get-info", async (req, res) => {

   try {
      const result = await callOnPremService("OSA4H", "/get-info", req.query, "GET");

        res.status(200).send(result.data);

    } catch (err) {
        console.error("OS Error:", err);
        res.status(500).send(err.message || "Error calling Os service");
    }

});

router.get("/get-process", async(req, res) => {
    try{
        const result = await callOnPremService("OSA4H", "/get-process", req.query, "GET");
        res.status(200).send(result.data);
    }catch(err) {
        console.error("OS Error:", err);
        res.status(500).send(err.message || "Error calling Os service");
    }
})


module.exports = router;