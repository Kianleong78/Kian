import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Market Analysis endpoint using Gemini 3.6 Flash
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "Gemini API key is not configured in Secrets." });
      }

      const { symbol, name, price, changePercent, marketCap, sector, type } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are a professional financial analyst. Provide a concise 3-paragraph quantitative market overview and sentiment breakdown for:
Symbol: ${symbol} (${name})
Type/Category: ${type || 'Asset'}
Current Price: ${price}
24h/Day Change: ${changePercent}%
Market Cap / Level: ${marketCap || 'N/A'}
Sector: ${sector || 'Financial Markets'}

Structure your response with clear markdown headings:
### Technical & Fundamental Sentiment
### Key Drivers & Catalysts
### Outlook & Risk Rating

Keep the tone professional, objective, data-dense, and highly informative for traders.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("Error generating AI analysis:", error);
      res.status(500).json({ error: error.message || "Failed to generate market analysis." });
    }
  });

  // AI News Digest
  app.post("/api/ai/news-digest", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "Gemini API key is not configured." });
      }

      const { category } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Generate 3 bulleted key takeaways for current macroeconomic trends in ${category || 'Global Financial Markets'} today. Include realistic price drivers, central bank interest rate considerations, earnings developments, and technical momentum. Respond in JSON with an array of 3 bullet points under the key 'takeaways'.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      let jsonResult;
      try {
        jsonResult = JSON.parse(response.text || '{}');
      } catch {
        jsonResult = { takeaways: ["Markets remain focused on central bank policy shifts.", "Tech earnings drive index movements.", "Volatilities stabilize across global bonds."] };
      }

      res.json(jsonResult);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to generate news digest." });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
