const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

let gameStateData = {}; // Gelen veriyi saklamak için

app.use(bodyParser.json());
app.use(cors());

app.post("/", (req, res) => {
    gameStateData = req.body;
    console.log("Dota 2 GSI Verisi:", JSON.stringify(gameStateData, null, 2));
    res.status(200).send("Veri alındı");
});

app.get("/data", (req, res) => {
    res.json(gameStateData);
});

app.listen(PORT, () => {
    console.log(`Dota 2 GSI Sunucusu ${PORT} portunda çalışıyor...`);
});
