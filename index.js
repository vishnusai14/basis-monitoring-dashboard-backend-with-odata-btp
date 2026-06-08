const express = require('express');
const cors = require('cors');
const { callODataService, getDestinationConfiguration } = require('./odataClient/client');
require('dotenv').config();
const bgDataRoutes = require("./routes/bgData");
const lockDetailsRoutes = require("./routes/lockDetails");
const serverDetailsRoutes = require("./routes/serverDetails");
const app = express();
app.use(cors());


app.get("/", async (req, res) => {

    res.status(200).send({data: "Server Running Succesfully"});
})


app.use("/bgdata", bgDataRoutes);
app.use("/lockdetails", lockDetailsRoutes);
app.use("/serverdetails", serverDetailsRoutes);

const port = process.env.PORT || 3000
app.listen(port, () => {

    console.log(`Listening to the Port ${port}`)

});