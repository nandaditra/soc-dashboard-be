const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const phishingRoutes = require("./routes/phising.routes");
require("dotenv").config();
require("./db/connection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use("/api", phishingRoutes);
const PORT = process.env.PORT || 5000;

app.get("/", (req, res)=> {
    res.status(200).json({
        status: true,
        message: 'Welcome'
    })
})

  
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));