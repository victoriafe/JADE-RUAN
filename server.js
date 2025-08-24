const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwekLcUpGGEQvzjmaA_YGRpJJ6_S6SbHfw_-kPcW9YiGb86jAwtJoFnlegYMFTXGcB_4Q/exec";

app.get("/presentes", async (req, res) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Falha ao buscar presentes", details: err.message });
  }
});

app.post("/escolher", async (req, res) => {
  try {
    const { item, quem } = req.body;

    const response = await fetch(`${APPS_SCRIPT_URL}?item=${encodeURIComponent(item)}&quem=${encodeURIComponent(quem)}`, {
      method: "GET"
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Falha ao escolher presente", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
