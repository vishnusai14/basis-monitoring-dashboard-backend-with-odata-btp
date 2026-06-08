const express = require('express');
const cors = require('cors');
const { callODataService, getDestinationConfiguration } = require('./odataClient/client');
require('dotenv').config();
const bgDataRoutes = require("./routes/bgData");
const lockDetailsRoutes = require("./routes/lockDetails");
const serverDetailsRoutes = require("./routes/serverDetails");
const testSoapRoute = require("./routes/testSoap");
const app = express();
app.use(cors());


app.get("/", async (req, res) => {

    res.status(200).send({data: "Server Running Succesfully"});
})


app.use("/bgdata", bgDataRoutes);
app.use("/lockdetails", lockDetailsRoutes);
app.use("/serverdetails", serverDetailsRoutes);
app.use("/testSoap", testSoapRoute);

const port = process.env.PORT || 3000
app.listen(port, () => {

    console.log(`Listening to the Port ${port}`)

});