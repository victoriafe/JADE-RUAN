const express = require("express");
const fetch = require("node-fetch"); // Para chamar o Apps Script
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000; // ou outra porta que quiser

// Permitir que o frontend no GitHub Pages faça requisições
app.use(cors());
app.use(bodyParser.json());

// URL do seu Apps Script
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwekLcUpGGEQvzjmaA_YGRpJJ6_S6SbHfw_-kPcW9YiGb86jAwtJoFnlegYMFTXGcB_4Q/exec";

// Rota GET para buscar presentes
app.get("/presentes", async (req, res) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Falha ao buscar presentes", details: err.message });
  }
});

// Rota POST para reservar presente
app.post("/escolher", async (req, res) => {
  try {
    const { item, quem } = req.body;

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, quem })
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
