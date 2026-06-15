const express = require('express');
const cors = require('cors');
require('dotenv').config();
const xsenv = require("@sap/xsenv");
const bgDataRoutes = require("./routes/bgData");
const lockDetailsRoutes = require("./routes/lockDetails");
const serverDetailsRoutes = require("./routes/serverDetails");
const dumpInfoRoutes = require("./routes/dumpInfo");
const path = require("path");
const osDataRoutes = require("./routes/osData");
const app = express();

const { v3: {JWTStrategy} } = require("@sap/xssec");

const passport = require("passport");



xsenv.loadEnv();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const services = xsenv.getServices({xsuaa:{tag:'xsuaa'}});

console.log(services);


passport.use("JWT", new JWTStrategy(services.xsuaa));
app.use(passport.initialize());
const authMiddleware = passport.authenticate("JWT", { session: false });


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));




app.get("/", (req, res) => {

    res.status(200).send({ data: "Server Running Successfully" });
})


app.use("/bgdata",  authMiddleware, bgDataRoutes);
app.use("/lockdetails", authMiddleware,  lockDetailsRoutes);
app.use("/serverdetails", authMiddleware, serverDetailsRoutes);
// app.use("/osInfo", osInfoRoutes);
app.use("/osData", authMiddleware, osDataRoutes);
app.use("/dumpInfo", authMiddleware, dumpInfoRoutes);



app.use("/api/bgdata", authMiddleware, bgDataRoutes);
app.use("/api/lockdetails", authMiddleware, lockDetailsRoutes);
app.use("/api/serverdetails", authMiddleware, serverDetailsRoutes);
// app.use("/osInfo", osInfoRoutes);
app.use("/api/osData", authMiddleware, osDataRoutes);
app.use("/api/dumpInfo", authMiddleware, dumpInfoRoutes);



const port = process.env.PORT || 3005
app.listen(port, () => {

    console.log(`Listening to the Port ${port}`)

});