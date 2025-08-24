import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// URL do seu Apps Script
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwekLcUpGGEQvzjmaA_YGRpJJ6_S6SbHfw_-kPcW9YiGb86jAwtJoFnlegYMFTXGcB_4Q/exec";

// Middlewares
app.use(cors()); // Permite requisições do GitHub Pages
app.use(bodyParser.json());

// GET /presentes
app.get("/presentes", async (req, res) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    if (!response.ok) throw new Error(`Apps Script retornou status ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Falha ao buscar presentes", details: err.message });
  }
});

// POST /escolher
app.post("/escolher", async (req, res) => {
  try {
    const { item, quem } = req.body;
    if (!item || !quem) return res.status(400).json({ success: false, message: "Campos item e quem são obrigatórios." });

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, quem })
    });

    if (!response.ok) throw new Error(`Apps Script retornou status ${response.status}`);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Falha ao escolher presente", details: err.message });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
