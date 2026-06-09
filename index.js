const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { callODataService, getDestinationConfiguration } = require('./odataClient/client');
const bgDataRoutes = require("./routes/bgData");
const lockDetailsRoutes = require("./routes/lockDetails");
const serverDetailsRoutes = require("./routes/serverDetails");
const testSoapRoute = require("./routes/testSoap");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.get("/", (req, res) => {

    res.status(200).send({ data: "Server Running Successfully" });
})


app.use("/bgdata", bgDataRoutes);
app.use("/lockdetails", lockDetailsRoutes);
app.use("/serverdetails", serverDetailsRoutes);
app.use("/testSoap", testSoapRoute);

const port = process.env.PORT || 3005;
app.listen(port, () => {

    console.log(`Listening to the Port ${port}`)

});