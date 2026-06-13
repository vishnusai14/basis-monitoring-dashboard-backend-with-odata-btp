const express = require('express');
const cors = require('cors');
require('dotenv').config();
require("@sap/xsenv").loadEnv();
const bgDataRoutes = require("./routes/bgData");
const lockDetailsRoutes = require("./routes/lockDetails");
const serverDetailsRoutes = require("./routes/serverDetails");
const path = require("path");
const osDataRoutes = require("./routes/osData");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));




app.get("/", (req, res) => {

    res.status(200).send({ data: "Server Running Successfully" });
})


app.use("/bgdata", bgDataRoutes);
app.use("/lockdetails", lockDetailsRoutes);
app.use("/serverdetails", serverDetailsRoutes);
// app.use("/osInfo", osInfoRoutes);
app.use("/osData", osDataRoutes);



app.use("/api/bgdata", bgDataRoutes);
app.use("/api/lockdetails", lockDetailsRoutes);
app.use("/api/serverdetails", serverDetailsRoutes);
// app.use("/osInfo", osInfoRoutes);
app.use("/api/osData", osDataRoutes);



const port = process.env.PORT || 3005
app.listen(port, () => {

    console.log(`Listening to the Port ${port}`)

});